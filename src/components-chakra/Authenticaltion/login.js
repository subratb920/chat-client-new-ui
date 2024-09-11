import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../Context/ChatProvider';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // This will pick up the API URL based on the environment
  timeout: 10000,
  headers: {
    "Content-type": "application/json",
  },
});
const Login = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [ShowP, setShowP] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { fetchAgain, setFetchAgain } = ChatState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const submitHandler = async () => {
        //   console.log(name, email, password);
        setLoading(true);

        if (!name || !email || !password) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await apiClient.post(
              "https://apichainchat.in/api/user/login",
              { email, password }
            );
            console.log("login data: /n", data);
            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
          setLoading(false);
          window.location.reload();
            navigate("/chats");
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl id="first-nameL">
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="emailL">
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="passwordL">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={ShowP ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShowP(!ShowP)}>
              {ShowP ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button  colorScheme="blue" w={"100%"} color={"white"} style={{ marginTop: 15 }} onClick={() => submitHandler(name, email, password)}>
        Login
      </Button>
          <Button variant={"solid"} colorScheme="red" w={"100%"} onClick={() => { 
              setName("Guest User");
              setEmail("guest@example.com");
              setPassword("123456");
          }}>
              Get Guest User Credentials 
      </Button>
    </VStack>
  );
}

export default Login;
