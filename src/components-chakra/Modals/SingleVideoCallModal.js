import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  IconButton,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Grid,
  GridItem,
  Text,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { IoVideocamOutline } from "react-icons/io5";
import { useSocket } from "../Context/SocketProvider";
import peer from "../../peer";
import { VscUnmute } from "react-icons/vsc";
import { PhoneIcon } from "@chakra-ui/icons";

const SingleVideoCallModal = ({
  openVideoModal,
  setOpenVideoModal, // Modal visibility handler
  remoteUser,
}) => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false); // Track call acceptance
  const [incomingCall, setIncomingCall] = useState(null); // Track incoming call
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI modal controls
  const myVideoRef = useRef();
  const remoteVideoRef = useRef();

  // ICE Candidate Queue
  let iceCandidateQueue = [];

  // Function to process queued ICE candidates once remoteSocketId is available
  const processQueuedIceCandidates = async () => {
    for (let i = 0; i < iceCandidateQueue.length; i++) {
      const candidate = iceCandidateQueue[i];
      console.log("Sending queued ICE candidate:", candidate);
      socket.emit("ice-candidate", { candidate, userToCall: remoteSocketId });
    }
    iceCandidateQueue = []; // Clear queue after processing
  };

  // Function to reinitialize WebRTC peer connection for new calls
  const reinitializePeerConnection = () => {
    if (peer.peer) {
      peer.peer.close();
    }
    peer.peer = new RTCPeerConnection(); // Reinitialize WebRTC peer connection
    console.log("Peer connection reinitialized");
  };

  // Monitor WebRTC connection state and handle media tracks
  useEffect(() => {
    reinitializePeerConnection();
    peer.peer.onconnectionstatechange = () => {
      console.log("Connection state change:", peer.peer.connectionState);

      if (peer.peer.connectionState === "connected") {
        console.log("Peers connected successfully");
      } else if (
        peer.peer.connectionState === "disconnected" ||
        peer.peer.connectionState === "failed"
      ) {
        console.error("Connection failed or disconnected");
      }
    };

    peer.peer.onicecandidate = (event) => {
      if (event.candidate && remoteSocketId) {
        console.log("Sending ICE Candidate", event.candidate);
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          userToCall: remoteSocketId,
        });
      } else {
        console.log("Queuing ICE Candidate, remoteSocketId not set");
        iceCandidateQueue.push(event.candidate); // Queue ICE candidates if remoteSocketId is not available
      }
    };

    peer.peer.ontrack = (event) => {
      console.log("Receiving remote stream:", event.streams[0]);

      setRemoteStream(event.streams[0]);

      if (remoteStream && remoteVideoRef.current) {
        // Stop the previous video stream if there is one
        if (remoteVideoRef.current.srcObject) {
          console.log("Stopping previous remote video stream");
          remoteVideoRef.current.srcObject
            .getTracks()
            .forEach((track) => track.stop());
          remoteVideoRef.current.srcObject = null;
        }

        // Attach the new remote stream
        remoteVideoRef.current.srcObject = remoteStream;
        console.log("Attached new remote stream to video element");

        // Ensure the video plays when the metadata is fully loaded, with a slight delay
        remoteVideoRef.current.onloadedmetadata = () => {
          setTimeout(() => {
            remoteVideoRef.current.play().catch((error) => {
              console.error("Error playing remote video:", error);
            });
          }, 100); // Delay playback by 100ms to avoid race conditions
        };
      }
    };

    return () => {
      peer.peer.onconnectionstatechange = null;
      peer.peer.onicecandidate = null;
      peer.peer.ontrack = null;
    };
  }, [remoteSocketId, socket]);

  // Handle user call (Caller Side)
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);

    if (myVideoRef.current) {
      myVideoRef.current.srcObject = stream;
    }

    stream.getTracks().forEach((track) => {
      console.log("Caller: Adding track", track);
      peer.peer.addTrack(track, stream); // Add caller's media tracks
    });

    const offer = await peer.getOffer();
    console.log("Sending offer", offer);

    if (remoteSocketId) {
      console.log("Calling user", remoteSocketId);
      socket.emit("calluser", {
        userToCall: remoteSocketId,
        signalData: offer,
        from: socket.id,
      });
    } else {
      console.error("Error: remoteSocketId is not set when calling user.");
    }
  }, [remoteSocketId, socket]);

  // Handle call accept by callee
  const handleAcceptCall = useCallback(
    async (from, offer) => {
      setCallAccepted(true); // Mark the call as accepted
      setOpenVideoModal(true);
      onClose(); // Close the accept/reject modal once the call is accepted

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        console.log("Callee: Adding track", track);
        peer.peer.addTrack(track, stream); // Add callee's media tracks
      });

      console.log("Setting remote description to offer:", offer);
      await peer.peer.setRemoteDescription(new RTCSessionDescription(offer));

      processQueuedIceCandidates();

      const answer = await peer.peer.createAnswer();
      console.log("Answer created:", answer);
      await peer.peer.setLocalDescription(answer);
      socket.emit("answercall", { to: from, signal: answer });
      console.log("Answer sent to caller", answer);
    },
    [socket, setOpenVideoModal, onClose]
  );

  // Handle incoming call (Callee Side)
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call from", from);
      setRemoteSocketId(from);

      // Set incoming call info to display accept/reject buttons
      setIncomingCall({ from, offer });
      onOpen(); // Open the modal to show accept/reject buttons
    },
    [onOpen]
  );

  // Handle receiving answer and setting the remote description on the caller side
  useEffect(() => {
    socket.on("call:accepted", async (answer) => {
      try {
        console.log("Caller: Call accepted, setting remote description");
        await peer.peer.setRemoteDescription(new RTCSessionDescription(answer));

        processQueuedIceCandidates(); // Process queued ICE candidates after setting the remote description
      } catch (error) {
        console.error("Caller: Error setting remote description", error);
      }
    });

    return () => {
      socket.off("call:accepted");
    };
  }, [socket]);

  // Function to toggle video (on/off)
  const toggleVideo = () => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0]; // Get the first video track
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled; // Toggle video track on/off
        console.log(`Video is now ${videoTrack.enabled ? "on" : "off"}`);
      }
    }
  };

  // Function to toggle audio (mute/unmute)
  const toggleAudio = () => {
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0]; // Get the first audio track
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled; // Toggle audio track on/off
        console.log(`Audio is now ${audioTrack.enabled ? "unmuted" : "muted"}`);
      }
    }
  };

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      if (remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
        remoteVideoRef.current.srcObject = null;
        console.log("Stopped previous remote video stream");
      }

      remoteVideoRef.current.srcObject = remoteStream;
      console.log("Attached new remote stream to video element");

      remoteVideoRef.current.onloadedmetadata = () => {
        setTimeout(() => {
          remoteVideoRef.current.play().catch((error) => {
            console.error("Error playing remote video:", error);
          });
        }, 100); // Delay playback by 100ms to avoid race conditions
      };
    }
  }, [remoteStream]);

  // Disconnect video call
  const disconnectCall = () => {
    console.log("Disconnecting the video call");

    // Stop all media tracks from myStream (local video/audio)
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      setMyStream(null);
    }

    // Stop the remote stream
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
      setRemoteStream(null);
    }

    // Close the peer connection
    if (peer.peer) {
      peer.peer.close();
      console.log("Peer connection closed");
    }

    // Reset the UI and close the video modal
    setCallAccepted(false);
    setOpenVideoModal(false);

    // Notify the server to end the call\
    socket.emit("call-ended", { to: remoteSocketId });
  };

  // Listen for user joining and call events
  useEffect(() => {
    socket.on("user:joined", ({ id }) => setRemoteSocketId(id)); // Set remoteSocketId when a user joins
    socket.on("incoming:call", handleIncomingCall); // Handle incoming call

    return () => {
      socket.off("user:joined");
      socket.off("incoming:call");
    };
  }, [handleIncomingCall, socket]);

  useEffect(() => {
    // Listen for the call-ended event to close the modal when the other peer ends the call
    socket.on("call-ended", () => {
      console.log("Call ended by the other peer");

      // Stop all media tracks from myStream (local video/audio)
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
        setMyStream(null);
      }

      // Stop the remote stream
      if (remoteStream && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
        remoteVideoRef.current.srcObject = null;
        setRemoteStream(null);
      }

      // Close the peer connection
      if (peer.peer) {
        peer.peer.close();
        console.log("Peer connection closed");
      }

      // Reset the UI and close the video modal
      setCallAccepted(false);
      setOpenVideoModal(false);
    });

    return () => {
      socket.off("call-ended"); // Cleanup event listener
    };
  }, [myStream, remoteStream]);


  return (
    <div>
      {!callAccepted && incomingCall && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalContent
            background="white"
            border="2px solid black"
            borderRadius="10px"
            padding="20px"
          >
            <ModalHeader>Incoming Video Call</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{remoteUser.name} is calling you...</Text>
              <Stack spacing={4} direction="row" justify="center" mt={4}>
                <Button
                  colorScheme="green"
                  onClick={() =>
                    handleAcceptCall(incomingCall.from, incomingCall.offer)
                  }
                >
                  Accept
                </Button>
                <Button colorScheme="red" onClick={onClose}>
                  Reject
                </Button>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Video Call Modal */}
      <IconButton
        isRound
        margin={2}
        aria-label="Start Video Call"
        size="lg"
        onClick={() => {
          handleCallUser();
          setOpenVideoModal(true);
        }}
        icon={<IoVideocamOutline />}
      />
      <Modal
        isOpen={openVideoModal}
        onClose={() => setOpenVideoModal(false)}
        isCentered
      >
        <ModalContent>
          <ModalHeader>Video Call with {remoteUser.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={2}>
              <GridItem>
                <Text>{remoteUser.name}'s Video</Text>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  muted={false} // Test if muting resolves the autoplay issue
                  style={{ width: "100%" }}
                />
              </GridItem>
              <GridItem>
                <Text>My Video</Text>
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted={false}
                  style={{ width: "100%" }}
                />
              </GridItem>
            </Grid>
          </ModalBody>
          {/* <ModalFooter
              d="flex"
              justifyContent={"center"}
              backgroundColor={"black"}
            > */}
          <ModalFooter>
            <IconButton
              margin={2}
              colorScheme="green"
              aria-label="Call Segun"
              size="lg"
              icon={<VscUnmute />}
              onClick={toggleAudio}
            />
            <IconButton
              margin={2}
              colorScheme="blue"
              aria-label="Call Segun"
              size="lg"
              icon={<IoVideocamOutline />}
              onClick={toggleVideo}
            />
            <IconButton
              margin={2}
              colorScheme="red"
              aria-label="Call Segun"
              size="lg"
              icon={<PhoneIcon />}
              onClick={disconnectCall}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SingleVideoCallModal;
