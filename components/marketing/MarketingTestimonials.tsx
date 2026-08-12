'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Rating from '@mui/material/Rating'

const userTestimonials = [
  {
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    name: 'John Smith',
    occupation: 'CEO, TechStart Inc.',
    testimonial:
      'Arfa Developers transformed our business with their innovative web solution. The team was professional, responsive, and delivered beyond our expectations.',
  },
  {
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    name: 'Emily Davis',
    occupation: 'Founder, HealthCare Plus',
    testimonial:
      'Working with Arfa Developers was a game-changer. They built a HIPAA-compliant platform that streamlined our operations and improved patient care significantly.',
  },
  {
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    name: 'Robert Martinez',
    occupation: 'CTO, FinanceFlow',
    testimonial:
      'The mobile app they developed exceeded all our expectations. Clean code, excellent performance, and outstanding user experience. Highly recommended!',
  },
  {
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    name: 'Lisa Anderson',
    occupation: 'Director, EduLearn',
    testimonial:
      'Arfa Developers created an amazing LMS platform for us. Their attention to detail and commitment to quality is unmatched. Truly professional team.',
  },
  {
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    name: 'James Wilson',
    occupation: 'VP Engineering, RealEstate Pro',
    testimonial:
      'From concept to deployment, Arfa Developers guided us through every step. Their expertise in modern technologies helped us build a scalable platform.',
  },
  {
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    name: 'Alex Chen',
    occupation: 'Founder, SaaS Rescue Client',
    testimonial:
      'They took over a half-built product after our freelancers disappeared and got us to production in weeks — not months.',
  },
]

export default function MarketingTestimonials() {
  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 6, sm: 12 },
        pb: { xs: 8, sm: 14 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box sx={{ width: { sm: '100%', md: '60%' }, textAlign: { sm: 'left', md: 'center' } }}>
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
          Client reviews
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          What clients say about working with Arfa Developers — delivery, quality, and support.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {userTestimonials.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.name} sx={{ display: 'flex' }}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
                p: 1,
                boxShadow: 'none',
                '&:hover': { transform: 'none', boxShadow: 1 },
              }}
            >
              <CardContent>
                <Rating value={5} readOnly size="small" sx={{ mb: 1 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  &ldquo;{t.testimonial}&rdquo;
                </Typography>
              </CardContent>
              <CardHeader
                avatar={<Avatar alt={t.name} src={t.avatar} />}
                title={t.name}
                subheader={t.occupation}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
