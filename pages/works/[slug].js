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
import projects, { statusLabel, statusColor } from '../../data/projects'

const Work = ({ project }) => (
  <Layout title={project.title}>
    <Container>
      <Title>
        {project.title} <Badge>{project.year}</Badge>
      </Title>

      <Box mb={4}>
        <ProjectCover project={project} height={160} />
      </Box>

      {project.description.map((para, i) => (
        <P key={i}>{para}</P>
      ))}

      <List ml={4} my={4} spacing={2}>
        <ListItem>
          <Meta>Status</Meta>
          <Badge colorScheme={statusColor[project.status]} variant="outline">
            {statusLabel[project.status]}
          </Badge>
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
                <Tag size="sm">{s}</Tag>
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
