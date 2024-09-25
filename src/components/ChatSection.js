
import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, Text, VStack, HStack, Input, Button, Avatar, Spinner, useColorMode } from '@chakra-ui/react';
import Picker from "emoji-picker-react";

// Placeholder for API call to load chat history and contacts
const loadChatHistory = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, user: 'Alice', content: 'Hello there!', timestamp: '10:00 AM' },
                { id: 2, user: 'Bob', content: 'Hi, Alice! How are you?', timestamp: '10:02 AM' },
                { id: 3, user: 'Alice', content: 'I’m doing great! What about you?', timestamp: '10:05 AM' },
            ]);
        }, 1000);
    });
};

const loadContacts = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'Alice', avatar: 'https://example.com/alice.jpg' },
                { id: 2, name: 'Bob', avatar: 'https://example.com/bob.jpg' },
                { id: 3, name: 'Charlie', avatar: 'https://example.com/charlie.jpg' },
            ]);
        }, 1000);
    });
};

const ChatSection = ({ theme, isCollapsed }) => {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState(""); // Message input state
  const [file, setFile] = useState(null); // File state

  // Emoji picker toggling and close on click outside
  const emojiPickerRef = useRef(null);

  // Emoji picker toggling function
  const onEmojiClick = (event, emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Append emoji to message
    setShowEmojiPicker(false); // Close the emoji picker after selecting an emoji
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); // Set file in state
      // Add file message to chat
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
      setContacts(contactList);
      setIsLoading(false);
    };
    fetchChatData();
  }, []);

  // Handle sending a message
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
      setFile(null); // Reset file after sending
    }
  };

  // Event listener to close the emoji picker if clicked outside
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
    <Flex flex={1} p="20px" h="90vh">
      <Box
        flexGrow={1}
        w={isCollapsed ? "100px" : "80px"}
        height="80vh"
        // ml="80px"
        p="4"
        bgGradient={
          colorMode === "light"
            ? "linear(to-r, white, lightgray, lightblue)"
            : "linear(to-r, teal.500, blue.500)"
        }
        borderRadius="lg"
        boxShadow="lg"
        overflowY="auto"
        color={colorMode === "light" ? "black" : "white"}
      >
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
          <VStack align="start" flexGrow={1} overflowY="auto" spacing={3}>
            {messages.map((msg) => (
              <HStack
                key={msg.id}
                align="start"
                w="100%"
                spacing={3}
                bg={
                  colorMode === "light"
                    ? "whiteAlpha.700"
                    : "rgba(255, 255, 255, 0.1)"
                }
                p={3}
                borderRadius="lg"
                backdropFilter="blur(10px)"
              >
                <Avatar name={msg.user} />
                <Box>
                  <HStack>
                    <Text fontWeight="bold">{msg.user}</Text>
                    <Text
                      fontSize="xs"
                      color={colorMode === "light" ? "gray.500" : "gray.300"}
                    >
                      {msg.timestamp}
                    </Text>
                  </HStack>
                  <Text>{msg.content}</Text>
                </Box>
              </HStack>
            ))}
          </VStack>
        )}

        {/* Input area */}
        <HStack spacing={4} mt={4} position="sticky" bottom="0">
          <div className="input-container"></div>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            pl="80px" /* Add padding to prevent text overlap with buttons */
            // borderRadius="full"
            bg={colorMode === "light" ? "white" : "gray.700"}
            _focus={{ borderColor: "blue.500" }}
          />

          {/* Emoji Picker Button */}
          <Button
            variant="ghost"
            position="absolute"
            left="10px"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </Button>
          {showEmojiPicker && (
            <Box position="absolute" bottom="60px" ref={emojiPickerRef}>
              <Picker onEmojiClick={onEmojiClick} />
            </Box>
          )}

          {/* File Upload */}
          <input
            type="file"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="upload-button">
            📎
          </label>

          <Button colorScheme="blue" onClick={handleSendMessage}>
            Send
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};

export default ChatSection;
