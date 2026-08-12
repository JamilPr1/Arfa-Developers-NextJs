/**
 * Component overrides from MUI Marketing shared-theme (light mode).
 * Simplified for @mui/material v5 — no theme.vars / applyStyles.
 */
import { alpha, Theme, Components } from '@mui/material/styles'
import { brand, gray } from './marketingPrimitives'

export const marketingComponents: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: 'hsl(0, 0%, 99%)',
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
        backgroundColor: brand[500],
        backgroundImage: `linear-gradient(to bottom, ${brand[400]}, ${brand[600]})`,
        boxShadow: `inset 0 1px 0 ${brand[300]}, inset 0 -1px 0 1px ${brand[700]}`,
        border: `1px solid ${brand[600]}`,
        '&:hover': {
          backgroundImage: 'none',
          backgroundColor: brand[600],
          boxShadow: 'none',
        },
        '&:active': { backgroundColor: brand[700] },
      },
      containedSecondary: {
        color: '#fff',
        backgroundColor: gray[900],
        '&:hover': { backgroundColor: gray[800] },
      },
      outlined: {
        color: brand[700],
        backgroundColor: alpha(brand[50], 0.5),
        borderColor: brand[200],
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: alpha(brand[100], 0.8),
          borderColor: brand[400],
          color: brand[800],
        },
      },
      text: {
        color: brand[700],
        '&:hover': { backgroundColor: alpha(brand[100], 0.7) },
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
