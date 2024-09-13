import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { IoVideocamOutline } from "react-icons/io5";
import { useSocket } from "../Context/SocketProvider";
import peer from "../../peer";

const SingleVideoCallModal = ({
  openVideoModal,
  setOpenVideoModal, // Modal visibility handler
  remoteUser,
}) => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
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

  // Monitor WebRTC connection state and handle media tracks
  useEffect(() => {
    // Monitor connection state
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

    // Handle ICE candidates
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

    // Handle receiving remote stream
    peer.peer.ontrack = (event) => {
      console.log("Receiving remote stream:", event.streams[0]);

      setRemoteStream(event.streams[0]);

      //   if (remoteVideoRef.current) {
      //     remoteVideoRef.current.srcObject = event.streams[0];
      //     console.log("Attached remote stream to video element");

      //     // Explicitly start playing the video if it's not playing
      //     remoteVideoRef.current.play().catch((error) => {
      //       console.error("Error playing remote video:", error);
      //     });
      //   }
      // };
    
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
      // Cleanup event listeners when the component unmounts
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

    // Use stream value directly to avoid state async issues
    console.log("Stream object prepared:", stream);

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

  // Handle incoming call (Callee Side)
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call from", from);
      if (!from) {
        console.error("Error: 'from' is null or undefined.");
        return;
      }

      // Automatically open the video modal when receiving a call
      setOpenVideoModal(true); // Ensure the modal opens immediately
      console.log("Setting RemoteSocketId to 'from':", from);
      setRemoteSocketId(from); // Set remote socket ID to the caller's ID

      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      // Add callee's media tracks to the WebRTC peer connection
      stream.getTracks().forEach((track) => {
        console.log("Callee: Adding track", track);
        peer.peer.addTrack(track, stream); // Add callee's media tracks
      });

      // Set the remote description (offer)
      console.log("Setting remote description to offer:", offer);
      await peer.peer.setRemoteDescription(new RTCSessionDescription(offer));

      // Process queued ICE candidates now that the remote description is set
      processQueuedIceCandidates();

      // Create an answer and send it to the caller
      console.log("Creating answer");
      const answer = await peer.peer.createAnswer();
      console.log("Answer created:", answer);
      await peer.peer.setLocalDescription(answer);
      socket.emit("answercall", { to: from, signal: answer }); // Send 'answercall'
      console.log("Answer sent to caller", answer);
    },
    [socket]
  );

  // Handle receiving answer and setting the remote description on the caller side
  useEffect(() => {
    socket.on("call:accepted", async (answer) => {
      try {
        console.log("Caller: Call accepted, setting remote description");
        await peer.peer.setRemoteDescription(new RTCSessionDescription(answer));

        // Process queued ICE candidates after setting the remote description
        processQueuedIceCandidates();
      } catch (error) {
        console.error("Caller: Error setting remote description", error);
      }
    });

    return () => {
      socket.off("call:accepted");
    };
  }, [socket]);

  // Attach the remote stream to the video element once it's received
  // useEffect(() => {
  //   if (remoteStream && remoteVideoRef.current) {
  //     remoteVideoRef.current.srcObject = remoteStream;
  //     console.log("Attached remote stream to video element");
  //   }
  // }, [remoteStream]);

  useEffect(() => {
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
  }, [remoteStream]);



  // Listen for user joining and call events
  useEffect(() => {
    socket.on("user:joined", ({ id }) => setRemoteSocketId(id)); // Set remoteSocketId when a user joins
    socket.on("incoming:call", handleIncomingCall); // Handle incoming call

    return () => {
      socket.off("user:joined");
      socket.off("incoming:call");
    };
  }, [handleIncomingCall, socket]);

  return (
    <div>
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
                <Text>My Video</Text>
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted
                  style={{ width: "100%" }}
                />
              </GridItem>
              <GridItem>
                <Text>{remoteUser.name}'s Video</Text>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  muted={true} // Test if muting resolves the autoplay issue
                  style={{ width: "100%" }}
                />
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <IconButton
              colorScheme="red"
              aria-label="End Call"
              size="lg"
              icon={<IoVideocamOutline />}
              onClick={() => setOpenVideoModal(false)}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SingleVideoCallModal;
