import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Text,
  Link,
  Divider
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Section from '../components/section'
import Layout from '../components/layouts/article'
import { ProjectCard } from '../components/project-card'
import projects from '../data/projects'

const Works = ({ repos }) => {
  const current = projects.filter(p => p.status !== 'archived')
  const earlier = projects.filter(p => p.status === 'archived')

  return (
    <Layout title="Works">
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          Works
        </Heading>

        <Section delay={0.1}>
          <SimpleGrid columns={[1, 1, 2]} gap={6}>
            {current.map(p => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </SimpleGrid>
        </Section>

        <Section delay={0.2}>
          <Divider my={6} />
          <Heading as="h3" fontSize={20} mb={4}>
            Earlier projects
          </Heading>
          <SimpleGrid columns={[1, 1, 2]} gap={6}>
            {earlier.map(p => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </SimpleGrid>
        </Section>

        {repos.length > 0 && (
          <Section delay={0.3}>
            <Divider my={6} />
            <Heading as="h3" fontSize={20} mb={4}>
              More on GitHub
            </Heading>
            <SimpleGrid columns={[1, 2]} gap={3}>
              {repos.map(r => (
                <Box key={r.id}>
                  <Link href={r.html_url} target="_blank" fontWeight="bold">
                    {r.name} <ExternalLinkIcon mx="2px" />
                  </Link>
                  <Text fontSize="sm" opacity={0.75}>
                    {r.description || r.language || ''}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Section>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  let repos = []
  try {
    const res = await fetch(
      'https://api.github.com/users/JeronOkkers/repos?sort=pushed&per_page=12',
      { headers: { Accept: 'application/vnd.github+json' } }
    )
    if (res.ok) {
      const data = await res.json()
      repos = data
        .filter(r => !r.fork && !r.archived)
        .slice(0, 8)
        .map(r => ({
          id: r.id,
          name: r.name,
          description: r.description,
          language: r.language,
          html_url: r.html_url
        }))
    }
  } catch (e) {
    // GitHub rate-limited or offline — the curated list still renders.
  }

  return { props: { repos }, revalidate: 86400 }
}

export default Works
