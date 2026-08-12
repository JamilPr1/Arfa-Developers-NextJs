import { Box, Card, Chip, Divider, Typography } from '@mui/material'
import { CheckCircle as CheckIcon, FormatQuote as QuoteIcon } from '@mui/icons-material'

export function ResultsSummary({
  title = 'Results Summary',
  metrics,
  note,
}: {
  title?: string
  metrics: string[]
  note?: string
}) {
  return (
    <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5, color: '#0C1222' }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {metrics.map((m) => (
          <Box key={m} sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <CheckIcon sx={{ color: '#10B981', mr: 1.25, mt: 0.2 }} />
            <Typography sx={{ color: '#111827', fontWeight: 700, lineHeight: 1.7 }}>{m}</Typography>
          </Box>
        ))}
      </Box>
      {note ? (
        <Typography variant="body2" sx={{ mt: 2, color: '#374151', lineHeight: 1.8 }}>
          {note}
        </Typography>
      ) : null}
    </Card>
  )
}

export function TestimonialBlock({
  quote,
  author,
  role,
  company,
  tags = [],
  disclaimer = 'Note: details anonymized to respect client confidentiality.',
}: {
  quote: string
  author: string
  role?: string
  company?: string
  tags?: string[]
  disclaimer?: string
}) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(30,58,138,0.08) 0%, rgba(37,99,235,0.08) 100%)',
        border: '1px solid rgba(37,99,235,0.15)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
        <QuoteIcon sx={{ color: '#0C1222', mt: 0.2 }} />
        <Typography sx={{ color: '#111827', fontWeight: 700, lineHeight: 1.85 }}>
          {quote}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
        {tags.map((t) => (
          <Chip
            key={t}
            label={t}
            size="small"
            sx={{
              bgcolor: '#EFF6FF',
              color: '#0C1222',
              fontWeight: 700,
            }}
          />
        ))}
      </Box>

      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 800 }}>
        {author}
        {role ? ` — ${role}` : ''}
        {company ? `, ${company}` : ''}
      </Typography>

      {disclaimer ? (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#374151' }}>
          {disclaimer}
        </Typography>
      ) : null}
    </Card>
  )
}

