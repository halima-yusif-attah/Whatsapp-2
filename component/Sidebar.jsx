"use client"

import styled from "styled-components"
import { Avatar, Button, IconButton } from "@material-ui/core"
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from "email-validator"
import { auth, db } from '../firebase'
import { collection, addDoc, query, where } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from './Chat';

const Sidebar = ({show}) => {
  const [user] = useAuthState(auth);
  console.log('show-bar.jsx', show)

  const userChatRef = query(
    collection(db, 'chats'),
    where('clients', 'array-contains', user.email)
  );
  const [chatsSnapshot] = useCollection(userChatRef);

  
  const createChat = () => {
    const input = prompt('Please enter an email address for the user you wish to chat with')
  
    if (!input) return null;

    if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
      //We need to add the chat into the the DB 'chats collection if it doesn't already exists and is valid
      addDoc(collection(db, 'chats'), {
        clients: [user.email, input]
      })
    }
  
  }

  const chatAlreadyExists = (recipientEmail) => 
    !!chatsSnapshot.docs?.find(
      chat => chat.data().clients.find((user) => user === recipientEmail)?.length > 0
    )

  

  return (
    <Container show={show} >
      
        <Header>
            <UserAvatar src ={user.photoURL} onClick={() => auth.signOut()}/>  
            <IconsContainer>
                <IconButton>
                  <ChatIcon />
                </IconButton>
                <IconButton>
                  <MoreVertIcon/>
                </IconButton>
            </IconsContainer>
        </Header>

        <Search>
            <SearchIcon />
            <SearchInput placeholder='Search in chats' />
        </Search>

        <SidebarButton onClick={createChat}>start a new chat</SidebarButton>
       

       {/* {lists of charts} */}
       {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().clients} />
       )
        
       )}
       
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 330px;
  max-width: 350px;
  overflow-y: scroll;
  background-color: white;

  ::-webkit-scrollbar {
    display: none
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 420px) {
    /* display: ${show => (show ? 'block' : 'none')}; */
     display: ${props => (props.show? 'block' : 'none')};
     margin-bottom: 1rem;
  }
`

const Search = styled.div`
display: flex;
align-items: center;
padding: 20px;
border-radius: 2px;
`

const SearchInput = styled.input`
outline-width: 0px;
border: none;
flex: 1;

`

const SidebarButton = styled(Button)`
width: 100%;
`

const Header = styled.div`
 display: flex;
 position: sticky;
 top: 0;
 background-color: white;
 z-index: 1;
 justify-content: space-between;
 align-items: center;
 padding: 15px;
 height: 80px;
 border-bottom: 1px solid whitesmoke
`
const UserAvatar = styled(Avatar)`
 cursor: pointer;

 :hover {
    opacity: 0.8;
 }
`
const IconsContainer = styled.div``



