import React, { useEffect, useState } from "react";
import profilePic from "../../assets/Rudraveer.png";
import downArrow from "../../assets/downarrow.svg";
import "./ChatUsers.css";
import axios from "axios";
import {
  Avatar,
  Box,
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
import UserListItem from "./UserListItem/UserListItem";
import { getRecieverPic, getSender, getSenderId } from "../../config/ChatLogic";
import GroupChatModal from "./GroupChatModal/GroupChatModal";

const ChatUsers = () => {
  const [loggedUser, setLoggedUser] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, selectedChat, setSelectedChat, chats, setChats, fetchAgain, setFetchAgain } = ChatState();
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

  const accessChat = async (chatSelected) => {
    console.log("accessChat called...");
    if (chatSelected.isGroupChat) {
      setSelectedChat(chatSelected);
      setLoadingChat(false);
      setFetchAgain(!fetchAgain);
    } else {
      try {
        const userId = getSenderId(user, chatSelected.users);
        console.log("Sender id: ", userId);
        setLoadingChat(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(`/api/chat`, { userId }, config);
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        console.log("Chat data for selected user: ", data);
        setSelectedChat(data);
        setLoadingChat(false);
        setFetchAgain(!fetchAgain);
        // console.log("Printing reciever pic: ", getReciever(loggedUser, selectedChat.users).pic);
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
      // console.log("Data fetched", data);
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

  // const decryptImage = async (imageUrl) => {

  //   console.log("Encrypted image: ", imageUrl);

  //   if (imageUrl.includes("amazonaws.com")) {
  //     // Check if data is a Blob
  //     if (imageUrl instanceof Blob) {
  //       console.log("Received Blob");
  //     } else if (imageUrl instanceof ArrayBuffer) {
  //       console.log("Received ArrayBuffer");
  //     } else if (typeof imageUrl === "string") {
  //       console.log("Received String");
  //     } else {
  //       console.log("Received Unknown Type");
  //     }

  //     // const binaryString = atob(imageUrl);
  //     const arrayBuffer = new ArrayBuffer(imageUrl);
  //     const uint8Array = new Uint8Array(arrayBuffer);
  //     for (let i = 0; i < arrayBuffer.length; i++) {
  //       uint8Array[i] = arrayBuffer.charCodeAt(i);
  //     }
  //     // Step 3: Decrypt the Uint8Array
  //     const wordArray = CryptoJS.lib.WordArray.create(uint8Array);
  //     const decryptedBytes = CryptoJS.AES.decrypt(wordArray, secretKey);

  //     // Convert decrypted bytes to Uint8Array
  //     const decryptedArray = new Uint8Array(decryptedBytes.sigBytes);
  //     for (let i = 0; i < decryptedBytes.sigBytes; i++) {
  //       decryptedArray[i] =
  //         (decryptedBytes.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  //     }

  //     // Step 4: Decompress the Uint8Array
  //     const decompressedArray = pako.inflate(decryptedArray);

  //     // Convert decompressed data to Base64 string
  //     const base64String = `data:image/jpeg;base64,${btoa(
  //       String.fromCharCode.apply(null, decompressedArray)
  //     )}`;

  //     // 2nd attempt
  //     // const decryptedBytes = CryptoJS.AES.decrypt(
  //     //   bytes,
  //     //   "your-encryption-secret-key"
  //     // );
  //     // const decryptedArrayBuffer = new Uint8Array(
  //     //   decryptedBytes.words.map((word) => word >>> 24)
  //     // );
  //     // const decryptedBlob = new Blob([decryptedArrayBuffer], {
  //     //   type: "image/jpeg",
  //     // });
  //     // const decompressedBlob = await imageCompression(decryptedBlob, {
  //     //   // maxSizeMB: 1, // Adjust as needed
  //     //   useWebWorker: true,
  //     // });
  //     // const decImageUrl = URL.createObjectURL(decompressedBlob);

  //     // 1st attemp
  //     // const bytes = CryptoJS.AES.decrypt(
  //     //   imageUrl,
  //     //   "your-encryption-secret-key"
  //     // );
  //     // const wordArray = CryptoJS.enc.Base64.parse(
  //     //   CryptoJS.enc.Base64.stringify(bytes)
  //     // );
  //     // const base64Image = `data:image/jpeg;base64,${CryptoJS.enc.Base64.stringify(
  //     //   wordArray
  //     // )}`;
  //     console.log("Decrypted image: ", base64String);
  //     return base64String;
  //   } else {
  //     console.log("Image is already decrypted");
  //     return imageUrl;
  //   }
  // }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    console.log("ChatUsers useEffect called");
    console.log("loggedUser: ", loggedUser);
  }, [fetchAgain]);

  return (
    <div className="userContainer">
      {/* <div className="chatSectionName">
        <p>Chai N-Chat</p>
      </div> */}
      <div className="avatarSection">
        <div className="avatar">
          {user && selectedChat ? (
            // <Avatar size={"lg"} name={user.name} src={profilePic} />
            <img
              src={
                selectedChat.isGroupChat
                  ? profilePic
                  : getRecieverPic(user, selectedChat.users)
              }
              alt="profilePic"
            />
          ) : (
            // <Avatar size={"lg"} name={user.name} src={profilePic} />
            <img src={profilePic} alt="profilePic" />
          )}
        </div>
        <div className="userName">
          <p>
            {selectedChat && !selectedChat?.isGroupChat
              ? getSender(
                  JSON.parse(localStorage.getItem("userInfo")),
                  selectedChat?.users
                )
              : selectedChat?.chatName}
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
            {chats && chats.length !== 0 ? (
              <Stack overflowY={"scroll"}>
                {chats &&
                  chats?.map((chat) => (
                    <Box
                      className="user1"
                      onClick={() => {
                        accessChat(chat);
                      }}
                      cursor={"pointer"}
                      bg={
                        selectedChat === chat ? "rgb(248, 211, 217)" : "#F0F3F6"
                      }
                      // color={selectedChat === chat ? "6cb8b5" : "black"}
                      px={3}
                      py={2}
                      borderRadius={"lg"}
                      key={chat._id}
                    >
                      <div className="userPic">
                        {user && chat ? (
                          <img
                            src={
                              chat.isGroupChat
                                ? profilePic
                                : getRecieverPic(user, chat.users)
                            }
                            alt="profilePic"
                          />
                        ) : (
                          <img src={profilePic} alt="profilePic" />
                        )}
                      </div>
                      <div className="userContainer">
                        <div className="userName">
                          <Text className="text">
                            {user && !chat.isGroupChat
                              ? getSender(user, chat.users)
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
