import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  HStack,
  Avatar,
  IconButton,
  VStack,
  Badge,
  Text,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";

const SectionSidebar = ({ section, theme, isCollapsed, toggleSidebar }) => {
  const chatHistory = [
    {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=3",
      status: "online",
      lastAvailable: "Last seen 2 hours ago",
      unreadMessages: 3,
    },
    {
      name: "Robert Christopher Alexander Hamilton",
      avatar: "https://i.pravatar.cc/150?img=12",
      status: "offline",
      lastAvailable: "Last seen yesterday",
      unreadMessages: 0,
    },
    {
      name: "Charlie",
      avatar: "",
      status: "away",
      lastAvailable: "Last seen 30 minutes ago",
      unreadMessages: 5,
    },
  ];

  const [selectedUser, setSelectedUser] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [activePopupUser, setActivePopupUser] = useState(null); // Track the active popup user

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const togglePopup = (user) => {
    if (activePopupUser === user) {
      setActivePopupUser(null); // Close the popup if it's already open for the same user
    } else {
      setActivePopupUser(user); // Open popup for the clicked user
    }
  };

  const UserName = ({ name, isSelected }) => {
    const nameRef = useRef(null);
    const [isOverflow, setIsOverflow] = useState(false);

    useEffect(() => {
      if (nameRef.current) {
        setIsOverflow(
          nameRef.current.scrollWidth > nameRef.current.clientWidth
        );
      }
    }, [name]);

    return (
      <Box
        className={`user-name-wrapper ${isOverflow ? "scrollable" : ""}`}
        position="relative"
        overflow="hidden"
        maxW="150px" // Adjusted width to fit new layout
        fontWeight={isSelected ? "bold" : "normal"}
        color={isSelected ? "blue.500" : theme.sectionSidebarTextColor}
      >
        <Box ref={nameRef} className="user-name" whiteSpace="nowrap">
          {name}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      w={isCollapsed ? "80px" : "300px"}
      bg="gray.100"
      color="black"
      h="100vh"
      p="0"
      position="fixed"
      left="80px" // Make sure the sidebar remains properly positioned with the left sidebar
      top={0}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      transition="width 0.3s ease"
    >
      <VStack alignItems="flex-start" w="100%" spacing={2} pt={2}>
        {chatHistory.map((chat, index) => (
          <HStack
            key={index}
            spacing={2}
            w={isCollapsed ? "100%" : "90%"}
            px={3}
            py={2}
            bg={selectedUser === chat.name ? "gray.300" : "white"}
            borderRadius="10px"
            boxShadow="sm"
            _hover={{ bg: "gray.200", cursor: "pointer" }}
            onClick={() => handleSelectUser(chat.name)}
            onMouseEnter={() => setHoveredUser(chat.name)}
            onMouseLeave={() => setHoveredUser(null)}
            position="relative"
          >
            <Box position="relative">
              <Avatar
                size="md"
                src={chat.avatar || "https://via.placeholder.com/150"}
                name={chat.name}
              />
              <Box
                position="absolute"
                bottom="2px"
                right="2px"
                bg={
                  chat.status === "online"
                    ? "green.400"
                    : chat.status === "offline"
                    ? "gray.400"
                    : "yellow.400"
                }
                borderRadius="full"
                w="12px"
                h="12px"
                border="2px solid white"
              />
            </Box>
            {!isCollapsed && (
              <VStack align="start" spacing={1}>
                <UserName
                  name={chat.name}
                  isSelected={selectedUser === chat.name}
                />
                <Text fontSize="xs" color="gray.500">
                  {chat.lastAvailable}
                </Text>
              </VStack>
            )}

            {/* Unread messages badge */}
            {!isCollapsed && chat.unreadMessages > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                px={2}
                py={1}
                fontSize="0.8em"
                position="absolute"
                right="10px"
              >
                {chat.unreadMessages}
              </Badge>
            )}

            {/* Three dots icon and popup */}
            {hoveredUser === chat.name && (
              <IconButton
                icon={<BsThreeDotsVertical />}
                aria-label="Options"
                size="sm"
                variant="ghost"
                position="absolute"
                top="10px"
                right="10px"
                onClick={() => togglePopup(chat.name)} // Open popup only for the clicked user
              />
            )}

            {/* Popup for the active user */}
            {activePopupUser === chat.name && (
              <Box
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="white"
                boxShadow="lg"
                p={6}
                borderRadius="md"
                width="400px"
                height="300px"
                zIndex={1000}
              >
                <Text fontSize="lg" fontWeight="bold">
                  Chat Options for {chat.name}
                </Text>
                <Text fontSize="sm">
                  Add functionalities like view profile, send file, block user,
                  etc.
                </Text>

                {/* Close button for the popup */}
                <IconButton
                  icon={<CloseIcon />} // Close icon for the popup
                  aria-label="Close"
                  size="sm"
                  variant="ghost"
                  position="absolute"
                  top="10px"
                  right="10px"
                  onClick={() => setActivePopupUser(null)} // Close the popup
                />
              </Box>
            )}
          </HStack>
        ))}
      </VStack>

      {/* Sidebar collapse button */}
      <IconButton
        icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        aria-label="Toggle Sidebar"
        size="md"
        onClick={toggleSidebar} // Correctly toggles the sidebar
        bg="white"
        color="black"
        borderRadius="50%"
        border="1px solid rgba(0, 0, 0, 0.1)"
        position="absolute"
        top="50%"
        right="-20px"
        transform="translateY(-50%)"
      />
    </Box>
  );
};

export default SectionSidebar;
