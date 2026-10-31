import { Box, HStack, Link, Text } from '@chakra-ui/react'

const Footer = () => (
  <Box mt={20} pt={6} borderTop="1px solid var(--line)">
    <HStack justify="space-between" flexWrap="wrap" spacing={4}>
      <Text fontFamily="mono" fontSize="xs" letterSpacing="0.08em" color="var(--ink-soft)">
        © {new Date().getFullYear()} JERON OKKERS · CAPE TOWN
      </Text>
      <Link
        href="https://github.com/JeronOkkers/Portfolio"
        target="_blank"
        fontFamily="mono"
        fontSize="xs"
        letterSpacing="0.08em"
        color="var(--ink-soft)"
      >
        VIEW SOURCE ↗
      </Link>
    </HStack>
  </Box>
)

export default Footer
