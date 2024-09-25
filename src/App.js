// src/App.js
import React, { useState, useEffect } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import SectionSidebar from "./components/SectionSidebar";
import ChatSection from "./components/ChatSection";
import CallSection from "./components/CallSection";
import FileSection from "./components/FileSection";
import CalendarSection from "./components/CalendarSection";
import themes from "./themes"; // Import the themes

function App() {
  const [section, setSection] = useState("chat");
  const [theme, setTheme] = useState("pastel"); // Default to pastel theme
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Track the sidebar state

  useEffect(() => {
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed); // Toggle collapse state
  };

  const renderHeader = () => {
    switch (section) {
      case "chat":
        return "Chat";
      case "call":
        return "Calls";
      case "files":
        return "File Sharing";
      case "calendar":
        return "Calendar";
      default:
        return "";
    }
  };

  return (
    <Flex h="100vh">
      {/* Main Sidebar on the far left */}
      <Sidebar
        setSection={setSection}
        setTheme={setTheme}
        theme={themes[theme]}
      />

      {/* Section Sidebar for chat history */}
      <SectionSidebar
        section={section}
        theme={themes[theme]}
        isCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar} // Pass toggle function
      />

      {/* Main content section (chat, call, files, calendar) */}
      <Box
        flex={1}
        ml={sidebarCollapsed ? "80px" : "250px"} // Match SectionSidebar width when collapsed/expanded
        p="20px"
        bgGradient={themes[theme].background}
        borderRadius="lg"
        boxShadow="lg"
        transition="margin-left 0.3s ease"
      >
        <Heading size="lg" mb={6}>
          {renderHeader()}
        </Heading>
        {section === "chat" && (
          <ChatSection theme={themes[theme]} isCollapsed={sidebarCollapsed} />
        )}
        {section === "call" && <CallSection theme={themes[theme]} />}
        {section === "files" && <FileSection theme={themes[theme]} />}
        {section === "calendar" && <CalendarSection theme={themes[theme]} />}
      </Box>
    </Flex>
  );
}

export default App;
