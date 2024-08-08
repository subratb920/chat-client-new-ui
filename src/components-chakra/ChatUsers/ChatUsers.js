import React, { useEffect, useState } from "react";
import profilePic from "../../assets/Rudraveer.png";
import downArrow from "../../assets/downarrow.svg";
import { searchIcon } from "../../assets/magnifying-glass-svgrepo-com.svg";
import "./ChatUsers.css";
import axios from "axios";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import UserListItem from "./UserListItem/UserListItem";
import { getSender, getSenderId } from "../../config/ChatLogic";
import GroupChatModal from "./GroupChatModal/GroupChatModal";

const ChatUsers = ({fetchAgain, setFetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      setLoading(true);
      // console.log("Please enter something in search");
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    } else {
      try {
        setChats([]);
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        // console.log("Data recieved: ", data);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occured!",
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      // console.log(data);
      // setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const userId = "";
      const { data } = await axios.get("/api/chat", config);
      console.log("Data fetched", data);
      setChats(data);
      console.log("Chats set", chats);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    // console.log("ChatUsers useEffect called");
    // console.log("selectedChat: ", selectedChat);
  }, [fetchAgain]);

  return (
    <div className="userContainer">
      {/* <div className="chatSectionName">
        <p>Chai N-Chat</p>
      </div> */}
      <div className="avatarSection">
        <div className="avatar">
          <img src={profilePic} alt="profilePic" />
        </div>
        <div className="userName">
          <p>
            {selectedChat
              ? getSender(
                  JSON.parse(localStorage.getItem("userInfo")),
                  selectedChat?.users
                )
              : ""}
          </p>
        </div>
        <div className="userStatus">
          <p>Available</p> <img src={downArrow} alt="downArrow" />
        </div>
      </div>
      <div className="userListSection">
        <Tooltip
          label="Search users to chat"
          openDelay={500}
          hasArrow
          placement="bottom-end"
        >
          <div className="searchSection">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />

            <i
              className="fas fa-search"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleSearch();
              }}
            ></i>
          </div>
        </Tooltip>
        <div className="lastChatSection">
          <p>Last Chats</p>
          <Menu>
            <MenuButton p={1}>
              <i
                className="fas fa-ellipsis-v"
                style={{ cursor: "pointer" }}
                // onClick={() => {handleSearch();}}
              />
            </MenuButton>
            <MenuList>
              <GroupChatModal>
                <MenuItem>Create Group Chat</MenuItem>
              </GroupChatModal>
              <MenuItem>Option 2</MenuItem>
              <MenuItem>Option 3</MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className="userListSection">
          <div className="users">
            {chats ? (
              <Stack overflowY={"scroll"}>
                {chats?.map((chat) => (
                  <Box
                    className="user1"
                    onClick={() => {
                      setSelectedChat(chat);
                      accessChat(getSenderId(user, chat.users));
                    }}
                    cursor={"pointer"}
                    bg={
                      selectedChat === chat ? "rgb(248, 211, 217)" : "#F0F3F6"
                    }
                    // bg={selectedChat === chat ? "#38B2AC" : "#F0F3F6"}
                    // color={selectedChat === chat ? "6cb8b5" : "black"}
                    px={3}
                    py={2}
                    borderRadius={"lg"}
                    key={chat._id}
                  >
                    <div className="userPic">
                      <img src={profilePic} alt="profilePic" />
                    </div>
                    <div className="userContainer">
                      <div className="userName">
                        <Text className="text">
                          {!chat.isGroupChat
                            ? getSender(loggedUser, chat.users)
                            : chat.chatName}
                        </Text>
                      </div>
                      <div className="userTyping">
                        <p>typing...</p>
                      </div>
                    </div>
                    <div className="lastMsgTimeContainer">
                      <div className="lastMsgTime">
                        <p>22:30 PM</p>
                      </div>
                      <div className="lastMsgTimeEmpty">
                        <p></p>
                      </div>
                    </div>
                  </Box>
                ))}
              </Stack>
            ) : (
              searchResult?.map((user) => (
                // console.log("user inside search result: ", user),
                <UserListItem
                  key={user?._id}
                  user={user}
                  handleFunction={() => accessChat(user?._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUsers;
