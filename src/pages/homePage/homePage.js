import React, { useEffect, useState } from 'react'
import axios from 'axios';

const HomePage = () => {

  // const [chats, setChats] = useState([]);
  // const fetchChats = async () => {
  //   const {data} = await axios.get("/api/chat", {
  //     // proxy: {
  //     //   protocol: "http",
  //     //   host: "localhost",
  //     //   port: 8080,
  //     // },
  //   });
  //   setChats(data);
  //   console.log("fetching data: " + data);
  // }

  // useEffect(() => {
  //   fetchChats();
  //   console.log("fetching chats: " + chats);
  // }, []);

  return (
    <div> Home Page
      {/* {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))} */}
    </div>
  )
}

export default HomePage;
