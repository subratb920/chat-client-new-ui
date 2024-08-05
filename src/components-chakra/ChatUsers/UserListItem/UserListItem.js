import React from 'react'
import profilePic from "../../../assets/Rudraveer.png";
import "./UserListItem.css";

const UserListItem = ({user, accessChat}) => {
  return (
    <div className="user1">
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
}

export default UserListItem
