'use client'

import styled from 'styled-components'
import { Avatar, IconButton } from '@material-ui/core'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase'
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, getDocs,setDoc, query, doc, serverTimestamp, addDoc, getDoc, updateDoc, where } from "firebase/firestore"
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { useState, useEffect } from 'react';
import Message from './Message'
import MicIcon from "@material-ui/icons/Mic";
import ListIcon from '@material-ui/icons/List';
import getRecipientEmail from '@/utils/getRecipientEmail';
import Timeago from 'react-timeago';
import Sidebar from './Sidebar';

const  ChatScreen = ({chat, messages, show, showSidebar}) => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('')
  
  const chatId = chat.id;
  const router = useRouter();
 
  console.log("show-screen.jsx", show)

  const messagesQuery = query(
        collection(doc(db, 'chats', chatId), "messages"),
        orderBy('timestamp', 'asc')
      )
  
  
   const [usersRecipientSnapshot] = useCollection(
    query(
      collection(db, 'users'),
    where("uid", "!=", user.uid))
    )

  const usersSnaphots = usersRecipientSnapshot?.docs?.[0]?.data();
  
  
 

  const sendMessage = async (e) => {
    e.preventDefault();

    const messagesRef = collection(db, 'chats', chatId, 'messages');
       
    try {
      //add messages to the database
      await addDoc(messagesRef, {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL
      })
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setInput("");
    router.refresh();
  }

  const recipientEmail = getRecipientEmail(chat.clients, user)

 
  return (
    <Container>
        <Header>
          { (usersSnaphots?.email === getRecipientEmail(chat.clients, user))?
          (<UserAvatar src={usersSnaphots?.photo} />)
        :
         (
         <UserAvatar>{recipientEmail[0]}</UserAvatar>
        )} 
          <HeaderInformation>
            <h3>{recipientEmail}</h3>
            {(usersSnaphots?.email === getRecipientEmail(chat.clients, user))? 
            <p>Last active {<Timeago date={new Date(usersSnaphots?.lastSeen.seconds*1000)}/>}</p> : "Unavailable"}
            
          </HeaderInformation>
          <HeaderIcons>
            <IconButton>
              <AttachFileIcon />
            </IconButton>

            <IconButton>
              <MoreVertIcon />
            </IconButton>

            <Options onClick={() => showSidebar()}>
               <IconButton>
              <ListIcon />
            </IconButton>
            </Options>
          </HeaderIcons>
        </Header>

        <MessageContainer>
          
          {/* {show && <Sidebar visible={show} />}
           {console.log("show-2", show)} */}
          {!show && 
          <>
          {messages.map(message => (
        <Message
        key={message.id}
        user={message.user}
        message={{
          text: message.message,
          timestamp: new Date(message.timestamp)
          
        }}
        />
      ))}
      </>
    }  
          <EndMessage/>
        </MessageContainer>
        <InputContainer>
          <InsertEmoticonIcon/>
          <Input value={input} onChange={(e) => setInput(e.target.value)}/>
          <button hidden disabled={!input} type="submit" onClick={sendMessage} >Send Message</button>
          <MicIcon />
        </InputContainer>
    </Container>
  )
}

export default ChatScreen


const Container = styled.div`
  position: relative;
`

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }

  @media (max-width: 430px) {
    margin-left: 10px;

  > h3 {
    margin-bottom: 3px;
    font-size: 12px;
  }
  >p {
    font-size: 8px;
  }
  }
`

const HeaderIcons = styled.div`
  @media (max-width: 430px) {
    display: flex;
    justify-content: center;
  }
`
const UserAvatar = styled(Avatar)`
 margin: 5px;
 margin-right: 15px;
`

const Options = styled.div`
  @media (min-width: 430px) {
    display: none;
  }
`

const MessageContainer = styled.div`
  height: 90vh;
  background-color: #e5ded8; 
  padding: 30px;
  overflow-y: scroll;
`

const EndMessage = styled.div``

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100; 
`
  
const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background-color: whitesmoke;
  margin-left: 15px;
  margin-right: 15px;
  padding: 20px;
`


