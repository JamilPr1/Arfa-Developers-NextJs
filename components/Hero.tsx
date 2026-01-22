'use client'

import { Box, Container, Typography, Button, Grid } from '@mui/material'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function Hero() {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
        position: 'relative',
        overflow: 'hidden',
        pt: 10,
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.5 },
            '50%': { opacity: 1 },
          },
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  mb: 3,
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
                data-aos="fade-up"
              >
                From Startups to Enterprises – We Build{' '}
                <Box component="span" sx={{ color: '#ffd700' }}>
                  Web Solutions
                </Box>{' '}
                That Scale Globally
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                }}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Transform your digital presence with cutting-edge web solutions. 
                We combine innovation, expertise, and global reach to deliver 
                scalable applications that drive business growth.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavClick('#contact')}
                sx={{
                  background: '#F59E0B',
                  color: '#FFFFFF',
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.9375rem', sm: '1.1rem' },
                  fontWeight: 600,
                  minHeight: { xs: '48px', sm: '56px' },
                  minWidth: { xs: '140px', sm: 'auto' },
                  '&:hover': {
                    background: '#FBBF24',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Get a Free Consultation
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => handleNavClick('#portfolio')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.9375rem', sm: '1.1rem' },
                  fontWeight: 600,
                  minHeight: { xs: '48px', sm: '56px' },
                  minWidth: { xs: '140px', sm: 'auto' },
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                data-aos="fade-up"
                data-aos-delay="300"
              >
                View Portfolio
              </Button>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                  mt: { xs: 4, md: 0 },
                }}
                data-aos="fade-left"
              >
                {['React', 'Next.js', 'Node.js', 'TypeScript'].map((tech, index) => (
                  <Box
                    key={tech}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {tech}
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
