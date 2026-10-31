import NextLink from 'next/link'
import { Heading, Box, Image, Link, Badge } from '@chakra-ui/react'

export const Title = ({ children }) => (
  <Box mb={6}>
    <Link
      as={NextLink}
      href="/works"
      fontFamily="mono"
      fontSize="xs"
      letterSpacing="0.12em"
    >
      ← ALL WORK
    </Link>
    <Heading as="h1" fontSize={['4xl', '5xl']} lineHeight={1.05} mt={3}>
      {children}
    </Heading>
  </Box>
)

export const WorkImage = ({ src, alt }) => (
  <Image borderRadius="lg" w="full" src={src} alt={alt} mb={4} />
)

export const Meta = ({ children }) => (
  <Badge
    bg="transparent"
    color="var(--accent)"
    fontFamily="mono"
    fontWeight={500}
    letterSpacing="0.1em"
    mr={2}
    minW="80px"
  >
    {children}
  </Badge>
)
