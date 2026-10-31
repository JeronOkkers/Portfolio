import NextLink from 'next/link';
import {
Box,
Heading,
Container,
Text,
Divider,
Button}  from '@chakra-ui/react';

const NotFound = () => {
    return (
        <Container>
            <Heading as="h1">Not Found</Heading>
            <Text>This page drifted off into orbit — it doesn&apos;t exist (anymore).</Text>
            <Divider my={6}/>
            <Box m={6} align="center">
                <NextLink href="/" legacyBehavior>
                <Button colorScheme="orange">Return to Home</Button>
                </NextLink>
            </Box>
        </Container>
    );
}

export default NotFound