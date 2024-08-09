import React, { useEffect, useState } from 'react'
import sendSVG from "../../assets/send.svg"
import './ChatSection.css'
import { ChatState } from '../Context/ChatProvider';
import { Box, Icon, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import ChatLoading from "../ChatLoading";
import axios from 'axios';
import { getSender, getSenderFull } from "../../config/ChatLogic";
import { ArrowBackIcon } from '@chakra-ui/icons';
import ProfileModal from '../ProfileModal/ProfileModal';
import UpdateGroupChatModal from '../Modals/UpdateGroupChatModal';
import ScrollableChat from '../ScrollableChat/ScrollableChat';
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/Animation - 1723167029798.json";

const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;

const ChatSection = ({fetchAgain, setFetchAgain}) => {

  const [loggedUser, setLoggedUser] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log("Messages: ",data);
      setMessages(data);
      setLoading(false);

      socket.emit("join-chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat?._id,
          },
          config
        );
        console.log(data);
        setMessages([...messages, data]);
        setNewMessage("");
        setLoading(false);
        socket.emit("new-message", data);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);  
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchMessages()

    selectedChatCompare = selectedChat;
  }, [fetchAgain]);

  useEffect(() => {
    socket.on("message-receive", (newMessageRecieved) => {
      if(
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare?._id !== newMessageRecieved?.chat?._id) {
         // Give notification
        } else {
          setMessages([...messages, newMessageRecieved]);
        }
      setSocketConnected(true);
      console.log("connected");
    });
  });

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
              {getSender(user, selectedChat?.users).toUpperCase()}
              <ProfileModal user={getSenderFull(user, selectedChat?.users)} />
            </>
          ) : (
            <>
              {selectedChat?.chatName.toUpperCase()}
              {
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              }
            </>
          )}
        </Text>
        {/* <p>
          Chatting with{" "}
          {selectedChat ? getSender(loggedUser, selectedChat?.users) : ""}
        </p> */}
      </div>
      <div className="chatSectionContent">
        <div className="messageBox">
          {selectedChat ? (
            loading ? (
              <Spinner />
            ) : (
              <ScrollableChat messages={messages} />
            )
          ) : (
            <p> Click on a user to start chatting</p>
          )}
          {isTyping ? <div>
            <Lottie
              options={defaultOptions}
              width={70}
              style={{ marginBottom: 15, marginLeft: 0 }}
            />
          </div> : <></>}
        </div>
        <div className="inputSection" onKeyDown={sendMessage}>
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={typingHandler}
          />
          <div className="send">
            <img src={sendSVG} alt="send svg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSection
