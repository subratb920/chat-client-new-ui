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

  // Ensure ICE candidates are queued if remoteSocketId is not yet set
  useEffect(() => {
    peer.peer.onicecandidate = (event) => {
      if (event.candidate) {
        if (remoteSocketId) {
          console.log("Sending ICE candidate", event.candidate);
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            userToCall: remoteSocketId,
          });
        } else {
          console.log(
            "Queuing ICE candidate because remoteSocketId is not set"
          );
          iceCandidateQueue.push(event.candidate); // Queue ICE candidates if remoteSocketId is not available
        }
      }
    };
  }, [remoteSocketId, socket]);

  // Handle incoming ICE candidates from the server
  useEffect(() => {
    socket.on("ice-candidate", async (iceCandidate) => {
      if (iceCandidate) {
        console.log("Received ICE Candidate from server:", iceCandidate);
        try {
          const rtcIceCandidate = new RTCIceCandidate({
            candidate: iceCandidate.candidate,
            sdpMid: iceCandidate.sdpMid,
            sdpMLineIndex: iceCandidate.sdpMLineIndex,
          });

          if (peer.peer.remoteDescription) {
            await peer.peer.addIceCandidate(rtcIceCandidate);
            console.log("ICE candidate added successfully");
          } else {
            console.log("Remote description not set, queuing ICE candidate");
            iceCandidateQueue.push(rtcIceCandidate);
          }
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    });

    return () => {
      socket.off("ice-candidate");
    };
  }, [socket]);

  // Set the remote description when the call is accepted
  useEffect(() => {
    socket.on("call:accepted", async (answer) => {
      try {
        console.log("Caller: Call accepted, setting remote description");
        await peer.peer.setRemoteDescription(new RTCSessionDescription(answer));
        processQueuedIceCandidates(); // Process queued ICE candidates once the remote description is set
      } catch (error) {
        console.error("Caller: Error setting remote description", error);
      }
    });

    return () => {
      socket.off("call:accepted");
    };
  }, [socket]);

  // Attach remote stream to video element
  useEffect(() => {
    peer.peer.ontrack = (event) => {
      console.log("Receiving remote stream");
      setRemoteStream(event.streams[0], event.streams[0]);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  }, []);

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

    stream.getTracks().forEach((track) => peer.peer.addTrack(track, stream));

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

      // Automatically open the video modal
      setOpenVideoModal(true);
      console.log("Setting RemoteSocketId to 'from':", from);
      setRemoteSocketId(from);

      // Use stream value directly to avoid state async issues
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log("Stream object prepared:", stream);

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        console.log("Callee: Adding track", track);
        peer.peer.addTrack(track, stream);
      });

      // Set remote description (offer)
      console.log("Setting remote description to offer:", offer);
      await peer.peer.setRemoteDescription(new RTCSessionDescription(offer));

      // Process queued ICE candidates now that the remote description is set
      processQueuedIceCandidates();

      // Create an answer and send it to the caller
      console.log("Creating answer");
      const answer = await peer.peer.createAnswer();
      console.log("Answer created:", answer);
      await peer.peer.setLocalDescription(answer);
      socket.emit("call:accepted", { to: from, answer });
      console.log("Answer sent to caller", answer);
    },
    [socket]
  );

  // Attach the remote stream to the video element once it's received
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log("Attached remote stream to video element");
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
