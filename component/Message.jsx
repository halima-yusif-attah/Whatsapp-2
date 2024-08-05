import { auth } from "@/firebase"
import moment from "moment"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components"

const Message = ({user, message}) => {
  const  [userLoggedIn] = useAuthState(auth)
  const router = useRouter();
  
  const TypeOfUser = userLoggedIn.email === user? Sender : Receiver;
 
  useEffect(() => {
    return router.refresh();
  }, [message, router])


  return (
    <Container>
     
      <TypeOfUser>
        {message.text}{""}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..." }
        </Timestamp>
      </TypeOfUser> 
    </Container>
  )
}

export default Message


const Container = styled.div`

`

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 10px;
  min-width: 65px;
  margin-bottom: 26px;
  position: relative;
  text-align: right;
`

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`
const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: right;
`
const Timestamp = styled.span`
  color: gray;
  padding: 5px;
  padding-top: 0.5rem;
  font-size: 10px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`