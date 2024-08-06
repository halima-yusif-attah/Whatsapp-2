import {  collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import ChatMessages from '@/component/ChatMessages'
import { db } from '../../../firebase'

async function getChatData(id) { 
  const ref = doc(collection(db, 'chats'), id)

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
  const chatData = await getChatData(id);
  
  return (
    <>
      <ChatMessages {...chatData}/> 
      
    </>
  )
}



