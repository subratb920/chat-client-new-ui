import React, { useEffect, useState } from 'react'
import sendSVG from "../../assets/send.svg"
import './ChatSection.css'
import { ChatState } from '../Context/ChatProvider';
import { Box, Icon, Stack, Text, useToast } from '@chakra-ui/react';
import ChatLoading from "../ChatLoading";
import axios from 'axios';
import { getSender, getSenderFull } from "../../config/ChatLogic";
import { ArrowBackIcon } from '@chakra-ui/icons';
import ProfileModal from '../ProfileModal/ProfileModal';
import UpdateGroupChatModal from '../Modals/UpdateGroupChatModal';

const ChatSection = ({fetchAgain, setFetchAgain}) => {

  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [fetchAgain]);

  return (
    <div className="chatContainer">
      <div className="chatSectionName">
        <Text
          fontSize={{ base: "28px", md: "30px", lg: "22px" }}
          pb={3}
          px={2}
          w={"100%"}
          fontFamily={"Work sans"}
          d="flex"
          justifyContent={"center"}
          alignItems={"center"}
          gap={3}
          fontWeight={"bold"}
        >
          <Icon
            d={{ base: "flex", md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat("")}
          />  
          {selectedChat && !selectedChat?.isGroupChat ? (
          <>
            { getSender(user, selectedChat?.users).toUpperCase()}
              <ProfileModal user={getSenderFull(user, selectedChat?.users)} />
          </>
          ) : (
            <>
              { selectedChat?.chatName.toUpperCase() }
               {< UpdateGroupChatModal
                 fetchAgain={fetchAgain}
                 setFetchAgain={setFetchAgain}
                 />}
            </>
          )}
        </Text>
        {/* <p>
          Chatting with{" "}
          {selectedChat ? getSender(loggedUser, selectedChat?.users) : ""}
        </p> */}
      </div>
      <div className="chatSectionContent">
        <div className="messages">
          {selectedChat ? (<></>)
          : (<p> Click on a user to start chatting</p>)}
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
