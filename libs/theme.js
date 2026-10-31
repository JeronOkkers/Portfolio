import { extendTheme } from '@chakra-ui/react'

// Colours live in CSS variables (see components/fonts.js) so the Tweaks panel
// can change them live. Chakra just points at those variables.
const styles = {
  global: {
    body: {
      bg: 'var(--paper)',
      color: 'var(--ink)',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    },
    'h1, h2, h3, h4': { color: 'var(--ink)' }
  }
}

const components = {
  Heading: {
    baseStyle: { fontWeight: 400, letterSpacing: '-0.01em' },
    variants: {
      'page-title': { fontSize: ['4xl', '5xl'], lineHeight: 1.05 },
      'section-title': {
        fontSize: ['2xl', '3xl'],
        marginTop: 2,
        marginBottom: 5
      }
    }
  },
  Link: {
    baseStyle: {
      color: 'var(--accent)',
      textUnderlineOffset: 3
    }
  },
  Button: {
    baseStyle: { borderRadius: 'full', fontWeight: 500 },
    variants: {
      ink: {
        bg: 'var(--navy)',
        color: 'var(--on-navy)',
        _hover: { opacity: 0.88, transform: 'translateY(-1px)' },
        transition: 'all 0.2s ease'
      },
      paper: {
        bg: 'var(--card)',
        color: 'var(--ink)',
        border: '1px solid var(--line)',
        _hover: { borderColor: 'var(--ink-soft)' }
      }
    }
  }
}

const fonts = {
  heading: "'Instrument Serif', Georgia, serif",
  body: "'Inter', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace"
}

const colors = {
  grassTeal: 'var(--accent)'
}

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true
}

const theme = extendTheme({ config, styles, components, fonts, colors })
export default theme
