import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { PhoneIcon, ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import { VscUnmute } from "react-icons/vsc";
import { IoVideocamOutline } from "react-icons/io5";
import { Grid, GridItem } from "@chakra-ui/react";
import { SocketContext } from "../Context/SocketContext";
import peer from "../../peer";
import { useSocket } from "../Context/SocketProvider";
import ReactPlayer from "react-player";

const SingleVideoCallModal = ({ openVideoModal, setOpenVideoModal, remoteUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const { user } = ChatState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    console.log("handleCallUser::Stream: ", stream);
    sendStreams();
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    console.log("sendStreams::myStream: ", myStream);
    console.log(myStream.getTracks());
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(...track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    // sendStreams();

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <div>
      <>
        <IconButton
          isRound
          margin={2}
          // colorScheme="blue"
          aria-label="Call Segun"
          size="lg"
          d={{ base: "flex" }}
          onClick={() => {
            handleCallUser();
            onOpen();
          }}
          icon={<IoVideocamOutline />}
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
              <Grid gap={2} w={"100%"} h={"100%"}>
                {/* User's Video */}
                <GridItem
                  w={"100%"}
                  h={"90%"}
                  border={"1px solid white"}
                  m={2}
                  p={2}
                  borderRadius={"10px"}
                >
                  <div>
                    <Text color={"white"}>{remoteUser?.name || "Name"}</Text>
                    {remoteStream && (
                      <ReactPlayer
                        playing
                        muted
                        height="100px"
                        width="200px"
                        url={remoteStream}
                      />
                      // <video
                      //   playsInline
                      //   muted
                      //   ref={myVideo}
                      //   autoPlay
                      //   style={{ width: "300px" }}
                      // />
                    )}
                  </div>
                </GridItem>

                {/* Our own Video */}
                <GridItem
                  w={"100%"}
                  h={"90%"}
                  border={"1px solid white"}
                  m={2}
                  p={2}
                  borderRadius={"10px"}
                >
                  <div> 
                    <Text color={"white"}>{user?.name || "Name"}</Text>
                    {console.log("myStream for video: ",myStream)}
                    {myStream && (
                      <ReactPlayer
                        playing
                        muted
                        height="100px"
                        width="200px"
                        url={myStream}
                      />
                      // <video
                      //   playsInline
                      //   muted
                      //   ref={userVideo}
                      //   autoPlay
                      //   style={{ width: "300px" }}
                      // />
                    )}
                  </div>
                </GridItem>
              </Grid>
              {/* <Box d="flex" flexWrap="wrap" pb={3} w={"100%"} h={"100%"}>
                {selectedChat?.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </Box> */}
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
                isRound
                margin={2}
                colorScheme="black"
                color={"gray"}
                border={"1px solid gray"}
                aria-label="Call Segun"
                size="lg"
                icon={<VscUnmute />}
              />
              <IconButton
                isRound
                margin={2}
                colorScheme="black"
                color={"gray"}
                border={"1px solid gray"}
                aria-label="Call Segun"
                size="lg"
                icon={<IoVideocamOutline />}
              />
              <IconButton
                isRound
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

export default SingleVideoCallModal;
