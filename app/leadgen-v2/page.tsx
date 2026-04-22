'use client'

import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Chip, Container, Divider, Paper, TextField, Typography } from '@mui/material'

type Lead = {
  id: string
  title: string
  url: string
  source: string
  intent: 'HIRING'
  confidence: number
}

export default function LeadGenV2Page() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('developer help')
  const [leads, setLeads] = useState<Lead[]>([])
  const [lastFetched, setLastFetched] = useState<string>('')

  const top = useMemo(() => leads.slice(0, 50), [leads])

  const load = async (refresh: boolean) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/leadgen-v2/leads?refresh=${refresh ? 1 : 0}&q=${encodeURIComponent(query)}`, {
        cache: 'no-store',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to load leads')
      setLeads(Array.isArray(json?.leads) ? json.leads : [])
      setLastFetched(new Date().toLocaleString())
    } catch (e: any) {
      setError(e?.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827' }}>
              LeadGen V2
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              V3: Only hiring intent (Reddit hiring subs + YC Jobs + Indie Hackers) • Zero paid APIs • No scoring, strict filter
            </Typography>
            {lastFetched && (
              <Typography variant="caption" color="text.secondary">
                Last updated: {lastFetched}
              </Typography>
            )}
          </Box>

          <Paper sx={{ p: 2, borderRadius: 2, minWidth: 320 }}>
            <Typography sx={{ fontWeight: 800, mb: 1 }}>Search</Typography>
            <TextField
              fullWidth
              size="small"
              label="Query (used for Reddit only)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              <Button variant="outlined" onClick={() => load(false)} disabled={loading}>
                Load cached
              </Button>
              <Button
                variant="contained"
                onClick={() => load(true)}
                disabled={loading}
                sx={{ backgroundColor: '#111827', '&:hover': { backgroundColor: '#0B1220' } }}
              >
                {loading ? 'Refreshing…' : 'Refresh now'}
              </Button>
            </Box>
          </Paper>
        </Box>

        {error && (
          <Paper sx={{ p: 2, mt: 2, borderRadius: 2, border: '1px solid', borderColor: '#FCA5A5', bgcolor: '#FEF2F2' }}>
            <Typography sx={{ fontWeight: 800, color: '#991B1B' }}>{error}</Typography>
          </Paper>
        )}

        <Paper sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontWeight: 900 }}>Top Leads ({top.length})</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Intent-only: HIRING" size="small" variant="outlined" />
              <Chip label="Noise killed (bugs/errors removed)" size="small" variant="outlined" />
            </Box>
          </Box>
          <Divider />

          <Box sx={{ p: 2, display: 'grid', gap: 1.5 }}>
            {top.length === 0 ? (
              <Typography color="text.secondary">No leads yet. Click “Refresh now”.</Typography>
            ) : (
              top.map((l) => (
                <Paper key={l.id} sx={{ p: 2, borderRadius: 2, border: '1px solid #E5E7EB' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ minWidth: 220, flex: 1 }}>
                      <Typography sx={{ fontWeight: 900, color: '#111827' }}>{l.title || '—'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                      <Chip
                        label={`Confidence ${l.confidence || 0}`}
                        color={l.confidence >= 85 ? 'success' : l.confidence >= 70 ? 'warning' : 'default'}
                        size="small"
                      />
                      <Chip label={l.intent} size="small" variant="outlined" />
                      <Chip label={l.source} variant="outlined" size="small" />
                      <Button
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#2563EB' } }}
                      >
                        View Lead
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

