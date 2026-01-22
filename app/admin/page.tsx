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
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'project' | 'blog' | 'promotion' | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)

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

  const [promotionForm, setPromotionForm] = useState({
    text: '',
    link: '/contact',
    active: true,
  })

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
      loadData()
    }
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

  const loadData = async () => {
    try {
      const [projectsRes, blogsRes, promotionsRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/blogs'),
        fetch('/api/admin/promotions'),
      ])
      setProjects(await projectsRes.json())
      setBlogs(await blogsRes.json())
      setPromotions(await promotionsRes.json())
    } catch (err) {
      setError('Failed to load data')
    }
  }

  const handleOpenDialog = (type: 'project' | 'blog' | 'promotion', item?: any) => {
    setDialogType(type)
    setEditingItem(item || null)
    if (item) {
      if (type === 'project') {
        setProjectForm({
          ...item,
          tech: item.tech.join(', '),
        })
      } else if (type === 'blog') {
        setBlogForm(item)
      } else {
        setPromotionForm(item)
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
      } else {
        setPromotionForm({
          text: '',
          link: '/contact',
          active: true,
        })
      }
    }
    setOpenDialog(true)
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
        if (response.ok) {
          setSuccess('Project saved successfully!')
          loadData()
          setOpenDialog(false)
        } else {
          setError('Failed to save project')
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
        if (response.ok) {
          setSuccess('Blog saved successfully!')
          loadData()
          setOpenDialog(false)
        } else {
          setError('Failed to save blog')
        }
      } else if (dialogType === 'promotion') {
        const url = editingItem
          ? `/api/promotions/${editingItem.id}`
          : '/api/promotions'
        const method = editingItem ? 'PUT' : 'POST'
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promotionForm),
        })
        if (response.ok) {
          setSuccess('Promotion saved successfully!')
          loadData()
          setOpenDialog(false)
        } else {
          setError('Failed to save promotion')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type: 'project' | 'blog' | 'promotion', id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return
    setLoading(true)
    try {
      const response = await fetch(`/api/${type}s/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`)
        loadData()
      } else {
        setError('Failed to delete')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (
    type: 'project' | 'blog' | 'promotion',
    id: number,
    currentStatus: boolean
  ) => {
    setLoading(true)
    try {
      const field = type === 'promotion' ? 'active' : 'published'
      const response = await fetch(`/api/${type}s/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentStatus }),
      })
      if (response.ok) {
        loadData()
      }
    } catch (err) {
      setError('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F9FAFB' }}>
          <Container maxWidth="sm">
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
                Admin Login
              </Typography>
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
              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Paper>
          </Container>
        </Box>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <Box sx={{ minHeight: '100vh', bgcolor: '#F9FAFB', pt: 12, pb: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 700 }}>
            Admin Panel
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

          <Paper sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="Projects" />
              <Tab label="Blogs" />
              <Tab label="Promotions" />
            </Tabs>
          </Paper>

          {/* Projects Tab */}
          {tabValue === 0 && (
            <Paper>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Projects</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('project')}
                >
                  Add Project
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Published</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.title}</TableCell>
                        <TableCell>{project.type}</TableCell>
                        <TableCell>
                          <Switch
                            checked={project.published}
                            onChange={() => handleToggleStatus('project', project.id, project.published)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog('project', project)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete('project', project.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Blogs Tab */}
          {tabValue === 1 && (
            <Paper>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Blogs</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('blog')}
                >
                  Add Blog
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Published</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {blogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell>{blog.title}</TableCell>
                        <TableCell>{blog.date}</TableCell>
                        <TableCell>
                          <Switch
                            checked={blog.published}
                            onChange={() => handleToggleStatus('blog', blog.id, blog.published)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog('blog', blog)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete('blog', blog.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Promotions Tab */}
          {tabValue === 2 && (
            <Paper>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Promotions</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('promotion')}
                >
                  Add Promotion
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Text</TableCell>
                      <TableCell>Link</TableCell>
                      <TableCell>Active</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {promotions.map((promotion) => (
                      <TableRow key={promotion.id}>
                        <TableCell>{promotion.text}</TableCell>
                        <TableCell>{promotion.link}</TableCell>
                        <TableCell>
                          <Chip
                            label={promotion.active ? 'Active' : 'Paused'}
                            color={promotion.active ? 'success' : 'default'}
                            icon={promotion.active ? <PlayIcon /> : <PauseIcon />}
                          />
                          <Switch
                            checked={promotion.active}
                            onChange={() => handleToggleStatus('promotion', promotion.id, promotion.active)}
                            sx={{ ml: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog('promotion', promotion)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete('promotion', promotion.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Dialog for Add/Edit */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Add'} {dialogType === 'project' ? 'Project' : dialogType === 'blog' ? 'Blog' : 'Promotion'}
            </DialogTitle>
            <DialogContent>
              {dialogType === 'project' && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Type"
                      value={projectForm.type}
                      onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                      SelectProps={{ native: true }}
                    >
                      <option value="Web App">Web App</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Enterprise">Enterprise</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Image URL"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
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
                      label="Technologies (comma-separated)"
                      value={projectForm.tech}
                      onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Description"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
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
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Excerpt"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      label="Content"
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Image URL"
                      value={blogForm.image}
                      onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date"
                      value={blogForm.date}
                      onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                      InputLabelProps={{ shrink: true }}
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
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Promotion Text"
                      value={promotionForm.text}
                      onChange={(e) => setPromotionForm({ ...promotionForm, text: e.target.value })}
                      placeholder="🎉 Special Offer: Get 20% off..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Link"
                      value={promotionForm.link}
                      onChange={(e) => setPromotionForm({ ...promotionForm, link: e.target.value })}
                      placeholder="/contact"
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
                      label="Active"
                    />
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
