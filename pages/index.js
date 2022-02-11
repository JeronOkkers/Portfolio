import NextLink from "next/link";
import { Button ,Container, Box, Heading, Image, useColorModeValue, Link, ListItem, List, Icon } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Layout from "../components/layouts/article";
import Section from "../components/section";
import Paragraph from "../components/paragraph"
import { BioSection, BioYear } from "../components/bio";
import {
    IoLogoTwitter,
    IoLogoInstagram,
    IoLogoGithub,
    IoLogoFacebook
} from 'react-icons/io5';

const Page = () => {
    return (
     <Layout>
        <Container>
            <Box borderRadius="lg" bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} p={3} mb={6} align="center"> 
            Hello, i am a student developer based in Cape Town South Africa!
            </Box>

            <Box display={{md: 'flex'}}>
                <Box flexGrow={1}>
                    <Heading as="h2" variant="page-title">
                        Jeron Okkers
                    </Heading>
            <p>Artist / developer and busy in school. I spend my time doing school work, practicng programming learning both frontend and backend so i can become fullstack developer.</p>
                </Box>
                <Box 
                flexShrink={0} 
                mt={{base: 4, md: 0}} 
                ml={{md: 6}} 
                align="center"
                >
                    <Image 
                    borderColor="whiteAlpha.800" 
                    borderWidth={2} 
                    borderStyle="solid" 
                    maxWidth="100px" 
                    display="inline-block" 
                    borderRadius="full" 
                    src="/images/jeron.jpg" 
                    alt="Profile Image" 
                    />
            </Box>
            </Box>

            <Section delay={0.1}>
                <Heading as="h3" variant="section-title">
                    About ME
                </Heading>
                <Paragraph>
                Jeron is a tough person to be around but he is worth it just give him time and you will see he is worth it and he does tend to love with a full heart and it is dangerous but it is okay but he chooses to and he loves this girl named Chardene Kimberly Adonis and im wrking to do better i wasnt always the best but i will get better and thats a actual promise that i made to you and ill keep it and work on it everyday.
                </Paragraph>
                <Box align="center" my={4}>
                    <NextLink href="/works">
                        <Button rightIcon={<ChevronRightIcon />} colorScheme="teal" >
                            My Portfolio
                    </Button>
                    </NextLink>
                </Box>
            </Section>

            <Section delay={0.2}>
                <Heading as="h3" variant="section-title" >
                    Bio
                </Heading>
                <BioSection>
                    <BioYear>2005 </BioYear>
                    Born in Cape Town, South Africa.
                </BioSection>
                <BioSection>
                    <BioYear>2019 </BioYear>
                    Meet the most amazing person in my life and thats my wife Chardene Kimberly Okkers.
                </BioSection>
                <BioSection>
                    <BioYear>2020 </BioYear>
                    Decided i wanted to go into programming and started working on learning how to code
                </BioSection>
            </Section>

            <Section delay={0.3}>
            <Heading as="h3" variant="section-title">
                Likes
            </Heading>
            <Paragraph>
            Art, Sports, Programming, Chardene Okkers, {''} 
            <Link href="https://illust.odoruinu.net/" target="_blank">
                Drawing 
            </Link>
            </Paragraph>
            </Section>

            <Section delay={0.3}>
                <Heading as="h3" variant="section-title">
                    On the web
                </Heading>
                <List>
                    <ListItem>
                        <Link href="https://github.com/JeronOkkers" target="_blank">
                            <Button variant="ghost" colorScheme="teal" leftIcon={<Icon as={IoLogoGithub}/>}>
                                @JeronOkkers
                            </Button>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link href="https://instagram.com/Jeron_Okkers" target="_blank">
                            <Button variant="ghost" colorScheme="teal" leftIcon={<Icon as={IoLogoInstagram}/>}>
                                @JeronOkkers
                            </Button>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link href="https://facebook.com/Jeron_Okkers" target="_blank">
                            <Button variant="ghost" colorScheme="teal" leftIcon={<Icon as={IoLogoFacebook}/>}>
                                @JeronOkkers
                            </Button>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link href="https://twitter.com/Jeron_Okkers" target="_blank">
                            <Button variant="ghost" colorScheme="teal" leftIcon={<Icon as={IoLogoTwitter}/>}>
                                @JeronOkkers
                            </Button>
                        </Link>
                    </ListItem>
                </List>

            </Section>
        </Container>
        </Layout>
    )
}

export default Page
