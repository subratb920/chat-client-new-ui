import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'

const Login = () => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [ShowP, setShowP] = useState(false);
    const [password, setPassword] = useState();

    const submitHandler = () => {
      console.log(name, email, password);
    };

  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl id="first-name">
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={ShowP ? "text" : "password"}
            placeholder="Enter Your Password"
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
        Sign Up
      </Button>
          <Button variant={"solid"} colorScheme="red" w={"100%"} onClick={() => { 
              setEmail("guest@example.com");
              setPassword("123456");
          }}>
              Get Guest User Credentials 
      </Button>
    </VStack>
  );
}

export default Login;
