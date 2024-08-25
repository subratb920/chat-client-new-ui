import React, { createContext, useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { ChatState } from "./ChatProvider";

const SocketContext = createContext();

// const ENDPOINT = "http://localhost:8080";
const ENDPOINT = "http://65.0.98.86";
const socket = io(ENDPOINT);

const SocketProvider = ({ children }) => {

    const {user} = ChatState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");

    const myVideo = useRef();
    const userVideo = useRef();
    const connectioRef = useRef();


     useEffect(() => {
       setSocketConnected(io(ENDPOINT));
       socket.emit("setup", user);
       socket.on("connected", () => {
         setSocketConnected(true);
       });
     }, []);
    
    useEffect(() => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          console.log("useEffect stream: ", currentStream);
          myVideo.current.srcObject = currentStream;
        });

      socket.on("me", (id) => {
        setMe(id);
      });
      socket.on("callUser", ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      });
    }, []);
    
    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on("signal", (data) => {
            socket.emit("answerCall answerCall", {
              signal: data,
              to: call.from,
            });
        })
        peer.on("stream", (currentStream) => {
            console.log("stream: ", currentStream);
            userVideo.current.srcObject = currentStream;
        })
        peer.signal(call.signal);

        connectioRef.current = peer;
    };
    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: call.from,
                signalData: data,
                from: me,
                name: call.name
            })
        })
        peer.on("stream", (currentStream) => {
            console.log("callUser stream: ", currentStream);
            userVideo.current.srcObject = currentStream;
        })
        socket.on("callaccepted", (signal) => {
          setCallAccepted(true);
          peer.signal(signal);
        });
        connectioRef.current = peer;
    };
    const leaveCall = () => {
        setCallEnded(true);
        connectioRef.current.destroy();
        // connectioRef.current = null;
        window.location.reload();
    };

    return (
        <SocketContext.Provider value={{
            socket,
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall,
            connectioRef
        }}>
            {children}
        </SocketContext.Provider>
    )
}

// export { SocketContext, SocketProvider }