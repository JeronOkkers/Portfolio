import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Wrap,
  WrapItem,
  Tag,
  Box
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { ProjectCover } from '../../components/project-card'
import projects, { statusLabel } from '../../data/projects'

const Work = ({ project }) => (
  <Layout title={project.title}>
    <Container>
      <Title>
        {project.title}{' '}
        <Badge fontFamily="mono" fontWeight={400} bg="var(--card)" color="var(--ink-soft)" verticalAlign="middle">
          {project.year}
        </Badge>
      </Title>

      <Box mb={4}>
        <ProjectCover project={project} height={180} />
      </Box>

      {project.description.map((para, i) => (
        <P key={i}>{para}</P>
      ))}

      <List ml={4} my={4} spacing={2}>
        <ListItem>
          <Meta>Status</Meta>
          <span>{statusLabel[project.status]}</span>
        </ListItem>
        <ListItem>
          <Meta>Platform</Meta>
          <span>{project.platform}</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <Wrap as="span" display="inline-flex" spacing={1}>
            {project.stack.map(s => (
              <WrapItem key={s}>
                <Tag size="sm" bg="var(--card)" color="var(--ink)" border="1px solid var(--line)" borderRadius="full">
                  {s}
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </ListItem>
        {project.website && (
          <ListItem>
            <Meta>Website</Meta>
            <Link href={project.website} target="_blank">
              {project.website.replace(/^https?:\/\//, '')}{' '}
              <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>
        )}
        {project.source && (
          <ListItem>
            <Meta>Source</Meta>
            <Link href={project.source} target="_blank">
              {project.source.replace(/^https?:\/\//, '')}{' '}
              <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>
        )}
      </List>
    </Container>
  </Layout>
)

export function getStaticPaths() {
  return {
    paths: projects.map(p => ({ params: { slug: p.slug } })),
    fallback: false
  }
}

export function getStaticProps({ params }) {
  const project = projects.find(p => p.slug === params.slug)
  // JSON round-trip drops undefined fields (Next can't serialise undefined)
  return { props: { project: JSON.parse(JSON.stringify(project)) } }
}

export default Work
