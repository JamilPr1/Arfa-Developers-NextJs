'use client'

import { Box } from '@mui/material'
import type { ArfaVoiceState } from '@/hooks/arfa/useArfa'

interface ArfaOrbProps {
  audioLevel: number
  voiceState: ArfaVoiceState
  isUserSpeaking: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export default function ArfaOrb({
  audioLevel,
  voiceState,
  isUserSpeaking,
  onClick,
  size = 'md',
}: ArfaOrbProps) {
  const isActive = voiceState === 'listening' || voiceState === 'speaking' || isUserSpeaking
  const isProcessing = voiceState === 'processing'
  const dim = size === 'md' ? 120 : 56
  const coreDim = dim * 0.55
  const scale = 1 + audioLevel * 0.3 + (isUserSpeaking ? 0.06 : 0)

  return (
    <button
      type="button"
      className="arfa-orb-container"
      onClick={onClick}
      aria-label="Arfa voice assistant"
      style={{ width: dim, height: dim, transform: `scale(${scale})` }}
    >
      <div
        className={`arfa-orb-glow ${isActive ? 'active' : 'inactive'}`}
        style={{ transform: `scale(${1.4 + audioLevel * 0.4})` }}
      />
      <div className="arfa-orb-blobs">
        <div className={`arfa-orb-blob arfa-orb-blob-1 ${isActive ? 'active' : ''}`} style={{ opacity: 0.7 + audioLevel * 0.3 }} />
        <div className={`arfa-orb-blob arfa-orb-blob-2 ${isActive ? 'active' : ''}`} style={{ opacity: 0.6 + audioLevel * 0.3 }} />
        <div className={`arfa-orb-blob arfa-orb-blob-3 ${isActive ? 'active' : ''}`} style={{ opacity: 0.5 + audioLevel * 0.3 }} />
      </div>
      <div
        className={`arfa-orb-core ${isProcessing ? 'processing' : ''}`}
        style={{ width: coreDim, height: coreDim }}
      >
        {isProcessing ? (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <span className="arfa-dot-bounce" />
            <span className="arfa-dot-bounce" />
            <span className="arfa-dot-bounce" />
          </Box>
        ) : (
          <span className="arfa-orb-letter" style={{ fontSize: size === 'md' ? 28 : 18 }}>
            A
          </span>
        )}
      </div>
    </button>
  )
}
