import { createTheme } from '@mui/material/styles'
import { getDesignTokens } from './marketingPrimitives'
import { marketingComponents } from './marketingComponents'

/** Official MUI Marketing Page shared theme (light), compatible with MUI v5. */
export function createMarketingTheme() {
  const tokens = getDesignTokens('light')
  return createTheme({
    ...tokens,
    components: marketingComponents,
  })
}

export { brand, gray, brandHex } from './marketingPrimitives'
