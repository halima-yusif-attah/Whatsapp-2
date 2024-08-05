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
import firebase from "../firebase"
import getRecipientEmail from '@/utils/getRecipientEmail';
import { getLastSeen } from '@/app/chats/[id]/page';
import Timeago from 'react-timeago';
import moment from 'moment';
import ReactTimeago from 'react-timeago';



const  ChatScreen = ({chat, messages}) => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('')
  const [lastSeen, setLastSeen] = useState(null);
  const chatId = chat.id;
  const router = useRouter();

  console.log('user.id-screen', user.id)

  const messagesQuery = query(
        collection(doc(db, 'chats', chatId), "messages"),
        orderBy('timestamp', 'asc')
      )
  
  
   const [usersRecipientSnapshot] = useCollection(
    query(
      collection(db, 'users'),
    where("uid", "!=", user.uid))
    )
  console.log("usersRecipientSnapshot", usersRecipientSnapshot?.docs?.[0]?.data())

  const usersSnaphots = usersRecipientSnapshot?.docs?.[0]?.data();
  console.log("usersSnaphots.email ", usersSnaphots?.email === getRecipientEmail(chat.clients, user))
  
  
  

  // const showMessages = () => {
  //   const messagesSnapshot = getDocs(messagesQuery)
  //   console.log('messagesSnapshot', messagesSnapshot)
  //   console.log('messagesSnapshot', messagesSnapshot)
  //   if (messagesSnapshot) {
  //     return messagesSnapshot.map((message) => (
  //       <Message
  //       key={message.id}
  //       user={message.data().user}
  //       message={{
  //         ...message.data(),
  //         timestamp: message.data().timestamp?.toDate().getTime(),

  //       }}
  //       />
  //     ))
  //   }
  // }

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

  console.log("date", new Date(usersSnaphots?.lastSeen.seconds).toTimeString())
  

 
 
  return (
    <Container>
        <Header>
          <Avatar />
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
          </HeaderIcons>
        </Header>

        <MessageContainer>
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
`

const HeaderIcons = styled.div``

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


