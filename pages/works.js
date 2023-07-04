import { Container, Divider, Heading, SimpleGrid } from '@chakra-ui/react'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'
import Layout from '../components/layouts/article'

import thumbInkdrop from '../public/images/works/inkdrop_eyecatch.png'
import thumbMenkiki from '../public/images/works/menkiki_eyecatch.png'
import thumbTour from '../public/images/works/modetokyo_eyecatch.png'
import thumbStyly from '../public/images/works/styly_eyecatch.png'
import thumbPortfolio from '../public/images/works/portfolio,png.png'

const Works = () => {
  return (
    <Layout>
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          Works
        </Heading>

        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section>
            <WorkGridItem
              id="inkdrop"
              title="DailyDare"
              thumbnail={thumbInkdrop}
            >
              A Markdown Todolist cross-platform still in development.
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem
              id="portfolio"
              title="Portfolio Nextjs"
              thumbnail={thumbPortfolio}
            >
              My personal portfolio built using nextjs and react.
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem id="menkiki" title="Menkiki" thumbnail={thumbMenkiki}>
              An app that suggests ramen(noodes) shops based on a given photo of
              a ramen you want to eat
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Works
