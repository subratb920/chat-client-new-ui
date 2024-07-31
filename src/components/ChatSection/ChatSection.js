import React from 'react'
import sendSVG from "../../assets/send.svg"
import './ChatSection.css'

const ChatSection = () => {
  return (
    <div className="chatContainer">
      <div className="chatSectionName">
        <p>Chatting with Rudraveer</p>
      </div>
      <div className="chatSectionContent">
        <div className="messages">
          <p>Message</p>
        </div>
        <div className="inputSection">
          <input type="text" placeholder="Type a message" />
          <div className="send">
            <img src={sendSVG} alt="send svg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSection
