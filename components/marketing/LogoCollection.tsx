'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

const stack = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'OpenAI',
  'LangChain',
  'PostgreSQL',
  'Prisma',
  'Docker',
  'AWS',
  'Vercel',
]

/** Marketing LogoCollection layout — tech/trust strip. */
export default function LogoCollection() {
  return (
    <Box id="logoCollection" sx={{ py: { xs: 3, sm: 5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        sx={{ color: 'text.secondary', mb: 2 }}
      >
        Built with in-demand stacks — web, cloud, AI/ML & automation
      </Typography>
      <Grid container sx={{ justifyContent: 'center', opacity: 0.75 }} spacing={1}>
        {stack.map((name) => (
          <Grid item key={name}>
            <Box
              sx={{
                mx: { xs: 1, sm: 2 },
                my: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'text.secondary',
              }}
            >
              {name}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
