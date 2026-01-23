/**
 * Utility functions for handling image URLs
 */

/**
 * Converts ImgBB page URLs to direct image URLs
 * ImgBB page URLs: https://ibb.co/xxxxx
 * Direct URLs: https://i.ibb.co/xxxxx/image.jpg
 * 
 * Note: This function attempts to convert common patterns.
 * For ImgBB, the actual direct URL requires fetching the page.
 * This is a best-effort conversion.
 */
export function convertToDirectImageUrl(url: string): string {
  if (!url) return url
  
  // If it's already a direct image URL, return as is
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    return url
  }
  
  // Check if it's already a direct image host
  if (url.includes('i.ibb.co') || url.includes('i.imgur.com') || url.includes('cdn.')) {
    return url
  }
  
  // Convert ImgBB page URLs (ibb.co/xxxxx) - try to construct direct URL
  if (url.includes('ibb.co/')) {
    const match = url.match(/ibb\.co\/([a-zA-Z0-9]+)/)
    if (match) {
      const id = match[1]
      // ImgBB direct URLs typically follow: https://i.ibb.co/{id}/{filename}
      // Since we don't know the filename, we'll return the original URL
      // The browser will handle it, or we can use a proxy/fetch approach
      return url
    }
  }
  
  // Convert Imgur page URLs (imgur.com/xxxxx) to direct URLs
  if (url.includes('imgur.com/') && !url.includes('i.imgur.com')) {
    const match = url.match(/imgur\.com\/([a-zA-Z0-9]+)/)
    if (match) {
      const id = match[1]
      return `https://i.imgur.com/${id}.jpg`
    }
  }
  
  return url
}

/**
 * Validates if a URL is likely a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false
  
  // Check for common image extensions
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i)) {
    return true
  }
  
  // Check for known image hosting domains
  const imageHosts = [
    'i.ibb.co',
    'ibb.co',
    'i.imgur.com',
    'imgur.com',
    'images.unsplash.com',
    'via.placeholder.com',
    'cdn.',
    'cloudinary.com',
    'amazonaws.com',
  ]
  
  return imageHosts.some(host => url.includes(host))
}

/**
 * Fetches the actual direct image URL from an ImgBB page URL
 * This requires making a request to the page and extracting the image URL
 */
export async function fetchDirectImageUrlFromImgBB(pageUrl: string): Promise<string | null> {
  try {
    // For client-side, we can't easily fetch and parse HTML due to CORS
    // This would need to be done server-side
    // For now, return the original URL
    return pageUrl
  } catch (error) {
    console.error('Error fetching direct image URL:', error)
    return null
  }
}
