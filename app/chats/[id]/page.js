import {  collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import ChatMessages from '@/component/ChatMessages'
import { db } from '../../../firebase'
// import { Router } from 'next/navigation';
import { Router } from 'next/navigation';

async function getChatData(id) { 
  const ref = doc(collection(db, 'chats'), id)
  console.log('ref - id', ref)
  
  //PREP THE MESSAGES ON THE SERVER
  const messageQuery = query(collection(ref, 'messages'), orderBy('timestamp', 'asc'))
  const messagesRes = await getDocs(messageQuery)

  const messages = messagesRes.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })).map((messages => ({
    ...messages,
    timestamp: messages.timestamp.toDate().getTime(),
  })))


  //Prep the chats
  const chatRes = await getDoc(ref);
  const chat = {
    id: chatRes.id,
   ...chatRes.data(),
  }

  return { 
      messages: messages,
      chat: chat,
  }
 
}

export default async function ChatPage({params}) {
  const {id} = params;
  console.log('id - getchat', id)
  const chatData = await getChatData(id);
  console.log('chatData', chatData)
  return (
    <>
      <ChatMessages {...chatData}/> 
      
    </>
  )
}



