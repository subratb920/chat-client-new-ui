import React, { useEffect, useState } from "react";
import Menubar from "../../components-chakra/Menubar/Menubar";
import ChatUsers from "../../components-chakra/ChatUsers/ChatUsers";
import ChatSection from "../../components-chakra/ChatSection/ChatSection";
import FilesContent from "../../components-chakra/FilesContent/FilesContent";
import "./chatPage.css";
import { useNavigate } from "react-router";
import { ChatState } from "../../components-chakra/Context/ChatProvider";

const ChatPage = () => {
  // const [ fetchAgain, setFetchAgain ] = useState(false);
  const { user, fetchAgain, setFetchAgain } = ChatState();
  const navigate = useNavigate();

  // console.log(user);

  // if (!user) {
  //   navigate("/");
  // }

  useEffect(
    () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        navigate("/");
      }
    },
    [fetchAgain],
    [navigate]
  );

  return (
    <div className="chatPage">
      <Menubar></Menubar>
      {user && (
        <ChatUsers
          // fetchAgain={fetchAgain}
          // setFetchAgain={setFetchAgain}
        ></ChatUsers>
      )}
      {user && (
        <ChatSection
          // fetchAgain={fetchAgain}
          // setFetchAgain={setFetchAgain}
        ></ChatSection>
      )}
      <FilesContent></FilesContent>
    </div>
  );
};

export default ChatPage;
