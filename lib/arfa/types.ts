export interface TranscriptMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ArfaAction {
  type: 'navigate' | 'open_contact' | 'none'
  payload?: { url?: string }
}

export interface ArfaResponse {
  text: string
  intent: string
  action: ArfaAction
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
