import { Box } from '@chakra-ui/react'

const Footer = () => (
  <Box align="center" opacity={0.4} fontSize="sm" mt={10}>
    &copy; {new Date().getFullYear()} Jeron Okkers · Cape Town
  </Box>
)

export default Footer
