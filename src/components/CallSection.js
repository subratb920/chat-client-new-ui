
import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, IconButton, Icon, Button } from '@chakra-ui/react';
import { FaPhoneSlash, FaCheckCircle, FaClock, FaStopwatch, FaRecordVinyl } from 'react-icons/fa';

const CallSection = ({ theme }) => {
  const [callHistory, setCallHistory] = useState([
    {
      id: 1,
      user: "Alice",
      status: "completed",
      time: "10:00 AM",
      duration: "5 min",
      recorded: false,
    },
    {
      id: 2,
      user: "Bob",
      status: "missed",
      time: "11:00 AM",
      duration: "--",
      recorded: false,
    },
  ]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    let timer;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else if (!isCallActive && callDuration !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isCallActive, callDuration]);

  const handleEndCall = () => {
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    setCallHistory([
      ...callHistory,
      {
        id: callHistory.length + 1,
        user: "You",
        status: "completed",
        time: "Now",
        duration: `${minutes} min ${seconds} sec`,
        recorded: isRecording,
      },
    ]);
    setIsCallActive(false);
    setIsRecording(false);
    setCallDuration(0);
  };

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <Box
      bg={theme.callBackground} // Apply call background from theme
      color={theme.chatTextColor} // Reusing chat text color for consistency
      p={4}
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing={5}>
        {isCallActive ? (
          <HStack>
            <Icon as={FaStopwatch} />
            <Text>
              Call Duration: {Math.floor(callDuration / 60)} min{" "}
              {callDuration % 60} sec
            </Text>
            <IconButton
              icon={<FaPhoneSlash />}
              colorScheme="red"
              onClick={handleEndCall}
            />
            {isRecording ? (
              <Button colorScheme="red" onClick={handleStopRecording}>
                Stop Recording
              </Button>
            ) : (
              <Button colorScheme="green" onClick={handleStartRecording}>
                Start Recording
              </Button>
            )}
          </HStack>
        ) : (
          <Button colorScheme="green" onClick={handleStartCall}>
            Start Call
          </Button>
        )}

        {callHistory.map((call) => (
          <HStack
            key={call.id}
            spacing={4}
            w="100%"
            p={3}
            border="1px solid"
            borderRadius="md"
          >
            <Text fontWeight="bold">{call.user}</Text>
            <Text>{call.time}</Text>
            {call.status === "missed" && (
              <Icon as={FaPhoneSlash} color="red.500" />
            )}
            {call.status === "completed" && (
              <Icon as={FaCheckCircle} color="blue.500" />
            )}
            <HStack>
              <Icon as={FaClock} />
              <Text>{call.duration}</Text>
              {call.recorded && <Icon as={FaRecordVinyl} color="green.500" />}
            </HStack>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default CallSection;
