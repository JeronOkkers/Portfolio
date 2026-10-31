import { Box, Heading, Text } from '@chakra-ui/react'

// "01 — About"-style editorial section heading.
// The number hides when "Numbered headings" is off in Tweaks.
const SectionHeading = ({ n = undefined, eyebrow = undefined, children = undefined, ...rest }) => (
  <Box mb={6} {...rest}>
    <Text
      fontFamily="mono"
      fontSize="xs"
      letterSpacing="0.14em"
      color="var(--ink-soft)"
      textTransform="uppercase"
      mb={2}
    >
      {n && (
        <Box as="span" className="sec-num" color="var(--accent)" mr={2}>
          {String(n).padStart(2, '0')} —
        </Box>
      )}
      {eyebrow}
    </Text>
    {children && (
      <Heading as="h2" fontSize={['3xl', '4xl']} lineHeight={1.1}>
        {children}
      </Heading>
    )}
  </Box>
)

export default SectionHeading
