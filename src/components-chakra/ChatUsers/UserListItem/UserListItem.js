import React, { useEffect, useState } from 'react'
import profilePic from "../../../assets/Rudraveer.png";
import "./UserListItem.css";
import { ChatState } from '../../Context/ChatProvider';
import { getSender } from '../../../config/ChatLogic';

const UserListItem = ({ user, handleFunction }) => {

  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat } = ChatState();
  console.log("user: ", user);
  console.log("selectedChat: ", selectedChat);
  
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    console.log("loggedUser: ", loggedUser);
  }, []);
  

  return (
    <div
      className="user1"
      onClick={handleFunction}
    >
      {console.log("user inside userListItem: ", user)}
      <div className="userPic">
        <img src={profilePic} alt="profilePic" />
      </div>
      <div className="userContainer">
        <div className="userName">
          <p>{user?.name}</p>
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
    </div>
  );
};

export default UserListItem
