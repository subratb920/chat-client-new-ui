import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [ShowP, setShowP] = useState(false);
  const [ShowCP, setShowCP] = useState(false);
  const [pic, setPic] = useState();

  const postDetails = (pics) => {
    if (pics === undefined) {
      return;
    }
    console.log(pics);
  };

  const submitHandler = () => {
    console.log(name, email, password, confirmPassword, pic);
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
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={ShowCP ? "text" : "password"}
            placeholder="Confirm Your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShowCP(!ShowCP)}>
              {ShowCP ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        ></Input>
      </FormControl>
      <Button  colorScheme="blue" w={"100%"} color={"white"} style={{ marginTop: 15 }} onClick={() => submitHandler(name, email, password, confirmPassword, pic)}>
        Sign Up
      </Button>
    </VStack>
  );
}

export default Signup
