import fs from 'fs'
import path from 'path'

export interface BrainMemory {
  id: string
  question: string
  answer: string
  normalizedQuestion: string
  hitCount: number
  createdAt: string
  updatedAt: string
}

const BRAIN_REDIS_KEY = 'arfa-brain.json'
const BRAIN_FILE = path.join(process.cwd(), 'lib', 'data', 'arfa-brain.json')
const MAX_MEMORIES = 250
const MAX_RECALL = 8
const MIN_ANSWER_LEN = 40

function normalizeQuestion(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreMatch(query: string, memory: BrainMemory): number {
  const q = normalizeQuestion(query)
  const m = memory.normalizedQuestion
  if (!q || !m) return 0
  if (q === m) return 100
  if (m.includes(q) || q.includes(m)) return 85

  const qTokens = q.split(' ').filter((t) => t.length > 2)
  const mTokens = new Set(m.split(' ').filter((t) => t.length > 2))
  if (!qTokens.length) return 0

  let overlap = 0
  for (const t of qTokens) {
    if (mTokens.has(t)) overlap++
  }
  return (overlap / qTokens.length) * 70
}

async function getRedis() {
  const hasUpstash =
    !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  if (!hasUpstash) return null
  try {
    const { Redis } = await import('@upstash/redis')
    return Redis.fromEnv()
  } catch {
    return null
  }
}

function readBrainFromFile(): BrainMemory[] {
  try {
    if (!fs.existsSync(BRAIN_FILE)) return []
    const raw = fs.readFileSync(BRAIN_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as BrainMemory[]) : []
  } catch {
    return []
  }
}

function writeBrainToFile(memories: BrainMemory[]): void {
  try {
    const dir = path.dirname(BRAIN_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(BRAIN_FILE, JSON.stringify(memories, null, 2), 'utf8')
  } catch (e) {
    console.warn('Arfa brain file write failed:', e)
  }
}

export async function loadBrain(): Promise<BrainMemory[]> {
  try {
    const redis = await getRedis()
    if (redis) {
      const data = (await redis.get(BRAIN_REDIS_KEY)) as BrainMemory[] | null
      if (Array.isArray(data)) return data
    }
  } catch (e) {
    console.warn('Arfa brain Redis read failed:', e)
  }
  return readBrainFromFile()
}

export async function saveBrain(memories: BrainMemory[]): Promise<void> {
  const trimmed = memories.slice(0, MAX_MEMORIES)
  try {
    const redis = await getRedis()
    if (redis) {
      await redis.set(BRAIN_REDIS_KEY, trimmed)
      return
    }
  } catch (e) {
    console.warn('Arfa brain Redis write failed:', e)
  }
  writeBrainToFile(trimmed)
}

/** Recall the best matching prior Q&A pairs for this question. */
export async function recallFromBrain(
  question: string
): Promise<{ memory: BrainMemory; score: number }[]> {
  const memories = await loadBrain()
  if (!memories.length) return []

  return memories
    .map((memory) => ({ memory, score: scoreMatch(question, memory) }))
    .filter((x) => x.score >= 35)
    .sort((a, b) => b.score - a.score || b.memory.hitCount - a.memory.hitCount)
    .slice(0, MAX_RECALL)
}

export function formatBrainForPrompt(
  entries: { memory: BrainMemory; score: number }[] | BrainMemory[]
): string {
  if (!entries.length) return ''
  const list =
    'score' in entries[0]
      ? (entries as { memory: BrainMemory; score: number }[]).map((e) => e.memory)
      : (entries as BrainMemory[])
  return list.map((m, i) => `${i + 1}. Q: ${m.question}\n   A: ${m.answer}`).join('\n')
}

function shouldStoreAnswer(question: string, answer: string): boolean {
  if (!question.trim() || answer.trim().length < MIN_ANSWER_LEN) return false
  const lower = answer.toLowerCase()
  if (lower.includes("i don't have that exact information")) return false
  if (lower.includes("i'm not sure about that")) return false
  if (lower.includes('no speech detected')) return false
  return true
}

/** Persist a successful Q&A so future similar questions get grounded answers faster. */
export async function rememberExchange(question: string, answer: string): Promise<void> {
  if (!shouldStoreAnswer(question, answer)) return

  const normalized = normalizeQuestion(question)
  if (normalized.length < 4) return

  const memories = await loadBrain()
  const now = new Date().toISOString()
  const existingIndex = memories.findIndex((m) => {
    const score = scoreMatch(question, m)
    return score >= 80
  })

  if (existingIndex >= 0) {
    const existing = memories[existingIndex]
    memories[existingIndex] = {
      ...existing,
      question: question.trim(),
      answer: answer.trim(),
      normalizedQuestion: normalized,
      hitCount: (existing.hitCount || 1) + 1,
      updatedAt: now,
    }
  } else {
    memories.unshift({
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      question: question.trim(),
      answer: answer.trim(),
      normalizedQuestion: normalized,
      hitCount: 1,
      createdAt: now,
      updatedAt: now,
    })
  }

  // Keep highest-hit memories if over cap
  if (memories.length > MAX_MEMORIES) {
    memories.sort((a, b) => b.hitCount - a.hitCount || b.updatedAt.localeCompare(a.updatedAt))
    memories.length = MAX_MEMORIES
  }

  await saveBrain(memories)
}
