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
            <Text>The Page you are looking for was not found.</Text>
            <Divider my={6}/>
            <Box m={6} align="center">
                <NextLink href="/" legacyBehavior>
                <Button colorScheme="teal">Return to Home</Button>
                </NextLink>
            </Box>
        </Container>
    );
}

export default NotFound