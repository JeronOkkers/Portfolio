import Head from 'next/head'
import dynamic from 'next/dynamic'
import Navbar from '../navbar'
import Footer from '../footer'
import { Box, Container } from '@chakra-ui/react'

// Three.js only runs in the browser
const Planet = dynamic(() => import('../planet'), { ssr: false })

const description =
  'Jeron Okkers — application developer and Computer Science student in Cape Town. Building practical software for warehouses, workforces and the web.'

const Main = ({ children, router }) => {
  const isHome = router.pathname === '/'
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta name="author" content="Jeron Okkers" />
        <meta property="og:site_name" content="Jeron Okkers" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <title>Jeron Okkers — Developer</title>
      </Head>

      <Navbar path={router.asPath} />

      <Container maxW="container.md" pt={14}>
        {isHome && <Planet />}
        {children}
        <Footer />
      </Container>
    </Box>
  )
}

export default Main
