import  { Container, Divider, Heading, SimpleGrid } from '@chakra-ui/react';
import Section from '../components/section';
import { WorkGridItem } from '../components/grid-item';
import Layout from '../components/layouts/article';

import thumbInkdrop from '../public/images/works/inkdrop_eyecatch.png';
import thumbWalknote from '../public/images/works/walknote_eyecatch.png';
import thumbMenkiki from '../public/images/works/menkiki_eyecatch.png';
import thumbTour from '../public/images/works/modetokyo_eyecatch.png';
import thumbStyly from '../public/images/works/styly_eyecatch.png';

const Works = () => {
    return (
        <Layout>
            <Container>
                <Heading as="h3" fontSize={20} mb={4}>
                    Works
                </Heading>

                <SimpleGrid columns={[1,1,2]} gap={6}>
                    <Section>
                        <WorkGridItem id="inkdrop" title="inkdrop" thumbnail={thumbInkdrop}>
                                A markdown note-taking app with 100+ encrypted data sync support 
                        </WorkGridItem>
                    </Section>
                    <Section>
                        <WorkGridItem id="walknote" title="walknote" thumbnail={thumbWalknote}>
                                Music recommendation  app for ios
                        </WorkGridItem>
                    </Section>
                    <Section>
                        <WorkGridItem id="menkiki" title="Menkiki" thumbnail={thumbMenkiki}>
                            An app that suggests ramen(noodes) shops based on a given photo of a ramen you want to eat
                        </WorkGridItem>
                    </Section>
                </SimpleGrid>

                <Section delay={0.2}>
                    <Divider my={6}/>
                    <Heading as="h3" fontSize={20} mb={4}>
                        Collaborations
                    </Heading>
                </Section>

                <SimpleGrid columns={[1, 1, 2]} gap={6}>
                    <Section delay={0.3}>
                        <WorkGridItem id="modetokyo" title="mode.tokyo" thumbnail={thumbTour}>
                                The mode magazine for understanding to personally enjoy japan
                        </WorkGridItem>
                    </Section>
                    <Section delay={0.3}>
                        <WorkGridItem id="styly" title="Styly" thumbnail={thumbStyly}>
                            A VR Creative tools for fashion brands
                        </WorkGridItem>
                    </Section>
                </SimpleGrid>
            </Container>
        </Layout>
    )
}

export default Works