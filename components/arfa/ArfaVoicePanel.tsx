'use client'

import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import MicOffIcon from '@mui/icons-material/MicOff'
import MicIcon from '@mui/icons-material/Mic'
import ArfaOrb from './ArfaOrb'
import { useArfaContext } from '@/contexts/ArfaContext'

function stateLabel(state: string, isMuted: boolean, isUserSpeaking: boolean): string {
  if (isMuted) return 'Microphone muted — tap orb to unmute'
  switch (state) {
    case 'ready':
      return 'Tap the orb to start talking'
    case 'listening':
      return isUserSpeaking ? 'Hearing you…' : 'Listening — speak anytime'
    case 'processing':
      return 'Thinking…'
    case 'speaking':
      return 'Arfa is speaking — tap orb to stop'
    default:
      return ''
  }
}

export default function ArfaVoicePanel() {
  const {
    messages,
    voiceState,
    isUserSpeaking,
    isMuted,
    audioLevel,
    micError,
    liveCaption,
    handleOrbClick,
    toggleMute,
  } = useArfaContext()

  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant')
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  const displayText =
    liveCaption ||
    (voiceState === 'speaking' || voiceState === 'processing' ? lastAssistant?.content : null) ||
    lastUser?.content ||
    (messages.length === 1 ? lastAssistant?.content : null) ||
    ''

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        bgcolor: '#0a0f1a',
        color: 'white',
        px: 2,
        py: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(66,133,244,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, zIndex: 1, pt: 1 }}>
        <ArfaOrb
          audioLevel={audioLevel}
          voiceState={voiceState}
          isUserSpeaking={isUserSpeaking}
          onClick={handleOrbClick}
          size="md"
        />

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: 0.5 }}>
          {stateLabel(voiceState, isMuted, isUserSpeaking)}
        </Typography>

        <Box sx={{ minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
          {displayText ? (
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: liveCaption ? 'rgba(255,255,255,0.9)' : voiceState === 'speaking' ? 'white' : 'rgba(255,255,255,0.6)',
                fontWeight: 300,
                lineHeight: 1.6,
                fontSize: '0.95rem',
              }}
            >
              {displayText}
              {liveCaption && (
                <Box component="span" sx={{ display: 'inline-block', width: 2, height: 18, bgcolor: '#22d3ee', ml: 0.5, animation: 'arfaPulse 1s infinite', verticalAlign: 'middle' }} />
              )}
            </Typography>
          ) : voiceState === 'ready' ? (
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: 280 }}>
              Ask about our services, pricing, project rescue, or how to get started.
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, pb: 1 }}>
        {voiceState !== 'ready' && (
          <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
            <IconButton
              onClick={toggleMute}
              size="small"
              sx={{
                color: isMuted ? '#f87171' : 'rgba(255,255,255,0.6)',
                bgcolor: isMuted ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.05)',
                border: '1px solid',
                borderColor: isMuted ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.1)',
              }}
            >
              {isMuted ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {micError && (
        <Typography variant="caption" sx={{ color: '#fbbf24', textAlign: 'center', mt: 1 }}>
          {micError}
        </Typography>
      )}
    </Box>
  )
}
