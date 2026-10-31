import { forwardRef } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import {
  Container,
  Box,
  Link,
  HStack,
  Text,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  Button
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import ThemeToggleButton from './theme-toggle-button'

const links = [
  { href: '/works', label: 'Work' },
  { href: '/#now', label: 'Now' },
  { href: '/health', label: 'Health' }
]

const NavLink = ({ href, path, children }) => {
  const active = href.startsWith('/') && !href.includes('#') && (path === href || path.startsWith(href + '/'))
  return (
    <Link
      as={NextLink}
      href={href}
      scroll={false}
      fontSize="sm"
      color={active ? 'var(--ink)' : 'var(--ink-soft)'}
      fontWeight={active ? 600 : 400}
      _hover={{ color: 'var(--ink)', textDecoration: 'none' }}
      position="relative"
      _after={
        active
          ? {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '-6px',
              height: '2px',
              bg: 'var(--accent)'
            }
          : undefined
      }
    >
      {children}
    </Link>
  )
}

const MenuLink = forwardRef((props, ref) => <Link ref={ref} as={NextLink} {...props} />)
MenuLink.displayName = 'MenuLink'

const Navbar = ({ path }) => (
  <Box
    position="fixed"
    as="nav"
    w="100%"
    zIndex={10}
    bg="color-mix(in srgb, var(--paper) 78%, transparent)"
    css={{ backdropFilter: 'blur(12px)' }}
    borderBottom="1px solid var(--line)"
  >
    <Container maxW="container.xl" px={[4, 6, 8]} py={3} display="flex" alignItems="center">
      <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }} display="flex" alignItems="center" gap={2}>
        <Box borderRadius="full" overflow="hidden" w="26px" h="26px">
          <Image src="/images/mark.png" width={26} height={26} alt="" />
        </Box>
        <Text fontFamily="heading" fontSize="xl" color="var(--ink)">
          Jeron Okkers
        </Text>
      </Link>

      <HStack spacing={8} ml="auto" display={{ base: 'none', md: 'flex' }}>
        {links.map(l => (
          <NavLink key={l.href} href={l.href} path={path}>
            {l.label}
          </NavLink>
        ))}
        <Link
          href="https://github.com/JeronOkkers"
          target="_blank"
          fontSize="sm"
          color="var(--ink-soft)"
          _hover={{ color: 'var(--ink)', textDecoration: 'none' }}
        >
          GitHub ↗
        </Link>
      </HStack>

      <HStack spacing={2} ml={{ base: 'auto', md: 6 }}>
        <ThemeToggleButton />
        <Button
          as={NextLink}
          href="/works"
          variant="ink"
          size="sm"
          px={4}
          display={{ base: 'none', md: 'inline-flex' }}
        >
          See my work
        </Button>
        <Box display={{ base: 'inline-block', md: 'none' }}>
          <Menu isLazy id="navbar-menu">
            <MenuButton
              as={IconButton}
              icon={<HamburgerIcon />}
              variant="outline"
              borderColor="var(--line)"
              aria-label="Menu"
              borderRadius="full"
            />
            <MenuList bg="var(--card)" borderColor="var(--line)">
              <MenuItem as={MenuLink} href="/" bg="transparent">Home</MenuItem>
              {links.map(l => (
                <MenuItem key={l.href} as={MenuLink} href={l.href} bg="transparent">
                  {l.label}
                </MenuItem>
              ))}
              <MenuItem as={Link} href="https://github.com/JeronOkkers" target="_blank" bg="transparent">
                GitHub ↗
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    </Container>
  </Box>
)

export default Navbar
