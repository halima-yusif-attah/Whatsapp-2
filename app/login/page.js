'use client'

import styled from "styled-components"
import Head from "next/head"
import { Button } from "@material-ui/core"
import Image from "next/image"
import {auth, provider, signInWithPopup} from '../../firebase'

const  Login = () => {

  // const signIn = () => {
  //   console.log("auth", auth)
  //   console.log("provider", provider)
  //   signInWithPopup(auth, provider).catch(alert)
  // }
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User signed in:", result.user);
      })
      .catch((error) => {
        alert(error.message);
      });
  };


  return (
    <Container> 
        <Head>
            <title>
                Login
            </title>
        </Head>

        <LoginContainer>
          <Logo>
            <Image src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" alt="whatsapp icon" width={200} height={200}/>
          </Logo>
            <Button variant="outlined" onClick={signIn}>Sign in with Google</Button>
        </LoginContainer>
    </Container>
  )
}

export default  Login




const Container = styled.div`
display: grid;
place-items: center;
height: 100vh;
background-color: whitesmoke;
`
const LoginContainer = styled.div`
padding: 100px;
display: flex;
flex-direction: column;
background-color: white;
border-radius: 5px;
box-shadow: 0px 4px, 14px, -3px rgba(0, 0, 0, 0.7)

`

const Logo = styled.div`
margin-bottom: 50px;
`