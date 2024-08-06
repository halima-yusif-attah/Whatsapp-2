'use client'

import styled from "styled-components"
import { Avatar } from "@material-ui/core"
import getRecipientEmail from "@/utils/getRecipientEmail"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from '../firebase'
import { useCollection } from "react-firebase-hooks/firestore"
import { collection, where, query, doc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react'
import { useSidebar } from "@/context/useSidebarContext"


const Chat = ({ id, users }) => {
  
  const router = useRouter()
  const [user] = useAuthState(auth)
  const recipientEmail = getRecipientEmail(users, user)
  const { showSidebar } = useSidebar();
  

const usersCollectionRef = collection(doc(db, 'chats', id), 'clients');

  const [recipientSnapshot] = useCollection(
    query(
      collection(db, 'chats'),
    where('clients', "array-contains", getRecipientEmail(users, user))
    )
)

  const [usersRecipientSnapshot] = useCollection(
    query(
      collection(db, 'users'),
    where("uid", "!=", user.uid))
    )



  const enterChat = () => {
    router.push(`/chats/${id}`)
    showSidebar()
  }
  
  const recipient = recipientSnapshot?.docs?.[0]?.data();
 
 
  const usersSnaphots = usersRecipientSnapshot?.docs?.[0]?.data();

    return (
    <Container onClick={enterChat}>
        { (usersSnaphots?.email === getRecipientEmail(users, user))?
          (<UserAvatar src={usersSnaphots?.photo} />)
        :
         (
         <UserAvatar>{recipientEmail[0]}</UserAvatar>
        )}
        <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat

const Container = styled.div`
 display: flex;
 align-items: center;
 padding: 15px;
 word-break: break-word;
 cursor: pointer;
 
 &:hover {
    background: #e9eaeb; 
 }
`
const UserAvatar = styled(Avatar)`
 margin: 5px;
 margin-right: 15px;
`















