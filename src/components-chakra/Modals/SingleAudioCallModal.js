import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import UserListItem from '../ChatUsers/UserListItem/UserListItem';
import axios from 'axios';
import { PhoneIcon, ViewIcon } from '@chakra-ui/icons';
import UserBadgeItem from '../UserBadgeItem/UserBadgeItem';
import { ChatState } from '../Context/ChatProvider';
import { getSender } from '../../config/ChatLogic';
import { VscUnmute } from "react-icons/vsc";
import { VscMute } from "react-icons/vsc";
import { IoVideocamOutline } from "react-icons/io5";

const SingleAudioCallModal = ({
  selectedChat,
  setSelectedChat,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [renameLoading, setRenameLoading] = useState();
  const { user } = ChatState();
  const toast = useToast();

  const handleRemove = async (user1) => {
    // console.log("Handle remove called...");
    if (selectedChat?.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can add/remove members!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/group/remove`,
        {
          chatId: selectedChat?._id,
          userId: user1._id,
        },
        config
      );
      // console.log("Exit Group data: ", data);
      setSelectedChat(data);
      //   user1._id === user._id ? selectedChat({}) : setSelectedChat(data);
      fetchMessages();
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const changeGroupChatName = (value) => {
    setGroupChatName(value);
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Please enter a chat name!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } else {
      try {
        setRenameLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `/api/chat/group/rename`,
          {
            chatId: selectedChat?._id,
            chatName: groupChatName,
          },
          config
        );
        // console.log(data?._id);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setRenameLoading(false);
      }
      setGroupChatName("");
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setSearch(query);
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat?.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat?.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/group/add`,
        {
          chatId: selectedChat?._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <div>
      <>
        <IconButton
          margin={2}
          // colorScheme="blue"
          aria-label="Call Segun"
          size="lg"
          d={{ base: "flex" }}
          onClick={onOpen}
          icon={<VscUnmute />}
        />
        <Modal
          backgroundColor={"white"}
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          width={"100%"}
          height={"100%"}
        >
          {/* <ModalOverlay /> */}
          <ModalContent backgroundColor={"gray"} w={"100%"} h={"100%"}>
            <ModalHeader
              fontSize={"35px"}
              fontFamily={"Work sans"}
              d="flex"
              justifyContent={"center"}
              alignItems={"center"}
            >
              {/* {getSender(user, selectedChat.users)} */}
              <ModalCloseButton color={"white"} />
            </ModalHeader>
            <ModalBody backgroundColor={"black"} w={"100%"} h={"100%"}>
              <Box d="flex" flexWrap="wrap" pb={3} w={"100%"} h={"100%"}>
                {/* {selectedChat?.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))} */}
              </Box>
              {/* <FormControl d="flex">
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  value={groupChatName}
                  onChange={(e) => changeGroupChatName(e.target.value)}
                />
                <Button
                  variant={"solid"}
                  colorScheme="teal"
                  ml={3}
                  isLoading={renameLoading}
                  onClick={handleRename}
                >
                  Rename
                </Button>
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users to Group"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              {loading ? (
                <Spinner size="lg" />
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))
              )} */}
            </ModalBody>

            <ModalFooter
              d="flex"
              justifyContent={"center"}
              backgroundColor={"black"}
            >
              <IconButton
                margin={2}
                colorScheme="green"
                aria-label="Call Segun"
                size="lg"
                icon={<VscUnmute />}
              />
              <IconButton
                margin={2}
                colorScheme="blue"
                aria-label="Call Segun"
                size="lg"
                icon={<IoVideocamOutline />}
              />
              <IconButton
                margin={2}
                colorScheme="red"
                aria-label="Call Segun"
                size="lg"
                icon={<PhoneIcon />}
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default SingleAudioCallModal;
