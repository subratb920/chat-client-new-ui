import React from 'react'
import Menubar from '../../components/Menubar/Menubar';
import ChatUsers from '../../components/ChatUsers/ChatUsers';
import ChatSection from '../../components/ChatSection/ChatSection';
import FilesContent from '../../components/FilesContent/FilesContent';
import './chatPage.css'

const ChatPage = () => {
  return (
    <div className='chatPage'>
      <Menubar></Menubar>
      <ChatUsers></ChatUsers>
      <ChatSection></ChatSection>
      <FilesContent></FilesContent>
    </div>
  );
}

export default ChatPage;
