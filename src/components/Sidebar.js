// src/components/Sidebar.js
import React from "react";
import {
  Box,
  VStack,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  HStack,
  Circle,
} from "@chakra-ui/react";
import {
  ChatIcon,
  PhoneIcon,
  AttachmentIcon,
  CalendarIcon,
} from "@chakra-ui/icons";
import { FaPalette } from "react-icons/fa";
import themes from "../themes"; // Import the themes

const Sidebar = ({ setSection, setTheme }) => {
  return (
    <Box
      w="80px" // Fixed width sidebar
      bg="gray.700"
      color="white"
      h="100vh"
      p="20px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <VStack spacing={8}>
        <IconButton
          icon={<ChatIcon />}
          aria-label="Chat"
          onClick={() => setSection("chat")}
          size="lg"
        />
        <IconButton
          icon={<PhoneIcon />}
          aria-label="Call"
          onClick={() => setSection("call")}
          size="lg"
        />
        <IconButton
          icon={<AttachmentIcon />}
          aria-label="Files"
          onClick={() => setSection("files")}
          size="lg"
        />
        <IconButton
          icon={<CalendarIcon />}
          aria-label="Calendar"
          onClick={() => setSection("calendar")}
          size="lg"
        />
      </VStack>

      {/* Theme Selector with Popover */}
      <Popover placement="top-start" closeOnBlur={true}>
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <IconButton
                icon={<FaPalette />}
                aria-label="Theme Selector"
                size="lg"
                variant="outline"
                colorScheme="teal"
                mt={8}
              />
            </PopoverTrigger>
            <PopoverContent w="auto" borderRadius="md" boxShadow="lg" p={2}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <HStack spacing={3}>
                  {Object.keys(themes).map((key) => (
                    <Circle
                      key={key}
                      size="40px"
                      bgGradient={themes[key].background}
                      cursor="pointer"
                      onClick={() => {
                        setTheme(key);
                        onClose();
                      }} // Set theme and close popover
                    />
                  ))}
                </HStack>
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </Box>
  );
};

export default Sidebar;
