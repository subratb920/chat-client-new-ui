import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import imageCompression from "browser-image-compression";
import CryptoJS from "crypto-js";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [ShowP, setShowP] = useState(false);
  const [ShowCP, setShowCP] = useState(false);
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // This will pick up the API URL based on the environment
    timeout: 10000,
    headers: {
      "Content-type": "application/json",
    },
  });
  const toast = useToast();
  const navigate = useNavigate();

  const postDetails = async (pics) => {
    setLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      
      // Compression options
      // const options = {
      //   maxSizeMB: 1, // Maximum size in MB
      //   maxWidthOrHeight: 1920, // Max width or height in pixels
      //   useWebWorker: true, // Use multi-threading for better performance
      // };

      const formData = new FormData();
      // formData.append("image", pics);
      try {
      //   const compressedFile = await imageCompression(pics, options);
      //   console.log("Original File Size:", (pics.size / 1024).toFixed(2), "KB");
      //   console.log(
      //     "Compressed File Size:",
      //     (compressedFile.size / 1024).toFixed(2),
      //     "KB"
      //   );

        // Read the compressed file as ArrayBuffer
        // const arrayBuffer = await compressedFile.arrayBuffer();

        // Convert ArrayBuffer to WordArray (required by CryptoJS)
        // const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

        // Define your encryption key (ensure it's stored securely)
        // const encryptionKey = "your-encryption-secret-key"; // Replace with a secure key

        // Encrypt the WordArray using AES
        // const encrypted = CryptoJS.AES.encrypt(
        //   wordArray,
        //   encryptionKey
        // ).toString();

        // Create a Blob from the encrypted data
        // const encryptedBlob = new Blob([encrypted], { type: pics.type });

        // formData.append("image", encryptedBlob, compressedFile.name);
        formData.append("image",pics, pics.name);

        // Log the FormData contents
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const config = {
          headers: {
            "Content-type": "multipart/form-data",
          },
        };
        const URL = process.env.REACT_APP_API_URL + "/api/image-url";
          // Log the axios request config
          console.log("Axios Request Config:", {
            url: URL + "/api/image-url",
            method: "post",
            data: formData,
            ...config,
          });
        
        const { data } = await axios.post(
          URL,
          formData,
          config
        );
        console.log("Image uploaded succesfully: ", data.imageUrl);
        toast({
          title: "Image uploaded succesfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setPic(data.imageUrl);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error uploading Image",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      }
    } else {
    toast({
      title: "Please Select an Image",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    })
    setLoading(false);
  }
  };

  const submitHandler = async () => {
    // console.log(name, email, password, confirmPassword, pic);
    setLoading(true);
    if(!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    } else if(password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await apiClient.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        }
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/");
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
      <FormControl id="first-nameS">
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="emailS">
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="passwordS">
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
      <FormControl id="confirmPassword">
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

export default Signup;
