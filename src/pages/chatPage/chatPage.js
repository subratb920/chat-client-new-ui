import React, { useEffect } from 'react'
import Menubar from '../../components/Menubar/Menubar';
import ChatUsers from '../../components-chakra/ChatUsers/ChatUsers';
import ChatSection from '../../components-chakra/ChatSection/ChatSection';
import FilesContent from '../../components-chakra/FilesContent/FilesContent';
import './chatPage.css'
import { useNavigate } from 'react-router';

const ChatPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

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
