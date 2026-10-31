import NextLink from 'next/link'
import Image from 'next/image'
import {
  Link,
  Container,
  Heading,
  Box,
  Button,
  List,
  ListItem,
  SimpleGrid,
  Tag,
  Wrap,
  WrapItem,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { IoLogoGithub, IoLogoInstagram } from 'react-icons/io5'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear } from '../components/bio'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { ProjectCard } from '../components/project-card'
import projects from '../data/projects'

const skills = {
  Languages: ['C#', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'Python'],
  'Frameworks & tools': [
    '.NET / ASP.NET Core',
    'React',
    'Next.js',
    'React Native / Expo',
    'Supabase',
    'Docker',
    'Azure',
    'Git'
  ],
  'On the job': [
    'WMS administration',
    'SQL Server',
    'API integrations',
    'Networking & devices',
    'IT support'
  ]
}

const Home = () => {
  const featured = projects.filter(p => p.featured)
  const tagScheme = useColorModeValue('orange', 'orange')

  return (
    <Layout>
      <Container>
        <Box
          borderRadius="lg"
          mb={6}
          p={3}
          textAlign="center"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
          css={{ backdropFilter: 'blur(10px)' }}
        >
          Hey! I&apos;m a developer and Computer Science student based in Cape
          Town, South Africa.
        </Box>

        <Box display={{ md: 'flex' }}>
          <Box flexGrow={1}>
            <Heading as="h2" variant="page-title">
              Jeron Okkers
            </Heading>
            <p>Application developer · CS student · IT on the warehouse floor</p>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            textAlign="center"
          >
            <Box
              borderColor="whiteAlpha.800"
              borderWidth={2}
              borderStyle="solid"
              w="100px"
              h="100px"
              display="inline-block"
              borderRadius="full"
              overflow="hidden"
            >
              <Image
                src="/images/avatar.png"
                alt="Jeron Okkers logo"
                width={100}
                height={100}
                priority
              />
            </Box>
          </Box>
        </Box>

        <Section delay={0.1}>
          <Heading as="h3" variant="section-title">
            About
          </Heading>
          <Paragraph>
            I&apos;m studying towards a Bachelor of Computer Science in
            Application Development at Varsity College (now Emeris), and I
            work in a hybrid warehouse operations and IT support role at a
            distribution centre in Cape Town. That means I spend my days
            between the floor and the systems behind it: I&apos;m the go-to
            superuser for our warehouse management system, I look after the
            scanners, printers and network, and I build tools that remove
            manual work for the people around me.
          </Paragraph>
          <Paragraph>
            Working that close to real operations has shaped how I build: I
            like software that solves a specific, everyday problem and keeps
            working when it&apos;s busy. Outside of work and study I&apos;m
            building StatNav, a workforce-management product, and the goal is
            to move fully into software development once I graduate.
          </Paragraph>
          <Box align="center" my={4}>
            <Button
              as={NextLink}
              href="/works"
              scroll={false}
              rightIcon={<ChevronRightIcon />}
              colorScheme="orange"
            >
              See my work
            </Button>
          </Box>
        </Section>

        <Section delay={0.15}>
          <Heading as="h3" variant="section-title">
            Currently
          </Heading>
          <List spacing={2}>
            <ListItem>
              <Text as="span" fontWeight="bold">
                Studying
              </Text>{' '}
              — BSc Computer Science (Application Development): Java, C#, SQL,
              networking, Docker and Azure.
            </ListItem>
            <ListItem>
              <Text as="span" fontWeight="bold">
                Working
              </Text>{' '}
              — warehouse operations &amp; IT support: WMS configuration,
              process improvement, device and network support.
            </ListItem>
            <ListItem>
              <Text as="span" fontWeight="bold">
                Building
              </Text>{' '}
              —{' '}
              <Link as={NextLink} href="/works/statnav" scroll={false}>
                StatNav
              </Link>
              , a mobile + web platform for scheduling and tracking field
              staff.
            </ListItem>
          </List>
        </Section>

        <Section delay={0.2}>
          <Heading as="h3" variant="section-title">
            Featured work
          </Heading>
          <SimpleGrid columns={[1, 1, 3]} gap={4}>
            {featured.map(p => (
              <ProjectCard key={p.slug} project={p} compact />
            ))}
          </SimpleGrid>
        </Section>

        <Section delay={0.25}>
          <Heading as="h3" variant="section-title">
            Bio
          </Heading>
          <BioSection>
            <BioYear>2005</BioYear>
            Born in Cape Town, South Africa.
          </BioSection>
          <BioSection>
            <BioYear>2020</BioYear>
            Decided I wanted to build software and started teaching myself to
            code.
          </BioSection>
          <BioSection>
            <BioYear>2024</BioYear>
            Started a BSc in Computer Science (Application Development) at
            Varsity College.
          </BioSection>
          <BioSection>
            <BioYear>Now</BioYear>
            Warehouse operations &amp; IT support at a Cape Town distribution
            centre, while studying and building StatNav.
          </BioSection>
        </Section>

        <Section delay={0.3}>
          <Heading as="h3" variant="section-title">
            Skills
          </Heading>
          {Object.entries(skills).map(([group, items]) => (
            <Box key={group} mb={3}>
              <Text fontSize="sm" opacity={0.7} mb={1}>
                {group}
              </Text>
              <Wrap spacing={2}>
                {items.map(s => (
                  <WrapItem key={s}>
                    <Tag size="md" colorScheme={tagScheme} variant="subtle">
                      {s}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          ))}
        </Section>

        <Section delay={0.35}>
          <Heading as="h3" variant="section-title">
            Outside of code
          </Heading>
          <Paragraph>
            Art, music and drawing, training (calisthenics and core work) and
            the occasional rabbit hole into machine learning.
          </Paragraph>
        </Section>

        <Section delay={0.4}>
          <Heading as="h3" variant="section-title">
            On the web
          </Heading>
          <List>
            <ListItem>
              <Link href="https://github.com/JeronOkkers" target="_blank">
                <Button
                  variant="ghost"
                  colorScheme="orange"
                  leftIcon={<IoLogoGithub />}
                >
                  @JeronOkkers
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://instagram.com/mr_president_jjo" target="_blank">
                <Button
                  variant="ghost"
                  colorScheme="orange"
                  leftIcon={<IoLogoInstagram />}
                >
                  @mr_president_jjo
                </Button>
              </Link>
            </ListItem>
          </List>
        </Section>
      </Container>
    </Layout>
  )
}

export default Home
export { getServerSideProps } from '../components/chakra'
