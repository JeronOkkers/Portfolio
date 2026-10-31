import NextLink from 'next/link'
import { Box, Text, LinkBox, LinkOverlay, HStack } from '@chakra-ui/react'
import { statusLabel } from '../data/projects'

// Print-style cover: paper block with a coloured "ink" stripe pattern and
// big serif initials. No screenshots needed.
export const ProjectCover = ({ project, height = 140 }) => {
  const [a] = project.accent || ['var(--accent)']
  const initials = project.title
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
  return (
    <Box
      h={`${height}px`}
      borderRadius="lg"
      position="relative"
      overflow="hidden"
      bg="var(--sky)"
      border="1px solid var(--line)"
    >
      <Box
        position="absolute"
        inset={0}
        opacity={0.28}
        bgImage={`repeating-linear-gradient(135deg, ${a} 0 2px, transparent 2px 12px)`}
      />
      <Box
        position="absolute"
        right="-18px"
        top="-18px"
        w="96px"
        h="96px"
        borderRadius="full"
        bg={a}
        opacity={0.85}
      />
      <Text
        position="absolute"
        left={4}
        bottom={1}
        fontFamily="heading"
        fontStyle="italic"
        fontSize={height > 150 ? '7xl' : '6xl'}
        lineHeight={1}
        color="var(--ink)"
      >
        {initials}
      </Text>
    </Box>
  )
}

export const ProjectCard = ({ project, index, compact = false }) => (
  <LinkBox
    as="article"
    bg="var(--card)"
    border="1px solid var(--line)"
    borderRadius="xl"
    p={4}
    h="100%"
    transition="transform 0.25s ease, box-shadow 0.25s ease"
    _hover={{ transform: 'translateY(-4px)', boxShadow: '0 16px 36px rgba(0,0,0,0.08)' }}
  >
    <ProjectCover project={project} height={compact ? 120 : 140} />
    <HStack justify="space-between" mt={4} mb={1}>
      <Text fontFamily="mono" fontSize="xs" letterSpacing="0.1em" color="var(--ink-soft)">
        {index != null && (
          <Box as="span" className="sec-num" color="var(--accent)" mr={2}>
            {String(index + 1).padStart(2, '0')}
          </Box>
        )}
        {project.year}
      </Text>
      <Text fontFamily="mono" fontSize="xs" letterSpacing="0.1em" color="var(--ink-soft)" textTransform="uppercase">
        ● {statusLabel[project.status]}
      </Text>
    </HStack>
    <LinkOverlay as={NextLink} href={`/works/${project.slug}`} scroll={false} _hover={{ textDecoration: 'none' }}>
      <Text fontFamily="heading" fontSize={compact ? '2xl' : '3xl'} lineHeight={1.1} color="var(--ink)">
        {project.title}
      </Text>
    </LinkOverlay>
    <Text fontSize="sm" color="var(--ink-soft)" mt={2} noOfLines={compact ? 3 : undefined}>
      {project.summary}
    </Text>
    {!compact && (
      <Text fontFamily="mono" fontSize="xs" color="var(--ink-soft)" mt={4} letterSpacing="0.04em">
        {project.stack.slice(0, 4).join(' · ')}
      </Text>
    )}
  </LinkBox>
)
