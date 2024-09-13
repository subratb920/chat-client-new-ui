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

  // Setup ICE Candidate Exchange
  useEffect(() => {
    // peer.peer.onicecandidate = (event) => {
    //   if (event.candidate) {
    //     console.log("Sending ICE Candidate", event.candidate);
    //     socket.emit("ice-candidate", {
    //       candidate: event.candidate,
    //       to: remoteSocketId,
    //     });
    //   }
    // };

    peer.peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE Candidate", event.candidate);

        // Ensure remoteSocketId is correctly set
        if (remoteSocketId) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            userToCall: remoteSocketId,
          });
        } else {
          console.error("Error: remoteSocketId is not set.");
        }
      }
    };

    // socket.on("ice-candidate", async (iceCandidate) => {
    //   if (iceCandidate) {
    //     console.log("Received ICE Candidate from server: ", iceCandidate);
    //     try {
    //       // Log the full candidate object to verify structure
    //       console.log("iceCandidate object: ", iceCandidate);
    //       const rtcIcecandidate = new RTCIceCandidate({
    //         candidate: iceCandidate.candidate,
    //         sdpMid: iceCandidate.sdpMid,
    //         sdpMLineIndex: iceCandidate.sdpMLineIndex,
    //         usernameFragment: iceCandidate.usernameFragment
    //       });
    //       console.log("newIcecandidate: ", rtcIcecandidate);
    //       await peer.peer.addIceCandidate(rtcIcecandidate);
    //     } catch (error) {
    //       console.error("Error adding received ICE candidate:", error);
    //     }
    //   }
    // });

    // Temporary array to hold ICE candidates until remote description is set
    let iceCandidateQueue = [];

    // Function to handle ICE candidates when remote description is set
    const processIceCandidateQueue = async () => {
      for (let i = 0; i < iceCandidateQueue.length; i++) {
        try {
          console.log("Adding queued ICE candidate:", iceCandidateQueue[i]);
          await peer.peer.addIceCandidate(iceCandidateQueue[i]);
        } catch (error) {
          console.error("Error adding queued ICE candidate:", error);
        }
      }
      iceCandidateQueue = []; // Clear the queue after processing
    };

    // Handle incoming ICE candidates from the server
    socket.on("ice-candidate", async (iceCandidate) => {
      if (iceCandidate) {
        console.log("Received ICE Candidate from server:", iceCandidate);

        try {
          // Create the RTCIceCandidate from the received candidate data
          const rtcIceCandidate = new RTCIceCandidate({
            candidate: iceCandidate.candidate,
            sdpMid: iceCandidate.sdpMid,
            sdpMLineIndex: iceCandidate.sdpMLineIndex,
          });

          // Check if the remote description is set
          if (peer.peer.remoteDescription) {
            // Remote description is set, add the ICE candidate directly
            await peer.peer.addIceCandidate(rtcIceCandidate);
            console.log("ICE candidate added successfully");
          } else {
            // Remote description not set, queue the ICE candidate
            console.log("Remote description not set, queuing ICE candidate");
            iceCandidateQueue.push(rtcIceCandidate);
          }
        } catch (error) {
          console.error("Error handling received ICE candidate:", error);
        }
      }
    });

    // Set the remote description when an offer/answer is received
    socket.on("callaccepted", async (answer) => {
      try {
        console.log("Call accepted, setting remote description");
        await peer.peer.setRemoteDescription(new RTCSessionDescription(answer));

        // Process the queued ICE candidates after setting the remote description
        processIceCandidateQueue();
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    });

    // Add track for the remote peer stream
    peer.peer.ontrack = (event) => {
      console.log("Receiving remote stream");
      setRemoteStream(event.streams[0]);
    };

    return () => {
      socket.off("ice-candidate");
    };
  }, [remoteSocketId, socket]);

  // Handle calling a user
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    console.log("Local stream added", stream);

    if (myVideoRef.current) {
      myVideoRef.current.srcObject = stream;
    }

    stream.getTracks().forEach((track) => peer.peer.addTrack(track, stream));

    const offer = await peer.getOffer();
    console.log("Sending offer", offer);
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  // Handle receiving an incoming call
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      console.log("Incoming call from", from);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => peer.peer.addTrack(track, stream));

      const answer = await peer.getAnswer(offer);
      console.log("Sending answer", answer);
      socket.emit("call:accepted", { to: from, answer });
    },
    [socket]
  );

  // Handle call being accepted
  const handleCallAccepted = useCallback(({ answer }) => {
    console.log("Call accepted, setting remote description", answer);
    peer.setLocalDescription(answer);
  }, []);

  useEffect(() => {
    socket.on("user:joined", ({ id }) => setRemoteSocketId(id));
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);

    return () => {
      socket.off("user:joined");
      socket.off("incoming:call");
      socket.off("call:accepted");
    };
  }, [handleIncomingCall, handleCallAccepted, socket]);

  // Attach the remote stream to the video element
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log("Attached remote stream to video element");
    }
  }, [remoteStream]);

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
