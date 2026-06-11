'use client'

import { Box, Button, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import LinkIcon from '@mui/icons-material/Link'
import { facebookShareUrl } from '@/lib/utm'

type SocialShareProps = {
  path: string
  campaign?: string
  title?: string
}

export default function SocialShare({ path, campaign = 'blog_share', title = 'Share' }: SocialShareProps) {
  const fbUrl = facebookShareUrl(path, campaign)

  const copyLink = async () => {
    const url = `${window.location.origin}${path}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* ignore */
    }
  }

  return (
    <Box sx={{ mt: 4, p: 2, bgcolor: '#F3F4F6', borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Button
          component="a"
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          size="small"
          startIcon={<FacebookIcon />}
          sx={{ bgcolor: '#1877F2', '&:hover': { bgcolor: '#166FE5' } }}
        >
          Share on Facebook
        </Button>
        <Button variant="outlined" size="small" startIcon={<LinkIcon />} onClick={copyLink}>
          Copy link
        </Button>
      </Box>
    </Box>
  )
}
