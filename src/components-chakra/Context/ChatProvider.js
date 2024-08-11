import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [user, setUser] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    console.log(userInfo);
    console.log("user in context", user);
    // if (!userInfo) {
    //   navigate("/");
    // } else {
    //   navigate("/chats");
    // }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        fetchAgain,
        setFetchAgain
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;