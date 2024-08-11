import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import Signup from '../../components-chakra/Authenticaltion/Signup';
import Login from '../../components-chakra/Authenticaltion/login';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../components-chakra/Context/ChatProvider';

const HomePage = () => {

  const navigate = useNavigate();

  const { user, fetchAgain, setFetchAgain } = ChatState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setFetchAgain(!fetchAgain);
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontSize={"4xl"} fontFamily={"Work sans"} color={"black"}>
          Chai-N-Chat
        </Text>
      </Box>
      <Box bg={"white"} w="100%" p={4} borderRadius={"lg"} color={"black"} borderWidth={"1px"}>
        <Tabs variant="soft-rounded" >
          <TabList mb="1em">
            <Tab w={"50%"}>Login</Tab>
            <Tab w={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
