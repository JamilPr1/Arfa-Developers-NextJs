'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Chip,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Input,
  Link as MuiLink,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Save as SaveIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import Image from 'next/image'

interface Project {
  id: number
  title: string
  type: string
  image: string
  url: string
  tech: string[]
  description: string
  fullDescription: string
  published: boolean
}

interface Blog {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  readTime: string
  published: boolean
}

interface Promotion {
  id: number
  text: string
  link: string
  active: boolean
}

interface Talent {
  id: number
  name: string
  title: string
  image: string
  skills: string[]
  hourlyRate: number
  rating: number
  projectsCompleted: number
  description: string
  experience?: string
  location?: string
  country?: string
  published: boolean
}

interface Lead {
  id: number
  name: string
  email: string
  company: string
  projectType: string
  message: string
  source?: string
  region?: string
  createdAt: string
  slackSent: boolean
  read: boolean
}

// Business Leads + Proposals removed (replaced by AI Automation)

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [talents, setTalents] = useState<Talent[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  // Business Leads + Proposals removed
  const [gscDays, setGscDays] = useState<7 | 28 | 90>(28)
  const [gscLoading, setGscLoading] = useState(false)
  const [gscError, setGscError] = useState('')
  const [gscData, setGscData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'project' | 'blog' | 'promotion' | 'talent' | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [leadDetailsOpen, setLeadDetailsOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    type: 'Web App',
    image: '',
    url: '',
    tech: '',
    description: '',
    fullDescription: '',
    published: true,
  })

  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    published: true,
  })
  const [blogHtmlInput, setBlogHtmlInput] = useState('')
  const [blogEditorMode, setBlogEditorMode] = useState<'manual' | 'html'>('manual')

  const [promotionForm, setPromotionForm] = useState({
    text: '',
    link: '/contact',
    active: true,
  })

  const [talentForm, setTalentForm] = useState({
    name: '',
    title: '',
    image: '',
    skills: '',
    hourlyRate: '',
    rating: '',
    projectsCompleted: '',
    description: '',
    experience: '',
    location: '',
    country: '',
    published: true,
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageError, setImageError] = useState(false)
  const [projectImagePreview, setProjectImagePreview] = useState<string>('')
  const [blogImagePreview, setBlogImagePreview] = useState<string>('')

  // Bulk talent generator (admin utility)
  const [bulkTalentOpen, setBulkTalentOpen] = useState(false)
  const [bulkTalentCount, setBulkTalentCount] = useState('100')
  const [bulkTalentCountries, setBulkTalentCountries] = useState('United States, Pakistan, United Kingdom, Canada, Germany')
  const [bulkTalentMinRate, setBulkTalentMinRate] = useState('20')
  const [bulkTalentMaxRate, setBulkTalentMaxRate] = useState('80')
  const [bulkTalentPublished, setBulkTalentPublished] = useState(true)
  const [bulkTalentRunning, setBulkTalentRunning] = useState(false)
  const [bulkTalentProgress, setBulkTalentProgress] = useState({ done: 0, total: 0 })

  // AI Automation
  type AiLeadStatus = 'new' | 'dismissed' | 'contacted'
  type AiLeadSource = 'reddit' | 'x' | 'indiehackers'
  type AiLead = {
    id: string
    createdAt: string
    source: AiLeadSource
    sourceUrl: string
    title: string
    text: string
    author?: string
    score: number
    matchedKeywords: string[]
    status: AiLeadStatus
    draftResponse?: string
    notes?: string
    respondedAt?: string
  }
  type AiAutomationConfig = {
    enabled: boolean
    minLeadScore: number
    keywords: string[]
    sources: { reddit: boolean; x: boolean; indieHackers: boolean }
    calendlyLink?: string
  }

  const [aiAdminSecret, setAiAdminSecret] = useState('')
  const [aiConfig, setAiConfig] = useState<AiAutomationConfig | null>(null)
  const [aiLeads, setAiLeads] = useState<AiLead[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiScanRunning, setAiScanRunning] = useState(false)
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false)
  const [aiLimit, setAiLimit] = useState('25')
  const [aiSelected, setAiSelected] = useState<AiLead | null>(null)
  const [aiLeadOpen, setAiLeadOpen] = useState(false)
  const [aiDraftRunning, setAiDraftRunning] = useState(false)
  const [aiSaveRunning, setAiSaveRunning] = useState(false)
  const [aiNotesDraft, setAiNotesDraft] = useState('')

  // Helper function to convert ImgBB page URLs to direct image URLs
  const convertToDirectImageUrl = (url: string): string => {
    if (!url) return url
    
    // If it's already a direct image URL, return as is
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.includes('i.ibb.co') || url.includes('i.imgur.com')) {
      return url
    }
    
    // Convert ImgBB page URLs (ibb.co/xxxxx) to direct URLs
    // ImgBB format: https://ibb.co/xxxxx -> https://i.ibb.co/xxxxx/image.jpg
    // We'll need to fetch the page to get the actual image URL, but for now, we'll try common patterns
    if (url.includes('ibb.co/')) {
      // Try to extract the ID and construct direct URL
      const match = url.match(/ibb\.co\/([a-zA-Z0-9]+)/)
      if (match) {
        // Note: This is a best guess. The actual direct URL format may vary.
        // For now, we'll return the original URL and let the browser handle it
        return url
      }
    }
    
    return url
  }

  // Function to validate and set image URL
  const handleImageUrlChange = (url: string) => {
    setTalentForm({ ...talentForm, image: url })
    setImageError(false)
    
    // Convert ImgBB URLs if needed
    const directUrl = convertToDirectImageUrl(url)
    setImagePreview(directUrl)
    
    // Validate image by trying to load it
    if (url) {
      const img = new window.Image()
      img.onload = () => {
        setImageError(false)
      }
      img.onerror = () => {
        setImageError(true)
      }
      img.src = directUrl
    }
  }

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
      loadData()
    }
    const savedSecret = localStorage.getItem('ai_admin_secret') || ''
    if (savedSecret) setAiAdminSecret(savedSecret)
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (data.success) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_authenticated', 'true')
        loadData()
      } else {
        setError(data.message || 'Invalid password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setResetLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/admin/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to request password reset')
      setSuccess('Reset email sent. Please check your inbox.')
    } catch (e: any) {
      setError(e?.message || 'Failed to request password reset')
    } finally {
      setResetLoading(false)
    }
  }

  const loadData = async () => {
    setDataLoading(true)
    setError('')
    try {
      // Use cache busting to ensure fresh data
      const timestamp = Date.now()
      const endpoints = {
        projects: `/api/admin/projects?t=${timestamp}`,
        blogs: `/api/admin/blogs?t=${timestamp}`,
        promotions: `/api/admin/promotions?t=${timestamp}`,
        talent: `/api/admin/talent?t=${timestamp}`,
        leads: `/api/admin/leads?t=${timestamp}`,
      } as const

      const [projectsRes, blogsRes, promotionsRes, talentsRes, leadsRes] = await Promise.all([
        fetch(endpoints.projects, { cache: 'no-store' }),
        fetch(endpoints.blogs, { cache: 'no-store' }),
        fetch(endpoints.promotions, { cache: 'no-store' }),
        fetch(endpoints.talent, { cache: 'no-store' }),
        fetch(endpoints.leads, { cache: 'no-store' }),
      ])

      const failures: string[] = []

      const safeJson = async (res: Response) => {
        try {
          return await res.json()
        } catch {
          return null
        }
      }

      const [projectsData, blogsData, promotionsData, talentsData, leadsData] = await Promise.all([
        safeJson(projectsRes),
        safeJson(blogsRes),
        safeJson(promotionsRes),
        safeJson(talentsRes),
        safeJson(leadsRes),
      ])

      if (!projectsRes.ok) failures.push(`Projects (${projectsRes.status})`)
      if (!blogsRes.ok) failures.push(`Blogs (${blogsRes.status})`)
      if (!promotionsRes.ok) failures.push(`Promotions (${promotionsRes.status})`)
      if (!talentsRes.ok) failures.push(`Talent (${talentsRes.status})`)
      if (!leadsRes.ok) failures.push(`Leads (${leadsRes.status})`)
      
      // Ensure we have arrays and sort by ID (newest first)
      const sortedProjects = Array.isArray(projectsData) 
        ? [...projectsData].sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
        : []
      const sortedBlogs = Array.isArray(blogsData)
        ? [...blogsData].sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
        : []
      const sortedPromotions = Array.isArray(promotionsData)
        ? [...promotionsData].sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
        : []
      const sortedTalents = Array.isArray(talentsData)
        ? [...talentsData].sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
        : []

      const sortedLeads = Array.isArray(leadsData)
        ? [...leadsData].sort((a: any, b: any) => {
            const aCreated = a?.createdAt || a?.created_at
            const bCreated = b?.createdAt || b?.created_at
            const aTime = aCreated ? new Date(aCreated).getTime() : 0
            const bTime = bCreated ? new Date(bCreated).getTime() : 0
            return bTime - aTime
          })
        : []
      
      setProjects(sortedProjects)
      setBlogs(sortedBlogs)
      setPromotions(sortedPromotions)
      setTalents(sortedTalents)
      setLeads(sortedLeads)

      if (failures.length > 0) {
        console.error('Admin data load failures:', {
          failures,
          endpoints,
          projectsError: projectsRes.ok ? null : projectsData,
          blogsError: blogsRes.ok ? null : blogsData,
          promotionsError: promotionsRes.ok ? null : promotionsData,
          talentError: talentsRes.ok ? null : talentsData,
          leadsError: leadsRes.ok ? null : leadsData,
        })
        setError(`Some data failed to load: ${failures.join(', ')}.`)
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please refresh the page.')
    } finally {
      setDataLoading(false)
    }
  }

  const loadGsc = async (days: number) => {
    setGscLoading(true)
    setGscError('')
    try {
      const timestamp = Date.now()
      const res = await fetch(`/api/admin/gsc?days=${days}&t=${timestamp}`, { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to load Search Console data')
      setGscData(json)
    } catch (e: any) {
      setGscError(e?.message || 'Failed to load Search Console data')
    } finally {
      setGscLoading(false)
    }
  }

  const loadAiAutomation = async () => {
    setAiLoading(true)
    try {
      const t = Date.now()
      const [cfgRes, leadsRes] = await Promise.all([
        fetch(`/api/admin/ai-automation/config?t=${t}`, { cache: 'no-store' }),
        fetch(`/api/admin/ai-automation/leads?t=${t}`, { cache: 'no-store' }),
      ])
      const cfgJson = await cfgRes.json().catch(() => ({}))
      const leadsJson = await leadsRes.json().catch(() => ({}))
      if (!cfgRes.ok) throw new Error(cfgJson?.error || 'Failed to load AI config')
      if (!leadsRes.ok) throw new Error(leadsJson?.error || 'Failed to load AI leads')
      setAiConfig(cfgJson?.config || null)
      setAiLeads(Array.isArray(leadsJson?.leads) ? leadsJson.leads : [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load AI automation data')
    } finally {
      setAiLoading(false)
    }
  }

  const runAiScan = async () => {
    setAiScanRunning(true)
    setError('')
    setSuccess('')
    try {
      localStorage.setItem('ai_admin_secret', aiAdminSecret)
      const res = await fetch('/api/admin/ai-automation/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': aiAdminSecret,
        },
        body: JSON.stringify({ limit: parseInt(aiLimit || '25', 10) || 25 }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Scan failed')
      const r = json?.result
      setSuccess(`✅ Scan done. Scanned ${r?.scanned || 0}, inserted ${r?.inserted || 0}. Total stored: ${r?.total || 0}.`)
      await loadAiAutomation()
    } catch (e: any) {
      setError(e?.message || 'Scan failed')
    } finally {
      setAiScanRunning(false)
    }
  }

  const saveAiConfig = async (next: AiAutomationConfig) => {
    setAiSaveRunning(true)
    setError('')
    setSuccess('')
    try {
      localStorage.setItem('ai_admin_secret', aiAdminSecret)
      const res = await fetch('/api/admin/ai-automation/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': aiAdminSecret,
        },
        body: JSON.stringify(next),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to save settings')
      setAiConfig(json?.config || next)
      setSuccess('✅ AI Automation settings saved.')
      setAiSettingsOpen(false)
    } catch (e: any) {
      setError(e?.message || 'Failed to save settings')
    } finally {
      setAiSaveRunning(false)
    }
  }

  const openAiLead = (lead: AiLead) => {
    setAiSelected(lead)
    setAiNotesDraft(lead.notes || '')
    setAiLeadOpen(true)
  }

  const updateAiLead = async (id: string, updates: Partial<AiLead>) => {
    setAiSaveRunning(true)
    setError('')
    setSuccess('')
    try {
      localStorage.setItem('ai_admin_secret', aiAdminSecret)
      const res = await fetch('/api/admin/ai-automation/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': aiAdminSecret,
        },
        body: JSON.stringify({ id, ...updates }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to update lead')
      const updated = json?.lead
      setAiLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
      setAiSelected((prev) => (prev?.id === id ? updated : prev))
      setSuccess('✅ Saved.')
    } catch (e: any) {
      setError(e?.message || 'Failed to update lead')
    } finally {
      setAiSaveRunning(false)
    }
  }

  const generateAiDraft = async (id: string) => {
    setAiDraftRunning(true)
    setError('')
    setSuccess('')
    try {
      localStorage.setItem('ai_admin_secret', aiAdminSecret)
      const res = await fetch('/api/admin/ai-automation/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': aiAdminSecret,
        },
        body: JSON.stringify({ id }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to draft response')
      const updated = json?.lead
      setAiLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
      setAiSelected((prev) => (prev?.id === id ? updated : prev))
      setSuccess('✅ Draft generated.')
    } catch (e: any) {
      setError(e?.message || 'Failed to draft response')
    } finally {
      setAiDraftRunning(false)
    }
  }

  // Lazy-load AI Automation only when tab is opened
  useEffect(() => {
    if (!isAuthenticated) return
    if (tabValue !== 5) return
    loadAiAutomation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, tabValue])

  // Lazy-load GSC only when tab is opened
  useEffect(() => {
    if (!isAuthenticated) return
    if (tabValue !== 6) return
    loadGsc(gscDays)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, tabValue, gscDays])

  const TrendChart = ({
    series,
  }: {
    series: { date: string; clicks: number; impressions: number }[]
  }) => {
    const width = 900
    const height = 260
    const pad = 28

    const safe = Array.isArray(series) ? series : []
    if (safe.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No data available for the selected range.</Typography>
        </Box>
      )
    }

    const maxClicks = Math.max(...safe.map((d) => d.clicks || 0), 1)
    const maxImpr = Math.max(...safe.map((d) => d.impressions || 0), 1)
    const maxY = Math.max(maxClicks, maxImpr)

    const xFor = (i: number) => {
      if (safe.length === 1) return pad
      return pad + (i * (width - pad * 2)) / (safe.length - 1)
    }
    const yFor = (value: number) => {
      const v = value || 0
      const t = v / maxY
      return height - pad - t * (height - pad * 2)
    }

    const clicksPath = safe.map((d, i) => `${xFor(i)},${yFor(d.clicks)}`).join(' ')
    const imprPath = safe.map((d, i) => `${xFor(i)},${yFor(d.impressions)}`).join(' ')

    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
          <Chip label="Clicks" size="small" sx={{ bgcolor: 'rgba(37, 99, 235, 0.12)', color: '#1E3A8A', fontWeight: 700 }} />
          <Chip label="Impressions" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#065F46', fontWeight: 700 }} />
          <Typography variant="body2" color="text.secondary">
            {gscData?.dateRange?.startDate} → {gscData?.dateRange?.endDate}
          </Typography>
        </Box>

        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <svg width={width} height={height} role="img" aria-label="Search Console trend chart">
            <rect x="0" y="0" width={width} height={height} fill="#FFFFFF" />
            <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#E5E7EB" />
            <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#E5E7EB" />

            <polyline fill="none" stroke="#2563EB" strokeWidth="3" points={clicksPath} />
            <polyline fill="none" stroke="#10B981" strokeWidth="3" points={imprPath} />
          </svg>
        </Box>
      </Box>
    )
  }

  const handleLeadReadToggle = async (lead: Lead) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, updates: { read: !lead.read } }),
      })
      const result = await response.json()
      if (response.ok) {
        setSuccess(`Lead marked as ${result.read ? 'read' : 'unread'}.`)
        await loadData()
      } else {
        setError(result.error || 'Failed to update lead')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update lead')
    } finally {
      setLoading(false)
    }
  }

  const openLeadDetails = async (lead: Lead) => {
    setSelectedLead(lead)
    setLeadDetailsOpen(true)

    // Mark as read on open (only if currently unread)
    if (!lead.read) {
      try {
        const response = await fetch('/api/admin/leads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: lead.id, updates: { read: true } }),
        })
        if (response.ok) {
          setSelectedLead((prev) => (prev ? { ...prev, read: true } : prev))
          await loadData()
        }
      } catch {
        // Non-blocking: still allow viewing lead
      }
    }
  }

  const handleDeleteLead = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const result = await response.json()
      if (response.ok) {
        setSuccess('Lead deleted successfully!')
        await loadData()
      } else {
        setError(result.error || 'Failed to delete lead')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete lead')
    } finally {
      setLoading(false)
    }
  }

  const bulkPick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
  const clampInt = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

  const runBulkTalentCreate = async () => {
    const total = clampInt(parseInt(bulkTalentCount || '0', 10) || 0, 1, 500)
    const minRate = parseInt(bulkTalentMinRate || '0', 10) || 20
    const maxRate = parseInt(bulkTalentMaxRate || '0', 10) || 80
    const countries = bulkTalentCountries
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    if (countries.length === 0) {
      setError('Please enter at least one country (comma-separated).')
      return
    }
    if (minRate <= 0 || maxRate <= 0 || minRate > maxRate) {
      setError('Hourly rate range is invalid.')
      return
    }

    const firstNames = ['Ali', 'Ahmed', 'Ayesha', 'Fatima', 'Hassan', 'John', 'Sarah', 'Michael', 'David', 'Emma', 'Noah', 'Sophia', 'Liam', 'Olivia', 'James', 'Mia']
    const lastNames = ['Khan', 'Parvez', 'Smith', 'Johnson', 'Brown', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas']
    const titles = [
      'Senior Full Stack Developer',
      'Frontend Developer (React/Next.js)',
      'Backend Developer (Node.js)',
      'Mobile App Developer (React Native)',
      'DevOps Engineer (AWS)',
      'UI/UX Engineer',
      'Software Engineer',
    ]
    const skillSets = [
      ['React', 'Next.js', 'TypeScript', 'Tailwind'],
      ['Node.js', 'Express', 'PostgreSQL', 'REST APIs'],
      ['React Native', 'TypeScript', 'Firebase', 'CI/CD'],
      ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    ]

    setError('')
    setSuccess('')
    setBulkTalentRunning(true)
    setBulkTalentProgress({ done: 0, total })

    try {
      for (let i = 0; i < total; i++) {
        const country = countries[i % countries.length]
        const name = `${bulkPick(firstNames)} ${bulkPick(lastNames)}`
        const title = bulkPick(titles)
        const skills = bulkPick(skillSets)
        const hourlyRate = Math.floor(minRate + Math.random() * (maxRate - minRate + 1))
        const rating = parseFloat((4.2 + Math.random() * 0.8).toFixed(1))
        const projectsCompleted = Math.floor(10 + Math.random() * 80)
        const description =
          'Experienced developer available for full-time or part-time engagements. Strong communication, clean code, and proven delivery in agile teams.'

        const payload = {
          name,
          title,
          image: '',
          skills,
          hourlyRate,
          rating,
          projectsCompleted,
          description,
          experience: '5+ years (varies)',
          country,
          location: 'Remote',
          published: bulkTalentPublished,
        }

        const resp = await fetch('/api/talent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!resp.ok) {
          const j = await resp.json().catch(() => null)
          throw new Error(j?.error || `Bulk create failed at item ${i + 1} (HTTP ${resp.status})`)
        }

        setBulkTalentProgress({ done: i + 1, total })
      }

      setSuccess(`✅ Created ${total} talent profiles successfully.`)
      setBulkTalentOpen(false)
      await loadData()
    } catch (e: any) {
      setError(e?.message || 'Bulk create failed.')
    } finally {
      setBulkTalentRunning(false)
    }
  }

  const handleOpenDialog = (type: 'project' | 'blog' | 'promotion' | 'talent', item?: any) => {
    setDialogType(type)
    setEditingItem(item || null)
    if (item) {
      if (type === 'project') {
        setProjectForm({
          ...item,
          tech: Array.isArray(item.tech) ? item.tech.join(', ') : item.tech || '',
        })
          setProjectImagePreview(item.image || '')
      } else if (type === 'blog') {
        setBlogForm(item)
          setBlogImagePreview(item.image || '')
          setBlogHtmlInput('')
          setBlogEditorMode('manual')
      } else if (type === 'promotion') {
        setPromotionForm(item)
      } else if (type === 'talent') {
        setTalentForm({
          ...item,
          skills: Array.isArray(item.skills) ? item.skills.join(', ') : item.skills || '',
          hourlyRate: item.hourlyRate?.toString() || '',
          rating: item.rating?.toString() || '',
          projectsCompleted: item.projectsCompleted?.toString() || '',
        })
        setImagePreview(item.image || '')
        setImageError(false)
      }
    } else {
      // Reset forms
      if (type === 'project') {
        setProjectForm({
          title: '',
          type: 'Web App',
          image: '',
          url: '',
          tech: '',
          description: '',
          fullDescription: '',
          published: true,
        })
        setProjectImagePreview('')
        setImageError(false)
      } else if (type === 'blog') {
        setBlogForm({
          title: '',
          excerpt: '',
          content: '',
          image: '',
          date: new Date().toISOString().split('T')[0],
          readTime: '5 min read',
          published: true,
        })
        setBlogImagePreview('')
        setImageError(false)
        setBlogHtmlInput('')
        setBlogEditorMode('manual')
      } else if (type === 'promotion') {
        setPromotionForm({
          text: '',
          link: '/contact',
          active: true,
        })
      } else if (type === 'talent') {
        setTalentForm({
          name: '',
          title: '',
          image: '',
          skills: '',
          hourlyRate: '',
          rating: '',
          projectsCompleted: '',
          description: '',
          experience: '',
          location: '',
          country: '',
          published: true,
        })
      }
    }
    setOpenDialog(true)
  }

  const generateBlogFromHtml = () => {
    try {
      const html = (blogHtmlInput || '').trim()
      if (!html) {
        setError('Please paste HTML first.')
        return
      }

      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // Remove scripts/styles for safety and cleaner output
      doc.querySelectorAll('script, style, noscript').forEach((el) => el.remove())

      const article = doc.querySelector('article')
      const root = article || doc.body

      const h1 = root?.querySelector('h1')?.textContent?.trim()
      const titleTag = doc.querySelector('title')?.textContent?.trim()
      const metaDesc = doc.querySelector('meta[name=\"description\"], meta[property=\"og:description\"]')?.getAttribute('content')?.trim()

      const firstP = Array.from(root?.querySelectorAll('p') || [])
        .map((p) => (p.textContent || '').trim())
        .find((t) => t.length >= 60) || ''

      const imgSrc =
        doc.querySelector('meta[property=\"og:image\"]')?.getAttribute('content')?.trim() ||
        root?.querySelector('img')?.getAttribute('src')?.trim() ||
        ''

      // Prefer <article> markup if present; otherwise use body HTML
      const contentHtml = (article?.outerHTML || doc.body?.innerHTML || html).trim()

      // Rough read time estimate: 200 wpm
      const textForCount = ((root?.textContent || doc.body?.textContent || '') as string).replace(/\s+/g, ' ').trim()
      const wordCount = textForCount ? textForCount.split(' ').length : 0
      const minutes = Math.max(1, Math.round(wordCount / 200))
      const readTime = `${minutes} min read`

      const nextTitle = h1 || titleTag || 'Untitled Blog'
      const nextExcerpt = metaDesc || firstP || 'Summary coming soon.'

      setBlogForm((prev) => ({
        ...prev,
        title: prev.title?.trim() ? prev.title : nextTitle,
        excerpt: prev.excerpt?.trim() ? prev.excerpt : nextExcerpt,
        content: contentHtml,
        image: prev.image?.trim() ? prev.image : imgSrc,
        readTime,
      }))

      if (imgSrc) {
        setBlogImagePreview(imgSrc)
        setImageError(false)
      }

      setSuccess('Generated blog fields from HTML. Review and edit before saving.')
    } catch (e: any) {
      setError(e?.message || 'Failed to parse HTML. Please try again.')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      if (dialogType === 'project') {
        const projectData = {
          ...projectForm,
          tech: projectForm.tech.split(',').map((t) => t.trim()).filter(Boolean),
        }
        const url = editingItem
          ? `/api/projects/${editingItem.id}`
          : '/api/projects'
        const method = editingItem ? 'PUT' : 'POST'
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        })
        const result = await response.json()
        if (response.ok) {
          setSuccess('Project saved successfully!')
          setOpenDialog(false)
          await loadData()
        } else {
          setError(result.error || 'Failed to save project')
        }
      } else if (dialogType === 'blog') {
        const url = editingItem
          ? `/api/blogs/${editingItem.id}`
          : '/api/blogs'
        const method = editingItem ? 'PUT' : 'POST'
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogForm),
        })
        const result = await response.json()
        if (response.ok) {
          setSuccess('Blog saved successfully!')
          setOpenDialog(false)
          await loadData()
        } else {
          setError(result.error || 'Failed to save blog')
        }
      } else if (dialogType === 'promotion') {
        // Validate promotion form
        if (!promotionForm.text || !promotionForm.link) {
          setError('Text and link are required fields')
          setLoading(false)
          return
        }
        
        const url = editingItem
          ? `/api/promotions/${editingItem.id}`
          : '/api/promotions'
        const method = editingItem ? 'PUT' : 'POST'
        
        try {
          console.log('Sending promotion request:', { url, method, data: promotionForm })
          const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(promotionForm),
          })
          
          console.log('Response status:', response.status)
          const result = await response.json()
          console.log('Response data:', result)
          
          if (response.ok) {
            setSuccess('Promotion saved successfully!')
            setOpenDialog(false)
            // Reload data immediately
            await loadData()
          } else {
            console.error('❌ Promotion save error:', result)
            setError(result.error || 'Failed to save promotion')
          }
        } catch (fetchError: any) {
          console.error('❌ Promotion fetch error:', fetchError)
          setError(`Network error: ${fetchError.message || 'Please try again.'}`)
        }
      } else if (dialogType === 'talent') {
        // Validate talent form - check for empty strings and trim
        const name = talentForm.name?.trim()
        const skills = talentForm.skills?.trim()
        const hourlyRate = talentForm.hourlyRate?.trim()
        
        if (!name || !skills || !hourlyRate) {
          setError('Name, skills, and hourly rate are required fields')
          setLoading(false)
          return
        }
        
        // Validate hourly rate is a valid number
        const hourlyRateNum = parseFloat(hourlyRate)
        if (isNaN(hourlyRateNum) || hourlyRateNum <= 0) {
          setError('Hourly rate must be a valid positive number')
          setLoading(false)
          return
        }
        
        // Validate skills array is not empty after splitting
        const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean)
        if (skillsArray.length === 0) {
          setError('Please provide at least one skill')
          setLoading(false)
          return
        }
        
        const talentData = {
          name: name,
          title: talentForm.title?.trim() || '',
          image: talentForm.image?.trim() || '',
          skills: skillsArray,
          hourlyRate: hourlyRateNum,
          rating: parseFloat(talentForm.rating) || 0,
          projectsCompleted: parseInt(talentForm.projectsCompleted) || 0,
          description: talentForm.description?.trim() || '',
          experience: talentForm.experience?.trim() || '',
          location: talentForm.location?.trim() || '',
          country: talentForm.country?.trim() || '',
          published: talentForm.published !== undefined ? talentForm.published : true,
        }
        
        const url = editingItem
          ? `/api/talent/${editingItem.id}`
          : '/api/talent'
        const method = editingItem ? 'PUT' : 'POST'
        
        console.log('Saving talent:', { url, method, data: talentData })
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(talentData),
        })
        
        console.log('Talent save response status:', response.status)
        const result = await response.json()
        console.log('Talent save response data:', result)
        
        if (response.ok) {
          setSuccess('Talent saved successfully!')
          setOpenDialog(false)
          // Reset form
          setTalentForm({
            name: '',
            title: '',
            image: '',
            skills: '',
            hourlyRate: '',
            rating: '',
            projectsCompleted: '',
            description: '',
            experience: '',
            location: '',
            country: '',
            published: true,
          })
          // Reload data immediately
          await loadData()
        } else {
          setError(result.error || 'Failed to save talent')
        }
      }
    } catch (err) {
      console.error('Save error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type: 'project' | 'blog' | 'promotion' | 'talent', id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      console.log(`🗑️ Deleting ${type} ${id}`)
      
      // Handle different API paths for different types
      let apiPath = ''
      if (type === 'talent') {
        apiPath = `/api/talent/${id}`
      } else if (type === 'promotion') {
        apiPath = `/api/promotions/${id}`
      } else {
        apiPath = `/api/${type}s/${id}`
      }
      
      const response = await fetch(apiPath, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      console.log('Delete response status:', response.status)
      const result = await response.json()
      console.log('Delete response data:', result)
      
      if (response.ok) {
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`)
        // Immediately reload data to reflect changes
        await loadData()
      } else {
        console.error('❌ Delete failed:', result)
        setError(result.error || `Failed to delete ${type}. Please try again.`)
      }
    } catch (err: any) {
      console.error('❌ Delete error:', err)
      setError(`Delete error: ${err.message || 'An error occurred. Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (
    type: 'project' | 'blog' | 'promotion' | 'talent',
    id: number,
    currentStatus: boolean
  ) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const field = type === 'promotion' ? 'active' : 'published'
      const newStatus = !currentStatus
      console.log(`Toggling ${type} ${id} ${field} from ${currentStatus} to ${newStatus}`)
      
      // Handle different API paths for different types
      let apiPath = ''
      if (type === 'talent') {
        apiPath = `/api/talent/${id}`
      } else if (type === 'promotion') {
        apiPath = `/api/promotions/${id}`
      } else {
        apiPath = `/api/${type}s/${id}`
      }
      
      const response = await fetch(apiPath, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newStatus }),
      })
      console.log('Toggle response status:', response.status)
      const result = await response.json()
      console.log('Toggle response data:', result)
      
      if (response.ok) {
        const statusText = newStatus ? (type === 'promotion' ? 'activated' : 'published') : (type === 'promotion' ? 'paused' : 'unpublished')
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} ${statusText} successfully!`)
        // Reload data immediately
        await loadData()
      } else {
        setError(result.error || 'Failed to update status')
      }
    } catch (err: any) {
      console.error('❌ Toggle status error:', err)
      setError(`Toggle error: ${err.message || 'Failed to update status'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
    setAnchorEl(null)
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1E3A8A', background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <DashboardIcon sx={{ fontSize: 60, color: '#1E3A8A', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E3A8A' }}>
                Admin CRM Login
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Content Management System
              </Typography>
            </Box>
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              sx={{ mb: 2 }}
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
              sx={{ py: 1.5, backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#2563EB' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
              Forgot password?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Enter your email and we’ll send a reset link.
            </Typography>
            <TextField
              fullWidth
              label="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              sx={{ mb: 1.5 }}
            />
            <Button
              fullWidth
              variant="outlined"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              sx={{ py: 1.2, borderColor: '#1E3A8A', color: '#1E3A8A', '&:hover': { borderColor: '#2563EB' } }}
            >
              {resetLoading ? <CircularProgress size={22} color="inherit" /> : 'Send reset email'}
            </Button>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      {/* CRM Header */}
      <AppBar position="fixed" sx={{ bgcolor: '#1E3A8A', zIndex: 1300 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DashboardIcon />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Admin CRM
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              href="/"
              target="_blank"
              variant="outlined"
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white' } }}
            >
              View Site
            </Button>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: 'white' }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#2563EB' }}>A</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 8, pb: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#1E3A8A' }}>
            Content Management
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, v) => setTabValue(v)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Projects" />
              <Tab label="Blogs" />
              <Tab label="Promotions" />
              <Tab label="Talent" />
              <Tab label={`Leads (${leads.filter((l) => !l.read).length})`} />
              <Tab label="AI Automation" />
              <Tab label="Search Console" />
            </Tabs>
          </Paper>

          {/* Projects Tab */}
          {tabValue === 0 && (
            <Paper sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Projects ({projects.length})</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('project')}
                  sx={{ backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#2563EB' } }}
                >
                  Add Project
                </Button>
              </Box>
              {dataLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading projects...</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Published</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">No projects found. Click &quot;Add Project&quot; to create one.</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        projects.map((project) => (
                          <TableRow key={project.id} hover>
                            <TableCell>{project.title}</TableCell>
                            <TableCell>
                              <Chip label={project.type} size="small" color="primary" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={project.published || false}
                                onChange={() => handleToggleStatus('project', project.id, project.published || false)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                onClick={() => handleOpenDialog('project', project)}
                                size="small"
                                sx={{ color: '#1E3A8A' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDelete('project', project.id)}
                                size="small"
                                sx={{ color: '#EF4444' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}

          {/* Blogs Tab */}
          {tabValue === 1 && (
            <Paper sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Blogs ({blogs.length})</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('blog')}
                  sx={{ backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#2563EB' } }}
                >
                  Add Blog
                </Button>
              </Box>
              {dataLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading blogs...</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Published</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {blogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">No blogs found. Click &quot;Add Blog&quot; to create one.</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        blogs.map((blog) => (
                          <TableRow key={blog.id} hover>
                            <TableCell>{blog.title}</TableCell>
                            <TableCell>{blog.date}</TableCell>
                            <TableCell>
                              <Switch
                                checked={blog.published || false}
                                onChange={() => handleToggleStatus('blog', blog.id, blog.published || false)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                onClick={() => handleOpenDialog('blog', blog)}
                                size="small"
                                sx={{ color: '#1E3A8A' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDelete('blog', blog.id)}
                                size="small"
                                sx={{ color: '#EF4444' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}

          {/* Promotions Tab */}
          {tabValue === 2 && (
            <Paper sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Promotions ({promotions.length})</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('promotion')}
                  sx={{ backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#2563EB' } }}
                >
                  Add Promotion
                </Button>
              </Box>
              {dataLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading promotions...</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Text</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Link</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {promotions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">No promotions found. Click &quot;Add Promotion&quot; to create one.</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        promotions.map((promotion) => (
                          <TableRow key={promotion.id} hover>
                            <TableCell>{promotion.text}</TableCell>
                            <TableCell>
                              <Chip label={promotion.link} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={promotion.active ? 'Active' : 'Paused'}
                                  color={promotion.active ? 'success' : 'default'}
                                  size="small"
                                  icon={promotion.active ? <PlayIcon /> : <PauseIcon />}
                                />
                                <Switch
                                  checked={promotion.active || false}
                                  onChange={() => handleToggleStatus('promotion', promotion.id, promotion.active || false)}
                                  size="small"
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                onClick={() => handleOpenDialog('promotion', promotion)}
                                size="small"
                                sx={{ color: '#1E3A8A' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDelete('promotion', promotion.id)}
                                size="small"
                                sx={{ color: '#EF4444' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}

          {/* Talent Tab */}
          {tabValue === 3 && (
            <Paper sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Talent Profiles ({talents.length})</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setBulkTalentOpen(true)}
                    sx={{ borderColor: '#1E3A8A', color: '#1E3A8A', '&:hover': { borderColor: '#2563EB', color: '#2563EB' } }}
                  >
                    Bulk Add
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('talent')}
                    sx={{ backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#2563EB' } }}
                  >
                    Add Talent
                  </Button>
                </Box>
              </Box>
              {dataLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Rate</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Published</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {talents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">No talent profiles found. Click &quot;Add Talent&quot; to create one.</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        talents.map((talent) => (
                          <TableRow key={talent.id} hover>
                            <TableCell>{talent.name}</TableCell>
                            <TableCell>{talent.title}</TableCell>
                            <TableCell>${talent.hourlyRate}/hr</TableCell>
                            <TableCell>
                              <Chip label={talent.rating?.toFixed(1) || '0.0'} size="small" color="primary" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={talent.published || false}
                                onChange={() => handleToggleStatus('talent', talent.id, talent.published || false)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                onClick={() => handleOpenDialog('talent', talent)}
                                size="small"
                                sx={{ color: '#1E3A8A' }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDelete('talent', talent.id)}
                                size="small"
                                sx={{ color: '#DC2626' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}

          {/* Leads Tab */}
          {tabValue === 4 && (
            <Paper sx={{ borderRadius: 2 }}>
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: 1,
                  borderColor: 'divider',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Leads ({leads.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={`Unread: ${leads.filter((l) => !l.read).length}`} color="primary" variant="outlined" />
                  <Chip label={`Slack sent: ${leads.filter((l) => l.slackSent).length}`} color="success" variant="outlined" />
                </Box>
              </Box>

              {dataLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading leads...</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Project Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">
                              No leads yet. New form submissions will appear here automatically.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        leads.map((lead) => (
                          <TableRow
                            key={lead.id}
                            hover
                            sx={{ cursor: 'pointer' }}
                            onClick={() => openLeadDetails(lead)}
                          >
                            <TableCell>
                              <Typography sx={{ fontWeight: 600, color: '#111827' }}>{lead.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {lead.company || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ color: '#1E3A8A', fontWeight: 600 }}>{lead.email}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {lead.region || '—'} • {lead.source || 'website-form'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={lead.projectType || 'General'} size="small" color="primary" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {(() => {
                                  const t = (lead as any)?.createdAt || (lead as any)?.created_at
                                  return t ? new Date(t).toLocaleString() : '—'
                                })()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                <Chip
                                  label={lead.read ? 'Read' : 'Unread'}
                                  size="small"
                                  color={lead.read ? 'default' : 'success'}
                                />
                                <Chip
                                  label={lead.slackSent ? 'Slack ✓' : 'Slack ✕'}
                                  size="small"
                                  color={lead.slackSent ? 'success' : 'warning'}
                                  variant="outlined"
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openLeadDetails(lead)
                                }}
                                size="small"
                                sx={{ color: '#1E3A8A' }}
                                disabled={loading}
                                title="View lead"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteLead(lead.id)
                                }}
                                size="small"
                                sx={{ color: '#EF4444' }}
                                disabled={loading}
                                title="Delete lead"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}

          {/* AI Automation Tab */}
          {tabValue === 5 && (
            <Paper sx={{ borderRadius: 2 }}>
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: 1,
                  borderColor: 'divider',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    AI Automation Leads ({aiLeads.length})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real sources: Reddit API + X API + Indie Hackers RSS (LinkedIn requires an approved partner API).
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    size="small"
                    label="Admin secret"
                    type="password"
                    value={aiAdminSecret}
                    onChange={(e) => {
                      setAiAdminSecret(e.target.value)
                      localStorage.setItem('ai_admin_secret', e.target.value)
                    }}
                    sx={{ minWidth: 220 }}
                    helperText="AI_AUTOMATION_SECRET or LEADS_IMPORT_SECRET"
                  />
                  <TextField
                    size="small"
                    label="Scan limit"
                    value={aiLimit}
                    onChange={(e) => setAiLimit(e.target.value)}
                    type="number"
                    inputProps={{ min: 5, max: 50 }}
                    sx={{ width: 120 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={() => setAiSettingsOpen(true)}
                    disabled={aiSaveRunning || aiScanRunning}
                  >
                    Settings
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={aiScanRunning ? <CircularProgress size={20} /> : <PlayIcon />}
                    onClick={runAiScan}
                    disabled={aiScanRunning}
                    sx={{ backgroundColor: '#111827', '&:hover': { backgroundColor: '#0B1220' } }}
                  >
                    {aiScanRunning ? 'Scanning...' : 'Scan now'}
                  </Button>
                </Box>
              </Box>

              {aiLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading AI automation...</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Lead</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Keywords</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {aiLeads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">
                              No AI leads yet. Set keywords in Settings and click “Scan now”.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        aiLeads.slice(0, 300).map((l) => (
                          <TableRow
                            key={l.id}
                            hover
                            sx={{ cursor: 'pointer' }}
                            onClick={() => openAiLead(l)}
                          >
                            <TableCell>
                              <Chip
                                label={String(l.score || 0)}
                                size="small"
                                color={l.score >= 85 ? 'success' : l.score >= 70 ? 'warning' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip label={l.source} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell sx={{ maxWidth: 520 }}>
                              <Typography sx={{ fontWeight: 800, color: '#111827' }} noWrap>
                                {l.title || '—'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
                                {l.text || '—'}
                              </Typography>
                              <MuiLink
                                href={l.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                sx={{ display: 'inline-block', mt: 0.5, fontWeight: 700, textDecoration: 'none' }}
                              >
                                Open source
                              </MuiLink>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 260 }}>
                              {(l.matchedKeywords || []).slice(0, 4).map((k) => (
                                <Chip key={k} label={k} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                              ))}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {l.createdAt ? new Date(l.createdAt).toLocaleString() : '—'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={l.status}
                                size="small"
                                color={l.status === 'new' ? 'primary' : l.status === 'contacted' ? 'success' : 'default'}
                                variant={l.status === 'new' ? 'filled' : 'outlined'}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    generateAiDraft(l.id)
                                  }}
                                  disabled={aiDraftRunning}
                                >
                                  Draft
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateAiLead(l.id, { status: 'contacted' })
                                  }}
                                  disabled={aiSaveRunning}
                                >
                                  Contacted
                                </Button>
                                <Button
                                  size="small"
                                  color="inherit"
                                  variant="text"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateAiLead(l.id, { status: 'dismissed' })
                                  }}
                                  disabled={aiSaveRunning}
                                >
                                  Dismiss
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Settings dialog */}
              <Dialog open={aiSettingsOpen} onClose={() => setAiSettingsOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#111827', color: 'white' }}>AI Automation Settings</DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                  {!aiConfig ? (
                    <Alert severity="info">Loading settings...</Alert>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!aiConfig.enabled}
                              onChange={(e) => setAiConfig({ ...aiConfig, enabled: e.target.checked })}
                            />
                          }
                          label="Enabled"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Min score"
                          type="number"
                          value={String(aiConfig.minLeadScore ?? 70)}
                          onChange={(e) => setAiConfig({ ...aiConfig, minLeadScore: Number(e.target.value || 0) })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Calendly link (optional)"
                          value={aiConfig.calendlyLink || ''}
                          onChange={(e) => setAiConfig({ ...aiConfig, calendlyLink: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Keywords (one per line)
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          minRows={6}
                          value={(aiConfig.keywords || []).join('\n')}
                          onChange={(e) => setAiConfig({ ...aiConfig, keywords: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Sources
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={!!aiConfig.sources?.reddit}
                                onChange={(e) => setAiConfig({ ...aiConfig, sources: { ...aiConfig.sources, reddit: e.target.checked } })}
                              />
                            }
                            label="Reddit"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={!!aiConfig.sources?.x}
                                onChange={(e) => setAiConfig({ ...aiConfig, sources: { ...aiConfig.sources, x: e.target.checked } })}
                              />
                            }
                            label="X (Twitter)"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={!!aiConfig.sources?.indieHackers}
                                onChange={(e) =>
                                  setAiConfig({ ...aiConfig, sources: { ...aiConfig.sources, indieHackers: e.target.checked } })
                                }
                              />
                            }
                            label="Indie Hackers"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Button onClick={() => setAiSettingsOpen(false)} disabled={aiSaveRunning}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={aiSaveRunning ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={aiSaveRunning || !aiConfig}
                    sx={{ backgroundColor: '#111827', '&:hover': { backgroundColor: '#0B1220' } }}
                    onClick={() => {
                      if (!aiConfig) return
                      saveAiConfig(aiConfig)
                    }}
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Lead dialog */}
              <Dialog
                open={aiLeadOpen}
                onClose={() => {
                  setAiLeadOpen(false)
                  setAiSelected(null)
                }}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle sx={{ bgcolor: '#111827', color: 'white' }}>AI Lead</DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                  {!aiSelected ? (
                    <Typography color="text.secondary">No lead selected.</Typography>
                  ) : (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ minWidth: 240 }}>
                          <Typography sx={{ fontWeight: 900, color: '#111827' }}>{aiSelected.title || '—'}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {aiSelected.source} • {aiSelected.author || '—'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                          <Chip label={`Score ${aiSelected.score || 0}`} size="small" />
                          <Chip label={aiSelected.status} size="small" variant="outlined" />
                          <MuiLink href={aiSelected.sourceUrl} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 800, textDecoration: 'none' }}>
                            Open source
                          </MuiLink>
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Lead text
                        </Typography>
                        <Paper sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{aiSelected.text || '—'}</Typography>
                        </Paper>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Draft response
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          minRows={4}
                          value={aiSelected.draftResponse || ''}
                          onChange={(e) => setAiSelected({ ...aiSelected, draftResponse: e.target.value })}
                        />
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                          <Button
                            variant="outlined"
                            onClick={() => generateAiDraft(aiSelected.id)}
                            disabled={aiDraftRunning}
                          >
                            {aiDraftRunning ? 'Drafting...' : 'Generate draft (OpenAI)'}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              if (!aiSelected) return
                              navigator.clipboard?.writeText(aiSelected.draftResponse || '')
                              setSuccess('✅ Copied draft to clipboard.')
                            }}
                            disabled={!aiSelected.draftResponse}
                          >
                            Copy
                          </Button>
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Notes
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          minRows={4}
                          value={aiNotesDraft}
                          onChange={(e) => setAiNotesDraft(e.target.value)}
                          placeholder="Your notes, qualification, next steps..."
                        />
                      </Box>
                    </Box>
                  )}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  {aiSelected && (
                    <>
                      <Button
                        variant="outlined"
                        disabled={aiSaveRunning}
                        onClick={() => updateAiLead(aiSelected.id, { notes: aiNotesDraft, draftResponse: aiSelected.draftResponse || '' })}
                      >
                        Save
                      </Button>
                      <Button
                        disabled={aiSaveRunning}
                        onClick={() => updateAiLead(aiSelected.id, { status: 'contacted' })}
                      >
                        Mark Contacted
                      </Button>
                      <Button
                        disabled={aiSaveRunning}
                        onClick={() => updateAiLead(aiSelected.id, { status: 'dismissed' })}
                      >
                        Dismiss
                      </Button>
                    </>
                  )}
                  <Button onClick={() => setAiLeadOpen(false)}>Close</Button>
                </DialogActions>
              </Dialog>
            </Paper>
          )}

          {/* Google Search Console Tab */}
          {tabValue === 6 && (
            <Paper sx={{ borderRadius: 2 }}>
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: 1,
                  borderColor: 'divider',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Google Search Console
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {gscData?.siteUrl || '—'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Chip
                    clickable
                    label="7d"
                    color={gscDays === 7 ? 'primary' : 'default'}
                    variant={gscDays === 7 ? 'filled' : 'outlined'}
                    onClick={() => setGscDays(7)}
                  />
                  <Chip
                    clickable
                    label="28d"
                    color={gscDays === 28 ? 'primary' : 'default'}
                    variant={gscDays === 28 ? 'filled' : 'outlined'}
                    onClick={() => setGscDays(28)}
                  />
                  <Chip
                    clickable
                    label="90d"
                    color={gscDays === 90 ? 'primary' : 'default'}
                    variant={gscDays === 90 ? 'filled' : 'outlined'}
                    onClick={() => setGscDays(90)}
                  />
                  <Button variant="outlined" onClick={() => loadGsc(gscDays)} disabled={gscLoading}>
                    Refresh
                  </Button>
                </Box>
              </Box>

              {gscError && (
                <Box sx={{ p: 3 }}>
                  <Alert severity="error">{gscError}</Alert>
                </Box>
              )}

              {gscLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Loading Search Console data...</Typography>
                </Box>
              ) : (
                <>
                  {/* Totals */}
                  <Box sx={{ p: 3, pt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#F9FAFB' }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Clicks ({gscDays} days)
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3A8A' }}>
                            {gscData?.totals?.clicks ?? '—'}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#F9FAFB' }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Impressions ({gscDays} days)
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: '#065F46' }}>
                            {gscData?.totals?.impressions ?? '—'}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Chart */}
                  <TrendChart series={gscData?.timeSeries || []} />

                  <Divider />

                  {/* Top Queries / Pages */}
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={6}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          Top Queries
                        </Typography>
                        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                                <TableCell sx={{ fontWeight: 700 }}>Query</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">
                                  Clicks
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">
                                  Impr.
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(gscData?.topQueries || []).length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">No query data.</Typography>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                (gscData?.topQueries || []).map((q: any) => (
                                  <TableRow key={q.query}>
                                    <TableCell sx={{ maxWidth: 420 }}>
                                      <Typography sx={{ fontWeight: 600, color: '#111827' }} noWrap>
                                        {q.query}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="right">{q.clicks}</TableCell>
                                    <TableCell align="right">{q.impressions}</TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>

                      <Grid item xs={12} lg={6}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          Top Pages
                        </Typography>
                        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                                <TableCell sx={{ fontWeight: 700 }}>Page</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">
                                  Clicks
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">
                                  Impr.
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(gscData?.topPages || []).length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">No page data.</Typography>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                (gscData?.topPages || []).map((p: any) => (
                                  <TableRow key={p.page}>
                                    <TableCell sx={{ maxWidth: 420 }}>
                                      <Typography sx={{ fontWeight: 600, color: '#111827' }} noWrap>
                                        {p.page}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="right">{p.clicks}</TableCell>
                                    <TableCell align="right">{p.impressions}</TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </Paper>
          )}

          {/* Dialog for Add/Edit */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1E3A8A', color: 'white' }}>
              {editingItem ? 'Edit' : 'Add'} {dialogType === 'project' ? 'Project' : dialogType === 'blog' ? 'Blog' : dialogType === 'promotion' ? 'Promotion' : 'Talent'}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              {dialogType === 'project' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title *"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Type *"
                      value={projectForm.type}
                      onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                      SelectProps={{ native: true }}
                      required
                    >
                      <option value="Web App">Web App</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Enterprise">Enterprise</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>
                      Project Image *
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="project-image-upload"
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          
                          setUploadingImage(true)
                          try {
                            const formData = new FormData()
                            formData.append('file', file)
                            
                            const response = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            })
                            
                            const result = await response.json()
                            
                            if (response.ok && result.url) {
                              setProjectForm({ ...projectForm, image: result.url })
                              setProjectImagePreview(result.url)
                              setSuccess('Image uploaded successfully!')
                            } else {
                              setError(result.error || 'Failed to upload image. Please use URL instead.')
                            }
                          } catch (err: any) {
                            console.error('Upload error:', err)
                            setError('Failed to upload image. Please use URL instead.')
                          } finally {
                            setUploadingImage(false)
                          }
                        }}
                      />
                      <label htmlFor="project-image-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          disabled={uploadingImage}
                          sx={{ mb: 1, mr: 1 }}
                        >
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </Button>
                      </label>
                      {projectImagePreview && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <Image
                            src={projectImagePreview}
                            alt="Project preview"
                            width={200}
                            height={120}
                            style={{ objectFit: 'contain', borderRadius: 8 }}
                            unoptimized
                            onError={() => setImageError(true)}
                            onLoad={() => setImageError(false)}
                          />
                        </Box>
                      )}
                      {imageError && projectImagePreview && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                          Image preview failed. The URL will still be saved. Try using a direct image link.
                        </Alert>
                      )}
                    </Box>
                    <TextField
                      fullWidth
                      label="Image URL *"
                      value={projectForm.image}
                      onChange={(e) => {
                        const url = e.target.value
                        setProjectForm({ ...projectForm, image: url })
                        setProjectImagePreview(url)
                        setImageError(false)
                      }}
                      placeholder="https://i.ibb.co/xxxxx/image.jpg or https://ibb.co/xxxxx"
                      required
                      helperText="Enter image URL or upload an image above"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project URL"
                      value={projectForm.url}
                      onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Technologies (comma-separated) *"
                      value={projectForm.tech}
                      onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                      placeholder="React, Node.js, MongoDB"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Description *"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Full Description"
                      value={projectForm.fullDescription}
                      onChange={(e) => setProjectForm({ ...projectForm, fullDescription: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={projectForm.published}
                          onChange={(e) => setProjectForm({ ...projectForm, published: e.target.checked })}
                        />
                      }
                      label="Published"
                    />
                  </Grid>
                </Grid>
              )}

              {dialogType === 'blog' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', borderColor: 'rgba(30, 58, 138, 0.18)' }}>
                      <Tabs
                        value={blogEditorMode}
                        onChange={(_e, v) => setBlogEditorMode(v)}
                        sx={{ bgcolor: '#F9FAFB', borderBottom: 1, borderColor: 'rgba(30, 58, 138, 0.12)' }}
                      >
                        <Tab value="manual" label="Manual" />
                        <Tab value="html" label="Paste HTML" />
                      </Tabs>

                      {blogEditorMode === 'html' && (
                        <Box sx={{ p: 2, bgcolor: '#F9FAFB' }}>
                          <Typography sx={{ fontWeight: 800, color: '#1E3A8A', mb: 1 }}>
                            Paste HTML to auto-generate
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            Paste your HTML (including an optional <code>{'<article>'}</code>). We will ignore script tags and auto-fill title, excerpt, and content.
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            minRows={6}
                            label="Paste HTML here"
                            value={blogHtmlInput}
                            onChange={(e) => setBlogHtmlInput(e.target.value)}
                          />
                          <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button variant="contained" onClick={generateBlogFromHtml} sx={{ bgcolor: '#1E3A8A', '&:hover': { bgcolor: '#2563EB' } }}>
                              Generate
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setBlogHtmlInput('')
                                setSuccess('HTML cleared.')
                              }}
                              sx={{ borderColor: 'rgba(30, 58, 138, 0.35)', color: '#1E3A8A' }}
                            >
                              Clear
                            </Button>
                          </Box>
                        </Box>
                      )}

                      {blogEditorMode === 'manual' && (
                        <Box sx={{ px: 2, py: 1.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            Use the form below to create a blog manually, or switch to “Paste HTML” to auto-generate.
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>

                  {blogEditorMode === 'manual' && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Title *"
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Excerpt *"
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={8}
                          label="Content (HTML or text) *"
                          value={blogForm.content}
                          onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                          required
                        />
                      </Grid>
                    </>
                  )}

                  {blogEditorMode === 'html' && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Title (auto-filled)"
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                          helperText="Auto-filled from HTML. You can edit if needed."
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Excerpt (auto-filled)"
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                          helperText="Auto-filled from meta description or first paragraph."
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={10}
                          label="Content (HTML)"
                          value={blogForm.content}
                          onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                          helperText="This is the saved HTML content. You can still edit it here."
                          required
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>
                      Blog Image *
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="blog-image-upload"
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          setUploadingImage(true)
                          try {
                            const formData = new FormData()
                            formData.append('file', file)

                            const response = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            })

                            const result = await response.json()

                            if (response.ok && result.url) {
                              setBlogForm({ ...blogForm, image: result.url })
                              setBlogImagePreview(result.url)
                              setSuccess('Image uploaded successfully!')
                            } else {
                              setError(result.error || 'Failed to upload image. Please use URL instead.')
                            }
                          } catch (err: any) {
                            console.error('Upload error:', err)
                            setError('Failed to upload image. Please use URL instead.')
                          } finally {
                            setUploadingImage(false)
                          }
                        }}
                      />
                      <label htmlFor="blog-image-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          disabled={uploadingImage}
                          sx={{ mb: 1, mr: 1 }}
                        >
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </Button>
                      </label>

                      {blogImagePreview && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <Image
                            src={blogImagePreview}
                            alt="Blog preview"
                            width={200}
                            height={120}
                            style={{ objectFit: 'contain', borderRadius: 8 }}
                            unoptimized
                            onError={() => setImageError(true)}
                            onLoad={() => setImageError(false)}
                          />
                        </Box>
                      )}
                      {imageError && blogImagePreview && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                          Image preview failed. The URL will still be saved. Try using a direct image link.
                        </Alert>
                      )}
                    </Box>
                    <TextField
                      fullWidth
                      label="Image URL *"
                      value={blogForm.image}
                      onChange={(e) => {
                        const url = e.target.value
                        setBlogForm({ ...blogForm, image: url })
                        setBlogImagePreview(url)
                        setImageError(false)
                      }}
                      required
                      helperText="Enter image URL or upload an image above"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date *"
                      value={blogForm.date}
                      onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Read Time"
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={blogForm.published}
                          onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                        />
                      }
                      label="Published"
                    />
                  </Grid>
                </Grid>
              )}

              {dialogType === 'promotion' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Promotion Text *"
                      value={promotionForm.text}
                      onChange={(e) => setPromotionForm({ ...promotionForm, text: e.target.value })}
                      placeholder="🎉 Special Offer: Get 20% off..."
                      required
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Link *"
                      value={promotionForm.link}
                      onChange={(e) => setPromotionForm({ ...promotionForm, link: e.target.value })}
                      placeholder="/contact"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={promotionForm.active}
                          onChange={(e) => setPromotionForm({ ...promotionForm, active: e.target.checked })}
                        />
                      }
                      label="Active (will display on website)"
                    />
                  </Grid>
                </Grid>
              )}

              {dialogType === 'talent' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name *"
                      value={talentForm.name}
                      onChange={(e) => setTalentForm({ ...talentForm, name: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Job Title *"
                      value={talentForm.title}
                      onChange={(e) => setTalentForm({ ...talentForm, title: e.target.value })}
                      placeholder="e.g., Senior Full Stack Developer"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>
                      Profile Image *
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="talent-image-upload"
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          
                          setUploadingImage(true)
                          try {
                            const formData = new FormData()
                            formData.append('file', file)
                            
                            const response = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            })
                            
                            const result = await response.json()
                            
                            if (response.ok && result.url) {
                              setTalentForm({ ...talentForm, image: result.url })
                              setImagePreview(result.url)
                            } else {
                              setError(result.error || 'Failed to upload image. Please use URL instead.')
                            }
                          } catch (err: any) {
                            console.error('Upload error:', err)
                            setError('Failed to upload image. Please use URL instead.')
                          } finally {
                            setUploadingImage(false)
                          }
                        }}
                      />
                      <label htmlFor="talent-image-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          disabled={uploadingImage}
                          startIcon={uploadingImage ? <CircularProgress size={20} /> : <AddIcon />}
                          sx={{ mb: 2, mr: 2 }}
                        >
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </Button>
                      </label>
                      <Typography variant="body2" sx={{ color: '#6B7280', mb: 2, display: 'inline-block' }}>
                        or enter URL below
                      </Typography>
                    </Box>
                    {imagePreview && (
                      <Box sx={{ mb: 2 }}>
                        {!imageError ? (
                          <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              style={{
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '2px solid #E5E7EB',
                              }}
                              unoptimized
                              onError={() => setImageError(true)}
                              onLoad={() => setImageError(false)}
                            />
                          </Box>
                        ) : (
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            Unable to load image preview. The URL will still be saved. 
                            Please verify the URL is correct or use a direct image link.
                          </Alert>
                        )}
                      </Box>
                    )}
                    <TextField
                      fullWidth
                      label="Profile Image URL *"
                      value={talentForm.image}
                      onChange={(e) => {
                        const url = e.target.value
                        setTalentForm({ ...talentForm, image: url })
                        handleImageUrlChange(url)
                      }}
                      placeholder="https://i.ibb.co/xxxxx/image.jpg or https://ibb.co/xxxxx"
                      required
                      helperText={
                        imageError 
                          ? "Image preview failed. The URL will still be saved. Try using a direct image link (e.g., https://i.ibb.co/xxxxx/image.jpg)"
                          : "Enter image URL (supports ImgBB page URLs, Imgur, or any direct image link) or upload an image above"
                      }
                      error={imageError && !!imagePreview}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Skills (comma-separated) *"
                      value={talentForm.skills}
                      onChange={(e) => setTalentForm({ ...talentForm, skills: e.target.value })}
                      placeholder="React, Node.js, TypeScript, AWS"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Hourly Rate ($) *"
                      value={talentForm.hourlyRate}
                      onChange={(e) => setTalentForm({ ...talentForm, hourlyRate: e.target.value })}
                      type="number"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Rating (0-5)"
                      value={talentForm.rating}
                      onChange={(e) => setTalentForm({ ...talentForm, rating: e.target.value })}
                      type="number"
                      inputProps={{ min: 0, max: 5, step: 0.1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Projects Completed"
                      value={talentForm.projectsCompleted}
                      onChange={(e) => setTalentForm({ ...talentForm, projectsCompleted: e.target.value })}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description *"
                      value={talentForm.description}
                      onChange={(e) => setTalentForm({ ...talentForm, description: e.target.value })}
                      placeholder="Brief description about the developer..."
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Experience"
                      value={talentForm.experience}
                      onChange={(e) => setTalentForm({ ...talentForm, experience: e.target.value })}
                      placeholder="Years of experience, notable projects, achievements..."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={talentForm.country}
                      onChange={(e) => setTalentForm({ ...talentForm, country: e.target.value })}
                      placeholder="e.g., United States"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City/State (optional)"
                      value={talentForm.location}
                      onChange={(e) => setTalentForm({ ...talentForm, location: e.target.value })}
                      placeholder="e.g., New York, USA"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={talentForm.published}
                          onChange={(e) => setTalentForm({ ...talentForm, published: e.target.checked })}
                        />
                      }
                      label="Published (visible on website)"
                    />
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{ backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#2563EB' } }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Bulk Add Talent Dialog */}
          <Dialog open={bulkTalentOpen} onClose={() => setBulkTalentOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1E3A8A', color: 'white' }}>
              Bulk Add Talent Profiles
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                This will generate placeholder profiles for building a large talent pool. You can edit any profile later.
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Count"
                    value={bulkTalentCount}
                    onChange={(e) => setBulkTalentCount(e.target.value)}
                    type="number"
                    inputProps={{ min: 1, max: 500 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Min $/hr"
                    value={bulkTalentMinRate}
                    onChange={(e) => setBulkTalentMinRate(e.target.value)}
                    type="number"
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Max $/hr"
                    value={bulkTalentMaxRate}
                    onChange={(e) => setBulkTalentMaxRate(e.target.value)}
                    type="number"
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Countries (comma-separated)"
                    value={bulkTalentCountries}
                    onChange={(e) => setBulkTalentCountries(e.target.value)}
                    helperText="Example: United States, Pakistan, United Kingdom, Canada"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={bulkTalentPublished}
                        onChange={(e) => setBulkTalentPublished(e.target.checked)}
                      />
                    }
                    label="Published (visible on website)"
                  />
                </Grid>

                {bulkTalentRunning && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                      Progress: {bulkTalentProgress.done}/{bulkTalentProgress.total}
                    </Typography>
                    <Box sx={{ width: '100%', bgcolor: '#E5E7EB', borderRadius: 999, overflow: 'hidden', height: 10 }}>
                      <Box
                        sx={{
                          width: `${bulkTalentProgress.total ? (bulkTalentProgress.done / bulkTalentProgress.total) * 100 : 0}%`,
                          height: '100%',
                          bgcolor: '#2563EB',
                        }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button onClick={() => setBulkTalentOpen(false)} disabled={bulkTalentRunning}>Cancel</Button>
              <Button
                variant="contained"
                onClick={runBulkTalentCreate}
                disabled={bulkTalentRunning}
                startIcon={bulkTalentRunning ? <CircularProgress size={20} /> : <AddIcon />}
                sx={{ backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#2563EB' } }}
              >
                {bulkTalentRunning ? 'Creating...' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* (Business Leads fetch dialog removed) */}

          {/* Lead Details Dialog */}
          <Dialog
            open={leadDetailsOpen}
            onClose={() => {
              setLeadDetailsOpen(false)
              setSelectedLead(null)
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ bgcolor: '#111827', color: 'white' }}>
              Lead Details
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              {!selectedLead ? (
                <Typography color="text.secondary">No lead selected.</Typography>
              ) : (
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: '#111827' }}>{selectedLead.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedLead.company || '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip
                        label={selectedLead.read ? 'Read' : 'Unread'}
                        size="small"
                        color={selectedLead.read ? 'default' : 'success'}
                      />
                      <Chip
                        label={selectedLead.slackSent ? 'Slack ✓' : 'Slack ✕'}
                        size="small"
                        color={selectedLead.slackSent ? 'success' : 'warning'}
                        variant="outlined"
                      />
                      <Chip
                        label={selectedLead.projectType || 'General'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography sx={{ fontWeight: 700, color: '#1E3A8A' }}>{selectedLead.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Submitted</Typography>
                      <Typography sx={{ fontWeight: 700 }}>
                        {(() => {
                          const t = (selectedLead as any)?.createdAt || (selectedLead as any)?.created_at
                          return t ? new Date(t).toLocaleString() : '—'
                        })()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Region</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{selectedLead.region || '—'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Source</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{selectedLead.source || 'website-form'}</Typography>
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Message
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F9FAFB' }}>
                      <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {selectedLead.message || '—'}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              {selectedLead && (
                <Button
                  onClick={() => handleLeadReadToggle(selectedLead)}
                  disabled={loading}
                  variant="outlined"
                >
                  Mark {selectedLead.read ? 'Unread' : 'Read'}
                </Button>
              )}
              <Button
                onClick={() => {
                  setLeadDetailsOpen(false)
                  setSelectedLead(null)
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* (Business Lead details dialog removed) */}
        </Container>
      </Box>
    </Box>
  )
}
