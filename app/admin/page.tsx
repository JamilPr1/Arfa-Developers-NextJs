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
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
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
  published: boolean
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'project' | 'blog' | 'promotion' | 'talent' | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
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
    published: true,
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageError, setImageError] = useState(false)
  const [projectImagePreview, setProjectImagePreview] = useState<string>('')
  const [blogImagePreview, setBlogImagePreview] = useState<string>('')

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
    setDataLoading(true)
    setError('')
    try {
      // Use cache busting to ensure fresh data
      const timestamp = Date.now()
      const [projectsRes, blogsRes, promotionsRes, talentsRes] = await Promise.all([
        fetch(`/api/admin/projects?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/admin/blogs?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/admin/promotions?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/admin/talent?t=${timestamp}`, { cache: 'no-store' }),
      ])
      
      if (!projectsRes.ok || !blogsRes.ok || !promotionsRes.ok || !talentsRes.ok) {
        throw new Error('Failed to load data')
      }
      
      const projectsData = await projectsRes.json()
      const blogsData = await blogsRes.json()
      const promotionsData = await promotionsRes.json()
      const talentsData = await talentsRes.json()
      
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
      
      setProjects(sortedProjects)
      setBlogs(sortedBlogs)
      setPromotions(sortedPromotions)
      setTalents(sortedTalents)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please refresh the page.')
    } finally {
      setDataLoading(false)
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
      } else if (type === 'blog') {
        setBlogForm(item)
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
          published: true,
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
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      console.log(`Deleting ${type} ${id}`)
      const apiPath = type === 'talent' ? `/api/talent/${id}` : `/api/${type}s/${id}`
      const response = await fetch(apiPath, {
        method: 'DELETE',
      })
      console.log('Delete response status:', response.status)
      const result = await response.json()
      console.log('Delete response data:', result)
      if (response.ok) {
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`)
        await loadData()
      } else {
        setError(result.error || 'Failed to delete')
      }
    } catch (err: any) {
      console.error('❌ Delete error:', err)
      setError(`Delete error: ${err.message || 'An error occurred'}`)
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
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
              sx={{ py: 1.5, backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#2563EB' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
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
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('talent')}
                  sx={{ backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#2563EB' } }}
                >
                  Add Talent
                </Button>
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
                            onError={() => setImageError(true)}
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
                      label="Content *"
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Image URL *"
                      value={blogForm.image}
                      onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                      required
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
                      label="Location"
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
        </Container>
      </Box>
    </Box>
  )
}
