import NextLink from 'next/link'
import {
  Box,
  Text,
  Badge,
  LinkBox,
  LinkOverlay,
  Wrap,
  WrapItem,
  Tag,
  useColorModeValue
} from '@chakra-ui/react'
import { statusLabel, statusColor } from '../data/projects'

// Generated cover so projects don't need screenshot files.
export const ProjectCover = ({ project, height = 120 }) => {
  const [a, b] = project.accent || ['#f6ad55', '#c05621']
  const initials = project.title
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
  return (
    <Box
      h={`${height}px`}
      borderRadius="12px"
      position="relative"
      overflow="hidden"
      bg={`linear-gradient(135deg, ${a}, ${b})`}
    >
      <Box
        position="absolute"
        inset={0}
        opacity={0.18}
        bgImage="radial-gradient(circle at 1px 1px, white 1px, transparent 0)"
        bgSize="14px 14px"
      />
      <Text
        position="absolute"
        right={3}
        bottom={1}
        fontFamily="M PLUS Rounded 1c"
        fontWeight="bold"
        fontSize={height > 140 ? '6xl' : '4xl'}
        color="whiteAlpha.800"
        lineHeight={1.2}
      >
        {initials}
      </Text>
    </Box>
  )
}

export const ProjectCard = ({ project, compact = false }) => {
  const cardBg = useColorModeValue('whiteAlpha.600', 'whiteAlpha.100')
  return (
    <LinkBox
      as="article"
      bg={cardBg}
      borderRadius="xl"
      p={3}
      h="100%"
      transition="transform 0.2s ease"
      _hover={{ transform: 'translateY(-3px)' }}
    >
      <ProjectCover project={project} height={compact ? 90 : 120} />
      <Box mt={3}>
        <LinkOverlay as={NextLink} href={`/works/${project.slug}`} scroll={false}>
          <Text fontWeight="bold" fontSize={compact ? 'md' : 'lg'}>
            {project.title}
          </Text>
        </LinkOverlay>
        <Badge colorScheme={statusColor[project.status]} mt={1} mb={2}>
          {statusLabel[project.status]}
        </Badge>
        <Text fontSize="sm" opacity={0.85} noOfLines={compact ? 3 : undefined}>
          {project.summary}
        </Text>
        {!compact && (
          <Wrap spacing={1} mt={3}>
            {project.stack.slice(0, 4).map(s => (
              <WrapItem key={s}>
                <Tag size="sm" variant="outline">
                  {s}
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}
      </Box>
    </LinkBox>
  )
}
