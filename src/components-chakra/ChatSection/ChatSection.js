import React, { useState } from 'react'
import sendSVG from "../../assets/send.svg"
import './ChatSection.css'
import { ChatState } from '../Context/ChatProvider';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const ChatSection = () => {

  // const [loggedUser, setLoggedUser] = useState();
  // const [selectedChat, setSelectedChat, user, chats, setChats] = ChatState(null);
  // const toast = useToast();

  // const fetchChats = async () => {
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  //     const { data } = await axios.get("/api/chat", config);
  //     setChats(data);
  //   } catch (error) {
  //     toast({
  //       title: "Error Occured!",
  //       description: "Failed to Load the chats",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom-left",
  //     });
  //   }
  // };

  return (
    <div className="chatContainer">
      <div className="chatSectionName">
        <p>Chatting with Rudraveer</p>
      </div>
      <div className="chatSectionContent">
        <div className="messages">
          <p>Message</p>
        </div>
        <div className="inputSection">
          <input type="text" placeholder="Type a message" />
          <div className="send">
            <img src={sendSVG} alt="send svg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSection
