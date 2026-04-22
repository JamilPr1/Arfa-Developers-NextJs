'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

type Job = {
  id: string
  query: string
  total: number
  createdAt: string
  startedAt?: string
  finishedAt?: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  error?: string
  resultCount?: number
}

type Lead = {
  jobId: string
  createdAt: string
  query: string
  name?: string
  address?: string
  website?: string
  phone_number?: string
  reviews_count?: number | null
  reviews_average?: number | null
  place_type?: string
  opens_at?: string
}

export default function AutomationPage() {
  const [secret, setSecret] = useState('')
  const [query, setQuery] = useState('web design agency near me')
  const [total, setTotal] = useState('30')
  const [jobs, setJobs] = useState<Job[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadSearch, setLeadSearch] = useState('')
  const [leadQueryFilter, setLeadQueryFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const latest = useMemo(() => jobs.slice(0, 25), [jobs])
  const latestLeads = useMemo(() => leads.slice(0, 200), [leads])

  const loadJobs = async () => {
    const t = Date.now()
    const res = await fetch(`/api/admin/gmaps/jobs?t=${t}`, { cache: 'no-store' })
    const json = await res.json().catch(() => ({}))
    setJobs(Array.isArray(json?.jobs) ? json.jobs : [])
  }

  const loadLeads = async () => {
    const t = Date.now()
    const res = await fetch(
      `/api/admin/gmaps/leads?limit=200&t=${t}&q=${encodeURIComponent(leadSearch)}&query=${encodeURIComponent(leadQueryFilter)}`,
      { cache: 'no-store' },
    )
    const json = await res.json().catch(() => ({}))
    setLeads(Array.isArray(json?.leads) ? json.leads : [])
  }

  useEffect(() => {
    const saved = localStorage.getItem('gmaps_runner_secret') || ''
    if (saved) setSecret(saved)
    loadJobs()
    loadLeads()
  }, [])

  const createJob = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      localStorage.setItem('gmaps_runner_secret', secret)
      const res = await fetch('/api/admin/gmaps/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-runner-secret': secret,
        },
        body: JSON.stringify({ query, total: parseInt(total || '30', 10) || 30 }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to create job')
      setSuccess('✅ Job queued. Your PC runner will pick it up automatically.')
      await loadJobs()
      await loadLeads()
    } catch (e: any) {
      setError(e?.message || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827' }}>
          Automation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Google Maps Scraper runs on your PC. This page queues jobs on your domain and saves results to your system.
        </Typography>

        {error && (
          <Paper sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <Typography sx={{ fontWeight: 800, color: '#991B1B' }}>{error}</Typography>
          </Paper>
        )}
        {success && (
          <Paper sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#ECFDF5', border: '1px solid #86EFAC' }}>
            <Typography sx={{ fontWeight: 800, color: '#065F46' }}>{success}</Typography>
          </Paper>
        )}

        <Paper sx={{ mt: 3, p: 2, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 900, mb: 1 }}>Queue a Google Maps scrape</Typography>
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <TextField
              label="Runner secret"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              helperText="Set GMAPS_RUNNER_SECRET (or reuse AI_AUTOMATION_SECRET / LEADS_IMPORT_SECRET) in Vercel."
            />
            <TextField label="Search query" value={query} onChange={(e) => setQuery(e.target.value)} />
            <TextField
              label="Total results"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              type="number"
              inputProps={{ min: 1, max: 200 }}
            />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={createJob}
                disabled={loading}
                sx={{ backgroundColor: '#111827', '&:hover': { backgroundColor: '#0B1220' } }}
              >
                {loading ? 'Queuing…' : 'Run scraper on my PC'}
              </Button>
              <Button variant="outlined" onClick={loadJobs} disabled={loading}>
                Refresh jobs
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontWeight: 900 }}>Jobs</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Queued → Running → Completed" size="small" variant="outlined" />
              <Chip label="Results saved to gmaps-leads.json" size="small" variant="outlined" />
            </Box>
          </Box>
          <Divider />
          <Box sx={{ p: 2, display: 'grid', gap: 1.5 }}>
            {latest.length === 0 ? (
              <Typography color="text.secondary">No jobs yet. Queue one above.</Typography>
            ) : (
              latest.map((j) => (
                <Paper key={j.id} sx={{ p: 2, borderRadius: 2, border: '1px solid #E5E7EB' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ minWidth: 240, flex: 1 }}>
                      <Typography sx={{ fontWeight: 900, color: '#111827' }}>{j.query}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(j.createdAt).toLocaleString()} • total {j.total}
                      </Typography>
                      {j.error && (
                        <Typography variant="body2" sx={{ color: '#991B1B', fontWeight: 700, mt: 0.5 }}>
                          {j.error}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                      <Chip
                        label={j.status}
                        size="small"
                        color={j.status === 'completed' ? 'success' : j.status === 'failed' ? 'error' : 'warning'}
                        variant={j.status === 'queued' ? 'outlined' : 'filled'}
                      />
                      <Chip label={`Results ${j.resultCount ?? 0}`} size="small" variant="outlined" />
                    </Box>
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        </Paper>

        <Paper sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontWeight: 900 }}>Leads (saved)</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                label="Filter by query"
                value={leadQueryFilter}
                onChange={(e) => setLeadQueryFilter(e.target.value)}
              />
              <TextField
                size="small"
                label="Search name/address/website/phone"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
              />
              <Button variant="outlined" onClick={loadLeads} disabled={loading}>
                Refresh leads
              </Button>
            </Box>
          </Box>
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Business</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Website</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Query</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Saved</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No leads saved yet. Run a job and then click “Refresh leads”.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  latestLeads.map((l) => (
                    <TableRow key={`${l.jobId}:${l.createdAt}:${l.name || ''}`} hover>
                      <TableCell sx={{ fontWeight: 800, color: '#111827', maxWidth: 260 }}>
                        {l.name || '—'}
                        <Typography variant="body2" color="text.secondary">
                          {l.place_type || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 260 }}>
                        {l.website ? (
                          <a href={l.website} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, textDecoration: 'none' }}>
                            {l.website}
                          </a>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>{l.phone_number || '—'}</TableCell>
                      <TableCell>
                        {l.reviews_average != null ? (
                          <Chip label={`${l.reviews_average} (${l.reviews_count ?? 0})`} size="small" variant="outlined" />
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 320 }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {l.address || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 220 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                          {l.query || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {l.createdAt ? new Date(l.createdAt).toLocaleString() : '—'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  )
}

