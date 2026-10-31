import Link from 'next/link'
import Image from 'next/image'
import { Text, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  height: 30px;
  line-height: 20px;
  padding: 10px;

  img {
    border-radius: 50%;
    transition: transform 0.3s ease;
  }
  &:hover img {
    transform: rotate(20deg);
  }
`

const Logo = () => (
  <Link href="/" scroll={false}>
    <LogoBox>
      <Image src="/images/mark.png" width={24} height={24} alt="" />
      <Text
        color={useColorModeValue('gray.800', 'whiteAlpha.900')}
        fontFamily="M PLUS Rounded 1c"
        fontWeight="bold"
        ml={3}
      >
        Jeron Okkers
      </Text>
    </LogoBox>
  </Link>
)

export default Logo
