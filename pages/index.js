import NextLink from 'next/link'
import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import SectionHeading from '../components/section-heading'
import Paragraph from '../components/paragraph'
import HeroArt from '../components/hero-art'
import { ProjectCard } from '../components/project-card'
import projects from '../data/projects'

const stackStrip = ['C# / .NET', 'Next.js', 'React Native', 'SQL Server', 'Supabase', 'Azure']

const now = [
  {
    label: 'Studying',
    title: 'BSc Computer Science',
    body: 'Application Development at Varsity College (now Emeris): Java, C#, SQL, networking, Docker and Azure.'
  },
  {
    label: 'Working',
    title: 'Warehouse ops & IT',
    body: 'WMS superuser at a Cape Town distribution centre: configuration, process improvement, scanners, printers and the network.'
  },
  {
    label: 'Building',
    title: 'StatNav',
    body: 'A mobile + web platform for scheduling and tracking field staff at marketing activations.',
    href: '/works/statnav'
  }
]

const path = [
  { year: '2005', text: 'Born in Cape Town, South Africa.' },
  { year: '2020', text: 'Decided I wanted to build software and started teaching myself to code.' },
  { year: '2024', text: 'Started a BSc in Computer Science (Application Development) at Varsity College.' },
  {
    year: 'Now',
    text: 'Warehouse operations & IT support at a Cape Town distribution centre, while studying and building StatNav.'
  }
]

const toolkit = {
  Languages: ['C#', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'Python'],
  'Frameworks & platforms': ['.NET / ASP.NET Core', 'React', 'Next.js', 'React Native / Expo', 'Supabase', 'Docker', 'Azure'],
  'On the job': ['WMS administration', 'SQL Server', 'API integrations', 'Networking & devices', 'IT support']
}

const Hero = () => (
  <Box position="relative" minH={{ base: 'auto', md: '560px' }} mb={{ base: 10, md: 16 }}>
    {/* art: on the right on desktop, on top on mobile */}
    <HeroArt
      position={{ base: 'relative', md: 'absolute' }}
      right={0}
      top={0}
      bottom={0}
      w={{ base: '100%', md: '64%' }}
      h={{ base: '260px', md: '100%' }}
      borderRadius="2xl"
      overflow="hidden"
      mb={{ base: 6, md: 0 }}
      sx={{
        maskImage: {
          base: 'linear-gradient(to bottom, black 70%, transparent)',
          md: 'linear-gradient(to right, transparent 0%, black 42%)'
        },
        WebkitMaskImage: {
          base: 'linear-gradient(to bottom, black 70%, transparent)',
          md: 'linear-gradient(to right, transparent 0%, black 42%)'
        }
      }}
    />

    <Box position="relative" zIndex={1} maxW="600px" pt={{ base: 0, md: 16 }}>
      <Section delay={0.05}>
        <HStack
          display="inline-flex"
          spacing={2}
          px={3}
          py={1}
          mb={6}
          borderRadius="full"
          border="1px solid var(--line)"
          bg="var(--card)"
        >
          <Box w="7px" h="7px" borderRadius="full" bg="var(--accent)" />
          <Text fontFamily="mono" fontSize="xs" letterSpacing="0.12em" color="var(--ink-soft)">
            APPLICATION DEVELOPER · CAPE TOWN
          </Text>
        </HStack>

        <Heading as="h1" fontSize={['5xl', '6xl', '7xl']} lineHeight={1.02} mb={6}>
          Practical software,{' '}
          <Box as="em" color="var(--accent)" fontStyle="italic">
            built from the warehouse floor up.
          </Box>
        </Heading>

        <Text fontSize={['md', 'lg']} color="var(--ink-soft)" lineHeight={1.7} maxW="52ch" mb={8}>
          I&apos;m Jeron — a Computer Science student and developer who works
          where software meets real operations: warehouse systems, label
          printers, scanners and the people who use them every day.
        </Text>

        <Stack direction={['column', 'row']} spacing={3}>
          <Button as={NextLink} href="/works" variant="ink" size="lg" px={7}>
            See my work →
          </Button>
          <Button as={NextLink} href="#now" variant="paper" size="lg" px={7}>
            What I&apos;m doing now ↓
          </Button>
        </Stack>
      </Section>
    </Box>
  </Box>
)

const Home = () => {
  const featured = projects.filter(p => p.featured)

  return (
    <Layout>
      <Hero />

      {/* stack strip */}
      <Section delay={0.1}>
        <Wrap
          spacing={{ base: 3, md: 8 }}
          justify="center"
          py={5}
          borderTop="1px solid var(--line)"
          borderBottom="1px solid var(--line)"
          mb={20}
        >
          {stackStrip.map(s => (
            <WrapItem key={s}>
              <Text fontFamily="mono" fontSize="xs" letterSpacing="0.14em" color="var(--ink-soft)">
                {s.toUpperCase()}
              </Text>
            </WrapItem>
          ))}
        </Wrap>
      </Section>

      {/* 01 About */}
      <Section delay={0.15}>
        <SimpleGrid columns={[1, 1, 2]} spacing={{ base: 4, md: 16 }} mb={24}>
          <SectionHeading n={1} eyebrow="About">
            Between the floor <em>and</em> the systems behind it.
          </SectionHeading>
          <Box pt={{ md: 7 }}>
            <Paragraph>
              I&apos;m studying towards a Bachelor of Computer Science in
              Application Development, and I work in a hybrid warehouse
              operations and IT support role at a distribution centre in Cape
              Town. I&apos;m the go-to superuser for our warehouse management
              system, I look after the scanners, printers and network, and I
              build tools that remove manual work for the people around me.
            </Paragraph>
            <Paragraph>
              Working that close to real operations has shaped how I build: I
              like software that solves a specific, everyday problem and keeps
              working when it&apos;s busy. The goal is to move fully into
              software development once I graduate.
            </Paragraph>
          </Box>
        </SimpleGrid>
      </Section>

      {/* 02 Now */}
      <Section delay={0.2}>
        <Box id="now" scrollMarginTop="100px" mb={24}>
          <SectionHeading n={2} eyebrow="Now">
            What I&apos;m <em>doing now</em>.
          </SectionHeading>
          <SimpleGrid columns={[1, 1, 3]} spacing={5}>
            {now.map(item => (
              <Box key={item.label} bg="var(--card)" border="1px solid var(--line)" borderRadius="xl" p={6}>
                <Text fontFamily="mono" fontSize="xs" letterSpacing="0.14em" color="var(--accent)" mb={3}>
                  {item.label.toUpperCase()}
                </Text>
                <Text fontFamily="heading" fontSize="2xl" lineHeight={1.15} mb={2}>
                  {item.href ? (
                    <Link as={NextLink} href={item.href} color="var(--ink)">
                      {item.title} →
                    </Link>
                  ) : (
                    item.title
                  )}
                </Text>
                <Text fontSize="sm" color="var(--ink-soft)" lineHeight={1.7}>
                  {item.body}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Section>

      {/* 03 Work */}
      <Section delay={0.25}>
        <Box mb={24}>
          <HStack justify="space-between" align="flex-end" mb={0}>
            <SectionHeading n={3} eyebrow="Selected work">
              Things I&apos;ve <em>built</em>.
            </SectionHeading>
            <Link
              as={NextLink}
              href="/works"
              fontFamily="mono"
              fontSize="xs"
              letterSpacing="0.12em"
              mb={7}
              display={{ base: 'none', md: 'block' }}
            >
              ALL PROJECTS →
            </Link>
          </HStack>
          <SimpleGrid columns={[1, 1, 3]} spacing={5}>
            {featured.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </SimpleGrid>
        </Box>
      </Section>

      {/* 04 Path + 05 Toolkit */}
      <Section delay={0.3}>
        <SimpleGrid columns={[1, 1, 2]} spacing={{ base: 16, md: 16 }} mb={24}>
          <Box>
            <SectionHeading n={4} eyebrow="Path">
              How I <em>got here</em>.
            </SectionHeading>
            <Box borderLeft="1px solid var(--line)" pl={6}>
              {path.map(p => (
                <Box key={p.year} position="relative" mb={6}>
                  <Box
                    position="absolute"
                    left="-29px"
                    top="10px"
                    w="9px"
                    h="9px"
                    borderRadius="full"
                    bg={p.year === 'Now' ? 'var(--accent)' : 'var(--paper)'}
                    border="1px solid var(--ink-soft)"
                  />
                  <Text fontFamily="heading" fontStyle="italic" fontSize="2xl" lineHeight={1.2}>
                    {p.year}
                  </Text>
                  <Text fontSize="sm" color="var(--ink-soft)" lineHeight={1.7}>
                    {p.text}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
          <Box>
            <SectionHeading n={5} eyebrow="Toolkit">
              What I <em>work with</em>.
            </SectionHeading>
            {Object.entries(toolkit).map(([group, items]) => (
              <Box key={group} mb={6}>
                <Text fontFamily="mono" fontSize="xs" letterSpacing="0.14em" color="var(--ink-soft)" mb={2}>
                  {group.toUpperCase()}
                </Text>
                <Wrap spacing={2}>
                  {items.map(s => (
                    <WrapItem key={s}>
                      <Box
                        px={3}
                        py={1}
                        borderRadius="full"
                        border="1px solid var(--line)"
                        bg="var(--card)"
                        fontSize="sm"
                      >
                        {s}
                      </Box>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            ))}
          </Box>
        </SimpleGrid>
      </Section>

      {/* 06 Off the clock / elsewhere */}
      <Section delay={0.35}>
        <Box
          bg="var(--card)"
          border="1px solid var(--line)"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
        >
          <SimpleGrid columns={[1, 1, 2]} spacing={10}>
            <Box>
              <SectionHeading n={6} eyebrow="Off the clock" mb={3} />
              <Text fontFamily="heading" fontSize={['2xl', '3xl']} lineHeight={1.25}>
                Art, music and drawing, training{' '}
                <Box as="em" color="var(--accent)">calisthenics and core</Box>, and the occasional rabbit
                hole into machine learning.
              </Text>
            </Box>
            <Box>
              <SectionHeading eyebrow="Elsewhere" mb={3} />
              <Stack spacing={3}>
                {[
                  { label: 'GitHub', handle: '@JeronOkkers', href: 'https://github.com/JeronOkkers' },
                  { label: 'Instagram', handle: '@mr_president_jjo', href: 'https://instagram.com/mr_president_jjo' }
                ].map(l => (
                  <Link
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    display="flex"
                    justifyContent="space-between"
                    borderBottom="1px solid var(--line)"
                    pb={3}
                    color="var(--ink)"
                    _hover={{ color: 'var(--accent)', textDecoration: 'none' }}
                  >
                    <Text>{l.label}</Text>
                    <Text fontFamily="mono" fontSize="sm">
                      {l.handle} ↗
                    </Text>
                  </Link>
                ))}
              </Stack>
            </Box>
          </SimpleGrid>
        </Box>
      </Section>
    </Layout>
  )
}

export default Home
export { getServerSideProps } from '../components/chakra'
