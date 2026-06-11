import { siteConfig } from './siteConfig'

export type UtmParams = {
  source?: string
  medium?: string
  campaign?: string
  content?: string
}

/** Build an absolute URL with standard UTM query params for campaign tracking. */
export function withUtm(path: string, params: UtmParams = {}): string {
  const url = new URL(path.startsWith('http') ? path : `${siteConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`)
  if (params.source) url.searchParams.set('utm_source', params.source)
  if (params.medium) url.searchParams.set('utm_medium', params.medium)
  if (params.campaign) url.searchParams.set('utm_campaign', params.campaign)
  if (params.content) url.searchParams.set('utm_content', params.content)
  return url.toString()
}

/** Facebook sharer URL — always tags traffic as facebook / social. */
export function facebookShareUrl(path: string, campaign = 'website_share'): string {
  const tagged = withUtm(path, {
    source: 'facebook',
    medium: 'social',
    campaign,
  })
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tagged)}`
}

/** Ready-to-paste links for social posts (copy from admin or docs). */
export const SOCIAL_SHARE_LINKS = {
  home: facebookShareUrl('/', 'homepage'),
  projectRescue: facebookShareUrl('/project-rescue', 'project_rescue'),
  webDevUsa: facebookShareUrl('/web-development-agency-usa', 'web_dev_usa'),
  freeAudit: facebookShareUrl('/free-audit', 'free_audit'),
} as const
