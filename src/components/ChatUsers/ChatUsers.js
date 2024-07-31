import React from 'react'
import profilePic from "../../assets/Rudraveer.png";
import downArrow from "../../assets/downarrow.svg"
import './ChatUsers.css'

const ChatUsers = () => {
  return (
    <div className="userContainer">
      <div className="chatSectionName">
        <p>Chat</p>
      </div>
      <div className="avatarSection">
        <div className="avatar">
          <img src={profilePic} alt="profilePic" />
        </div>
        <div className="userName">
          <p>Rudraveer</p>
        </div>
        <div className="userStatus">
          <p>Available</p> <img src={downArrow} alt="downArrow" />
        </div>
      </div>
      <div className="userListSection">
        <div className="searchSection">
          <input type="text" placeholder="Search" />
        </div>
        <div className="lastChatSection">
          <p>Last Chats</p>
        </div>
        <div className="userListSection">
          <div className="users">
            <div className="user1">
              <div className="userPic">
                <img src={profilePic} alt="profilePic" />
              </div>
              <div className="userContainer">
                <div className="userName">
                  <p>Rudraveer</p>
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
            <div className="user1">
              <div className="userPic">
                <img src={profilePic} alt="profilePic" />
              </div>
              <div className="userContainer">
                <div className="userName">
                  <p>Rudraveer</p>
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
            <div className="user1">
              <div className="userPic">
                <img src={profilePic} alt="profilePic" />
              </div>
              <div className="userContainer">
                <div className="userName">
                  <p>Rudraveer</p>
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
            <div className="user1">
              <div className="userPic">
                <img src={profilePic} alt="profilePic" />
              </div>
              <div className="userContainer">
                <div className="userName">
                  <p>Rudraveer</p>
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
            <div className="user1">
              <div className="userPic">
                <img src={profilePic} alt="profilePic" />
              </div>
              <div className="userContainer">
                <div className="userName">
                  <p>Rudraveer</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatUsers
