import { Container, Heading, SimpleGrid } from "@chakra-ui/react";
import Layout from '../components/layouts/article';
import Section from '../components/section';
import { GridItem } from "../components/grid-item";

import thumbFishWorkflow from '../public/images/contents/youtube-fish-workflow.jpg'
import thumbMyDeskSetup from '../public/images/contents/youtube-my-desk-setup.jpg'
import thumb500PaidUsers from '../public/images/contents/blog-500-paid-users.jpg'
import thumbFinancialGoal from '../public/images/contents/blog-financial-goal.png'
import thumbHowToPriceYourself from '../public/images/contents/blog-how-to-price-yourself.jpg'
import thumb50xFaster from '../public/images/contents/youtube-50x-faster.jpg'

const Posts = () => {
    return(
    <Layout title="Posts">
        <Container>
            <Heading as="h4" fontSize={20} mb={3}> 
                Popular Posts
            </Heading>
            <Section delay={0.1}>
            <SimpleGrid columns={[1,2,2]} gap={6}>
                <GridItem 
                title="My Fish workflow" 
                thumbnail={thumbFishWorkflow} 
                href="https:www.youtube.com/watch?v=KKxhf50FIPI"
                />
                <GridItem 
                title="My Desk Setup (late 2020)" 
                thumbnail={thumbMyDeskSetup} 
                href="https:www.youtube.com/watch?v=1OFDMwDlnOE"
                />
                <GridItem 
                title="How to price yourself as  developer" 
                thumbnail={thumbHowToPriceYourself} 
                href="https:www.youtube.com/watch?v=1OFDMwDlnOE"
                />
            </SimpleGrid>
            </Section>
        </Container>
    </Layout>
    )
}

export default Posts