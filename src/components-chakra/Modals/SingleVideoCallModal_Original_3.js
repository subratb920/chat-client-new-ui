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
  setOpenVideoModal,
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

  // Function to process queued ICE candidates
  const processIceCandidateQueue = async () => {
    for (let i = 0; i < iceCandidateQueue.length; i++) {
      try {
        console.log("Adding queued ICE candidate:", iceCandidateQueue[i]);
        await peer.peer.addIceCandidate(iceCandidateQueue[i]);
      } catch (error) {
        console.error("Error adding queued ICE candidate:", error);
      }
    }
    iceCandidateQueue = []; // Clear queue after processing
  };

  // Setup ICE Candidate Exchange and Event Listeners
  useEffect(() => {
    peer.peer.onicecandidate = (event) => {
      if (event.candidate && remoteSocketId) {
        console.log("Sending ICE Candidate", event.candidate);
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          userToCall: remoteSocketId,
        });
      } else {
        console.error(
          "Error: remoteSocketId is not set when sending ICE candidate."
        );
      }
    };

    // Handle incoming ICE candidates from the server
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

    // Set the remote description when the call is accepted
    socket.on("call:accepted", async (answer) => {
      try {
        console.log("Call accepted, setting remote description");
        await peer.peer.setRemoteDescription(new RTCSessionDescription(answer));
        processIceCandidateQueue(); // Process queued ICE candidates
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    });

    // Attach remote stream to video element
    peer.peer.ontrack = (event) => {
      console.log("Receiving remote stream");
      setRemoteStream(event.streams[0]);
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return () => {
      socket.off("ice-candidate");
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

    stream.getTracks().forEach((track) => peer.peer.addTrack(track, stream));

    const offer = await peer.getOffer();
    console.log("Sending offer", offer);

    // Ensure remoteSocketId is set before emitting the call
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
      console.log("Setting RemoteSocketId to 'from': ", from);
      setRemoteSocketId(from); // Set remote socket ID to caller's ID
      console.log("RemoteSocketId is set to: ", remoteSocketId);
      
      console.log("Preparing stream object...");
      const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        console.log("MyStream object prepared: ", myStream);
        console.log("MyVideoRef: ", myVideoRef);
        console.log("MyVideoRef.current: ", myVideoRef.current);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => peer.peer.addTrack(track, stream));

      // Set remote description (offer)
      console.log("Setting remote description to offer: ", offer);
      await peer.peer.setRemoteDescription(new RTCSessionDescription(offer));

      // Create an answer and send it to the caller
      console.log("Creating answer");
      const answer = await peer.peer.createAnswer();
      console.log("Answer created", answer);
      console.log("Setting local description");
      await peer.peer.setLocalDescription(answer);
      console.log("Local description set");
      console.log("Sending answer bt emiting call:accepted", answer);
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
