/**
 * Component overrides from MUI Marketing shared-theme (light mode).
 * Simplified for @mui/material v5 — no theme.vars / applyStyles.
 */
import { alpha, Theme, Components } from '@mui/material/styles'
import { brand, gray } from './marketingPrimitives'

export const marketingComponents: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        fontFamily: '"Futura PT Book", "Futura PT", Futura, "Trebuchet MS", Arial, sans-serif',
      },
      body: {
        backgroundColor: 'hsl(0, 0%, 99%)',
        color: '#1F2733',
        fontFamily: '"Futura PT Book", "Futura PT", Futura, "Trebuchet MS", Arial, sans-serif',
        lineHeight: 1.3,
        letterSpacing: '0.5px',
      },
      'p, h1, h2, h3, h4, h5, h6, a, li, label, span': {
        fontFamily: '"Futura PT Book", "Futura PT", Futura, "Trebuchet MS", Arial, sans-serif',
        lineHeight: 1.3,
        letterSpacing: '0.5px',
      },
      'p, h1, h2, h3, h4, h5, h6, a, li, label': {
        color: '#1F2733',
      },
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableTouchRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        boxSizing: 'border-box',
        transition: 'all 100ms ease-in',
        '&:focus-visible': {
          outline: `3px solid ${alpha(brand[400], 0.5)}`,
          outlineOffset: '2px',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
        '&:hover': { boxShadow: 'none' },
      },
      sizeSmall: { height: '2.25rem', padding: '8px 12px' },
      sizeMedium: { height: '2.5rem' },
      sizeLarge: { height: '2.75rem', padding: '10px 20px' },
      containedPrimary: {
        color: '#fff',
        backgroundColor: gray[900],
        backgroundImage: `linear-gradient(to bottom, ${gray[700]}, ${gray[800]})`,
        boxShadow: `inset 0 1px 0 ${gray[600]}, inset 0 -1px 0 1px hsl(220, 0%, 0%)`,
        border: `1px solid ${gray[700]}`,
        '&:hover': {
          backgroundImage: 'none',
          backgroundColor: brand[500],
          borderColor: brand[600],
          boxShadow: 'none',
        },
        '&:active': { backgroundColor: brand[700], borderColor: brand[700] },
      },
      containedSecondary: {
        color: '#fff',
        backgroundColor: brand[500],
        '&:hover': { backgroundColor: brand[700] },
      },
      outlined: {
        color: gray[800],
        backgroundColor: alpha(gray[50], 0.3),
        borderColor: gray[200],
        boxShadow: `inset 0 1px 0 ${gray[50]}, inset 0 -1px 0 ${gray[200]}`,
        '&:hover': {
          backgroundColor: alpha(brand[50], 0.9),
          borderColor: brand[400],
          color: brand[700],
        },
      },
      text: {
        color: gray[800],
        '&:hover': {
          backgroundColor: alpha(brand[100], 0.7),
          color: brand[700],
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        color: gray[700],
        border: `1px solid transparent`,
        '&:hover': {
          backgroundColor: gray[100],
          borderColor: gray[200],
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: `1px solid ${alpha(gray[200], 0.8)}`,
        backgroundImage: 'none',
        backgroundColor: '#fff',
        boxShadow: 'none',
        transition: 'border-color 120ms ease, box-shadow 120ms ease',
        '&:hover': {
          borderColor: gray[300],
          boxShadow: 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
        },
      },
    },
  },
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: 8,
      },
      outlined: {
        borderColor: alpha(gray[200], 0.8),
      },
    },
    variants: [
      {
        props: { variant: 'highlighted' as any },
        style: {
          backgroundColor: alpha(brand[50], 0.6),
          border: `1px solid ${alpha(brand[200], 0.8)}`,
        },
      },
    ],
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: 'none',
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: { minHeight: 64 },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: 10,
        border: `1px solid ${gray[200]}`,
        boxShadow: 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        margin: '2px 6px',
        '&:hover': { backgroundColor: gray[100] },
        '&.Mui-selected': {
          backgroundColor: alpha(brand[100], 0.6),
          '&:hover': { backgroundColor: alpha(brand[100], 0.9) },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 999,
        fontWeight: 500,
      },
    },
  },
  MuiTextField: {
    defaultProps: { size: 'small' },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        backgroundColor: '#fff',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: gray[200],
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: gray[300],
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: brand[400],
          borderWidth: 1,
        },
      },
      input: { paddingTop: 10, paddingBottom: 10 },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        backgroundColor: brand[400],
        height: 3,
        borderRadius: 3,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        minHeight: 44,
        '&.Mui-selected': { color: brand[500] },
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-head': {
          fontWeight: 600,
          backgroundColor: gray[50],
          color: gray[700],
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: { borderColor: alpha(gray[200], 0.8) },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: { fontWeight: 600 },
    },
  },
  MuiLink: {
    defaultProps: { underline: 'hover' },
    styleOverrides: {
      root: { color: brand[500], fontWeight: 500 },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: { borderColor: alpha(gray[200], 0.8) },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: { borderRadius: 8 },
    },
  },
}
