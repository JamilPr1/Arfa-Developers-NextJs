'use client'

import dynamic from 'next/dynamic'
import { Box, Container, Typography, Card, CardContent, Avatar, Rating } from '@mui/material'
import { motion } from 'framer-motion'

const Slider = dynamic(() => import('react-slick'), { ssr: false })

const testimonials = [
  {
    name: 'John Smith',
    role: 'CEO, TechStart Inc.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    rating: 5,
    review: 'Arfa Developers transformed our business with their innovative web solution. The team was professional, responsive, and delivered beyond our expectations.',
  },
  {
    name: 'Emily Davis',
    role: 'Founder, HealthCare Plus',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    rating: 5,
    review: 'Working with Arfa Developers was a game-changer. They built a HIPAA-compliant platform that streamlined our operations and improved patient care significantly.',
  },
  {
    name: 'Robert Martinez',
    role: 'CTO, FinanceFlow',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    rating: 5,
    review: 'The mobile app they developed exceeded all our expectations. Clean code, excellent performance, and outstanding user experience. Highly recommended!',
  },
  {
    name: 'Lisa Anderson',
    role: 'Director, EduLearn',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    rating: 5,
    review: 'Arfa Developers created an amazing LMS platform for us. Their attention to detail and commitment to quality is unmatched. Truly professional team.',
  },
  {
    name: 'James Wilson',
    role: 'VP Engineering, RealEstate Pro',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    rating: 5,
    review: 'From concept to deployment, Arfa Developers guided us through every step. Their expertise in modern technologies helped us build a scalable platform.',
  },
]

export default function Testimonials() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <Box id="testimonials" sx={{ py: 10, bgcolor: 'background.paper' }}>
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
            Client Reviews
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            What our clients say about working with us
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Slider {...sliderSettings}>
            {testimonials.map((testimonial, index) => (
              <Box key={testimonial.name} sx={{ px: 1 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                      },
                    }}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={testimonial.image}
                          alt={testimonial.name}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        &ldquo;{testimonial.review}&rdquo;
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Slider>
        </Box>

        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          {testimonials.map((testimonial, index) => (
            <Box key={testimonial.name} sx={{ mb: 3 }}>
              <Card
                sx={{
                  p: 3,
                }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={testimonial.image}
                      alt={testimonial.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "{testimonial.review}"
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
