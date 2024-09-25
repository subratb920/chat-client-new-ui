import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Input,
  Button,
  Avatar,
  Spinner,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Picker from "emoji-picker-react";

// Placeholder for API call to load chat history and contacts
const loadChatHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          user: "Alice",
          content: "Hello there!",
          timestamp: "10:00 AM",
        },
        {
          id: 2,
          user: "Bob",
          content: "Hi, Alice! How are you?",
          timestamp: "10:02 AM",
        },
        {
          id: 3,
          user: "Alice",
          content: "I’m doing great! What about you?",
          timestamp: "10:05 AM",
        },
      ]);
    }, 1000);
  });
};

const loadContacts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Alice", avatar: "https://example.com/alice.jpg" },
        { id: 2, name: "Bob", avatar: "https://example.com/bob.jpg" },
        { id: 3, name: "Charlie", avatar: "https://example.com/charlie.jpg" },
      ]);
    }, 1000);
  });
};

const ChatSection = ({ isCollapsed }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);

  const emojiPickerRef = useRef(null);

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setMessages([
        ...messages,
        {
          type: "file",
          content: URL.createObjectURL(uploadedFile),
          fileName: uploadedFile.name,
        },
      ]);
    }
  };

  const { colorMode } = useColorMode();

  useEffect(() => {
    const fetchChatData = async () => {
      const history = await loadChatHistory();
      const contactList = await loadContacts();
      setMessages(history);
      setIsLoading(false);
    };
    fetchChatData();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "You",
          content: newMessage,
          timestamp: "10:10 AM",
        },
      ]);
      setNewMessage("");
    }
    if (file) {
      setFile(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  return (
    <Flex direction="row" h="100vh" w="100vw" overflow="hidden">
      {" "}
      {/* Reset layout completely */}
      {/* Sidebar */}
      <Box
        w={isCollapsed ? "100px" : "300px"}
        h="100%"
        bg="gray.800"
        position="relative" /* Avoid sticky for now to isolate layout */
      >
        {/* Sidebar content */}
      </Box>
      {/* Chat Section */}
      <Flex
        direction="column"
        flexGrow={1} /* Chat section fills remaining space */
        bg="white"
        overflow="auto"
        minW={0} /* Prevent flex-grow overflow */
      >
        <Box flexGrow={1} overflowY="auto" p="4">
          {isLoading ? (
            <Box
              flex={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Spinner size="xl" />
            </Box>
          ) : (
            <VStack spacing={4} align="start">
              {messages.map((msg) => (
                <HStack
                  key={msg.id}
                  w="100%"
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                >
                  <Avatar name={msg.user} />
                  <Box>
                    <Text fontWeight="bold">{msg.user}</Text>
                    <Text>{msg.content}</Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>

        {/* Input Section */}
        <HStack
          p={4}
          bg="gray.200"
          w="100%"
          h="80px"
          align="center"
          justify="space-between"
        >
          <Button
            variant="ghost"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </Button>
          {showEmojiPicker && (
            <Box position="absolute" bottom="60px" ref={emojiPickerRef}>
              <Picker onEmojiClick={onEmojiClick} />
            </Box>
          )}

          <Button as="label" variant="ghost">
            📎
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </Button>

          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            flexGrow={1}
          />

          <Button colorScheme="blue" onClick={handleSendMessage}>
            Send
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default ChatSection;
