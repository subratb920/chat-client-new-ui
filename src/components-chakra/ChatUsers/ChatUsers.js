import React, { useEffect, useState } from 'react'
import profilePic from "../../assets/Rudraveer.png";
import downArrow from "../../assets/downarrow.svg"
import { searchIcon } from "../../assets/magnifying-glass-svgrepo-com.svg";
import './ChatUsers.css'
import axios from 'axios';
import { Box, Button, Text, Tooltip, useToast } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import ChatLoading from '../ChatLoading';

const ChatUsers = () => {

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = ChatState();
  const [chats, setChats] = useState([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!search) {
      setLoading(true);
      console.log("Please enter something in search");
      // toast({
      //   title: "Please Enter something in search",
      //   status: "warning",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "top-left",
      // });
      return;
    } else {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        console.log("Data recieved: ",data);
        setSearchResult(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        // toast({
        //   title: "Error Occured!",
        //   description: "Failed to Load the chats",
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        //   position: "bottom-left",
        // });
      }
    }
  };
   
  // const fetchChats = async () => {
  //   const { data } = await axios.get("/api/chat");
  //   setChats(data);
  //   console.log("fetching data: " + data);
  // };

  // useEffect(() => {
  //   fetchChats();
  //   console.log("fetching chats: " + chats);
  // }, []);

  return (
    <div className="userContainer">
      <div className="chatSectionName">
        <p>Chai N-Chat</p>
      </div>
      <div className="avatarSection">
        <div className="avatar">
          <img src={profilePic} alt="profilePic" />
        </div>
        <div className="userName">
          <p>Rudraveer</p>
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
              class="fas fa-search"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleSearch();
              }}
            ></i>
          </div>
        </Tooltip>
        {/* <Box
          d="flex"
          alignItems="center"
          justifyContent="space-between"
          bg={"white"}
          w={"100%"} p={"5px 10px 5px 10px"}
          borderRadius={"5px"} borderWidth={"5px"} >
          <Tooltip
            label="Search users to chat"
            openDelay={500}
            hasArrow
            placement="bottom-end"
          >
            <Button variant="ghost">
              <i class='fas fa-search'></i>
              <Text d={{ base: "none", md: "flex" }} px={"4"}>Search User</Text>
            </Button>
          </Tooltip>
        </Box> */}
        <div className="lastChatSection">
          <p>Last Chats</p>
        </div>
        <div className="userListSection">
          <div className="users">
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <div className="user1" key={user?._id}>
                  <div className="userPic">
                    <img src={profilePic} alt="profilePic" />
                  </div>
                  <div className="userContainer">
                    <div className="userName">
                      <p>{user?.name}</p>
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
                </div>
              ))
            )}
            <div className="user1">
              <div className="userPic">
                <img src={profilePic} alt="profilePic" />
              </div>
              <div className="userContainer">
                <div className="userName">
                  <p>Rudraveer</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatUsers
