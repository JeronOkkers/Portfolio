// pages/works.js
import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'
import Layout from '../components/layouts/article'

// Import your static images so that Next.js can automatically generate blurDataURL for them.
import thumbDailyDare from '../public/images/works/Animatedtodo.png'
import thumbPortfolio from '../public/images/works/portfolio.png'
import thumbMenkiki from '../public/images/works/menkiki_eyecatch.png'
import defaultThumb from '../public/images/works/default.png'  // Optional default image

// Map repository names (or a chosen key) to their corresponding thumbnail.
// Ensure the keys match your repo names (case-insensitive).
const images = {
  dailydare: thumbDailyDare,
  portfolio: thumbPortfolio,
  menkiki: thumbMenkiki,
}

const Works = ({ repos }) => {
  return (
    <Layout>
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          Works
        </Heading>

        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          {repos.map((repo) => {
            // Try to get a thumbnail image from our mapping, or fallback to a default image.
            const thumbnail =
              images[repo.name.toLowerCase()] || defaultThumb || thumbPortfolio 
            return (
              <Section key={repo.id}>
                <WorkGridItem
                  id={repo.name}
                  title={repo.name}
                  thumbnail={thumbnail}
                  href={repo.html_url} // Optional, if you want to link directly to the repo.
                >
                  {repo.description || 'No description provided'}
                </WorkGridItem>
              </Section>
            )
          })}
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  // Replace with your GitHub username.
  const res = await fetch('https://api.github.com/users/jeronOkkers/repos')
  const data = await res.json()

  // Filter out forked repos or customize the filter as needed.
  const repos = data.filter((repo) => !repo.fork)

  // Map repositories to only the needed fields.
  const enhancedRepos = repos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
  }))

  return {
    props: {
      repos: enhancedRepos,
    },
    // Revalidate once per day (86400 seconds)
    revalidate: 86400,
  }
}

export default Works
