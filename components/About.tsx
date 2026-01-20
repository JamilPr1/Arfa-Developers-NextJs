'use client'

import { Box, Container, Typography, Grid, Card, CardContent, Avatar, IconButton } from '@mui/material'
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const teamMembers = [
  {
    name: 'Ahmed Khan',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    location: 'Pakistan',
    linkedin: '#',
    twitter: '#',
    github: '#',
  },
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    location: 'United States',
    linkedin: '#',
    twitter: '#',
    github: '#',
  },
  {
    name: 'Michael Chen',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    location: 'United States',
    linkedin: '#',
    twitter: '#',
    github: '#',
  },
  {
    name: 'Fatima Ali',
    role: 'UX/UI Designer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    location: 'Pakistan',
    linkedin: '#',
    twitter: '#',
    github: '#',
  },
  {
    name: 'David Wilson',
    role: 'DevOps Engineer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    location: 'United States',
    linkedin: '#',
    twitter: '#',
    github: '#',
  },
]

const locations = [
  { name: 'United States', count: 3 },
  { name: 'Pakistan', count: 2 },
]

export default function About() {
  return (
    <Box id="about" sx={{ py: 10, bgcolor: '#F9FAFB' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#1E3A8A',
            }}
          >
            Meet Our Experts
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            A global team of talented professionals dedicated to delivering excellence
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={member.name}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      border: '4px solid',
                      borderColor: '#1E3A8A',
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    📍 {member.location}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      href={member.linkedin}
                      sx={{
                        color: '#1E3A8A',
                        '&:hover': { backgroundColor: '#2563EB', color: 'white' },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      href={member.twitter}
                      sx={{
                        color: '#1E3A8A',
                        '&:hover': { backgroundColor: '#2563EB', color: 'white' },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <TwitterIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      href={member.github}
                      sx={{
                        color: '#1E3A8A',
                        '&:hover': { backgroundColor: '#2563EB', color: 'white' },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            borderRadius: 4,
            p: 4,
            color: 'white',
            textAlign: 'center',
          }}
          data-aos="fade-up"
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Global Presence
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Our team spans across multiple countries, bringing diverse perspectives and expertise
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            {locations.map((location) => (
              <Box key={location.name} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {location.count}
                </Typography>
                <Typography variant="body1">{location.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
