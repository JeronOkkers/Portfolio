// Floating "Tweaks" panel: visitors can change the accent ink, paper tone,
// hero art and section numbers. Everything is CSS-driven via data-* on <html>;
// choices are remembered per browser.
import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Switch,
  HStack,
  IconButton,
  Tooltip,
  useColorMode
} from '@chakra-ui/react'
import { SettingsIcon, CloseIcon } from '@chakra-ui/icons'

const KEY = 'jo-tweaks'
const DEFAULTS = { accent: 'vermilion', paper: 'washi', art: 'on', numbers: 'on' }

const ACCENTS = [
  { id: 'vermilion', color: '#d2452f' },
  { id: 'indigo', color: '#2f4fa3' },
  { id: 'ochre', color: '#b97a12' },
  { id: 'moss', color: '#4f7a4a' }
]
const PAPERS = [
  { id: 'washi', color: '#f4eee3', label: 'Washi' },
  { id: 'mist', color: '#ecefeb', label: 'Mist' },
  { id: 'night', color: '#121418', label: 'Night' }
]

// Runs before React paints (injected in _document) to avoid a flash.
export const tweaksBootScript = `try{var t=JSON.parse(localStorage.getItem('${KEY}')||'{}');var d=document.documentElement;['accent','paper','art','numbers'].forEach(function(k){if(t[k])d.setAttribute('data-'+k,t[k])})}catch(e){}`

const read = () => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return DEFAULTS
  }
}

const Swatch = ({ color, active, label, onClick }) => (
  <Tooltip label={label} openDelay={300}>
    <Box
      as="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      w="22px"
      h="22px"
      borderRadius="full"
      bg={color}
      border="1px solid var(--line)"
      outline={active ? '2px solid var(--ink)' : 'none'}
      outlineOffset="2px"
      transition="transform 0.15s"
      _hover={{ transform: 'scale(1.1)' }}
    />
  </Tooltip>
)

const Row = ({ label, children }) => (
  <HStack justify="space-between" spacing={4} py={1.5}>
    <Text fontSize="sm" color="var(--ink-soft)">
      {label}
    </Text>
    <HStack spacing={2}>{children}</HStack>
  </HStack>
)

const Tweaks = () => {
  const [open, setOpen] = useState(false)
  const [t, setT] = useState(DEFAULTS)
  const { colorMode, setColorMode } = useColorMode()

  useEffect(() => setT(read()), [])

  const update = patch => {
    const next = { ...t, ...patch }
    setT(next)
    const d = document.documentElement
    Object.entries(next).forEach(([k, v]) => d.setAttribute(`data-${k}`, v))
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* private mode — fine, just not remembered */
    }
  }

  const paperActive = id =>
    id === 'night' ? colorMode === 'dark' : colorMode !== 'dark' && t.paper === id

  const pickPaper = id => {
    if (id === 'night') return setColorMode('dark')
    setColorMode('light')
    update({ paper: id })
  }

  return (
    <Box position="fixed" right={[3, 5]} bottom={[3, 5]} zIndex={20}>
      {open ? (
        <Box
          bg="var(--card)"
          border="1px solid var(--line)"
          borderRadius="xl"
          boxShadow="0 18px 40px rgba(0,0,0,0.14)"
          p={4}
          w="250px"
        >
          <HStack justify="space-between" mb={2}>
            <Text fontFamily="mono" fontSize="xs" letterSpacing="0.12em" color="var(--ink-soft)">
              TWEAKS
            </Text>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Close tweaks"
              icon={<CloseIcon boxSize={2.5} />}
              onClick={() => setOpen(false)}
            />
          </HStack>
          <Row label="Accent ink">
            {ACCENTS.map(a => (
              <Swatch
                key={a.id}
                color={a.color}
                label={a.id}
                active={t.accent === a.id}
                onClick={() => update({ accent: a.id })}
              />
            ))}
          </Row>
          <Row label="Paper">
            {PAPERS.map(p => (
              <Swatch
                key={p.id}
                color={p.color}
                label={p.label}
                active={paperActive(p.id)}
                onClick={() => pickPaper(p.id)}
              />
            ))}
          </Row>
          <Row label="Hero art">
            <Switch
              size="sm"
              isChecked={t.art === 'on'}
              onChange={e => update({ art: e.target.checked ? 'on' : 'off' })}
              sx={{ '--switch-bg': 'var(--accent)' }}
              colorScheme="gray"
            />
          </Row>
          <Row label="Numbered headings">
            <Switch
              size="sm"
              isChecked={t.numbers === 'on'}
              onChange={e => update({ numbers: e.target.checked ? 'on' : 'off' })}
              colorScheme="gray"
            />
          </Row>
        </Box>
      ) : (
        <IconButton
          aria-label="Open tweaks"
          icon={<SettingsIcon />}
          onClick={() => setOpen(true)}
          borderRadius="full"
          bg="var(--card)"
          color="var(--ink)"
          border="1px solid var(--line)"
          boxShadow="0 8px 24px rgba(0,0,0,0.12)"
          _hover={{ transform: 'rotate(45deg)' }}
          transition="transform 0.3s ease"
        />
      )}
    </Box>
  )
}

export default Tweaks
