
import React, { useState } from 'react';
import { Box, VStack, Input, Button, Text, HStack, Avatar, Progress } from '@chakra-ui/react';
import { FaFilePdf, FaImage, FaFileAlt, FaTrash, FaDownload } from 'react-icons/fa';

const FileSection = ({ theme }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleFileUpload = () => {
    if (selectedFiles.length > 0) {
      const uploadPromises = selectedFiles.map((file) => {
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            setUploadProgress((prev) => {
              const progress = prev + 20;
              if (progress >= 100) {
                clearInterval(interval);
                resolve();
              }
              return progress;
            });
          }, 500);
        }).then(() => {
          const newFile = {
            name: file.name,
            type: file.type.includes("image")
              ? "image"
              : file.type.includes("pdf")
              ? "pdf"
              : "doc",
            size: (file.size / 1024).toFixed(2), // Convert to KB
            date: new Date().toLocaleDateString(),
            url: URL.createObjectURL(file), // Simulate file download URL
          };
          setFileList((prevList) => [...prevList, newFile]);
        });
      });

      Promise.all(uploadPromises).then(() => {
        setSelectedFiles([]);
        setUploadProgress(0);
      });
    }
  };

  const handleRemoveFile = (index) => {
    const updatedList = [...fileList];
    updatedList.splice(index, 1);
    setFileList(updatedList);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
    setIsDragging(false);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Box
      bg={theme.chatBackground} // Reuse chat background from theme
      color={theme.chatTextColor} // Reuse chat text color
      p={4}
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing={5} w="100%" maxW="500px">
        <Input type="file" multiple onChange={handleFileChange} />
        <Box
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          h="150px"
          w="100%"
          border="2px dashed"
          borderColor={isDragging ? "blue.500" : "gray.300"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={isDragging ? "blue.50" : "white"}
        >
          <Text>
            {isDragging
              ? "Drop files here"
              : "Drag and drop files here or click to upload"}
          </Text>
        </Box>

        {selectedFiles.length > 0 && (
          <>
            <Text>Selected Files:</Text>
            {selectedFiles.map((file, index) => (
              <Text key={index}>{file.name}</Text>
            ))}
            <Button colorScheme="blue" onClick={handleFileUpload}>
              Upload Files
            </Button>
            {uploadProgress > 0 && (
              <Progress value={uploadProgress} size="sm" w="100%" />
            )}
          </>
        )}

        {/* File list with avatars and details */}
        <VStack align="start" spacing={4} w="100%">
          {fileList.map((file, index) => (
            <HStack
              key={index}
              w="100%"
              p={3}
              border="1px solid"
              borderRadius="md"
            >
              <Avatar
                src={
                  file.type === "image"
                    ? "image_url"
                    : file.type === "pdf"
                    ? "pdf_icon_url"
                    : "doc_icon_url"
                }
              />
              <Box>
                <Text fontWeight="bold">{file.name}</Text>
                <Text>Size: {file.size} KB</Text>
                <Text>Uploaded on: {file.date}</Text>
              </Box>
              <HStack spacing={3}>
                <FaDownload
                  color="blue"
                  onClick={() => window.open(file.url)}
                  cursor="pointer"
                />
                <FaTrash
                  color="red"
                  onClick={() => handleRemoveFile(index)}
                  cursor="pointer"
                />
              </HStack>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default FileSection;
