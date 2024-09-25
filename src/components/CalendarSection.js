
import React, { useState } from 'react';
import { Box, VStack, Button, Input } from '@chakra-ui/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarSection = ({ theme }) => {
  const [value, setValue] = useState(new Date());
  const [meetingTitle, setMeetingTitle] = useState("");

  const handleDateChange = (date) => {
    setValue(date);
  };

  const scheduleMeeting = () => {
    alert(`Meeting '${meetingTitle}' scheduled on ${value.toDateString()}`);
    setMeetingTitle("");
  };

  return (
    <Box
      bg={theme.calendarBackground} // Apply calendar background from theme
      color={theme.chatTextColor} // Reuse chat text color
      p={4}
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing={5}>
        <Calendar value={value} onChange={handleDateChange} />

        {/* Input field to create a new meeting */}
        <Input
          placeholder="Enter meeting title..."
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
        />
        <Button
          colorScheme="blue"
          onClick={scheduleMeeting}
          isDisabled={!meetingTitle}
        >
          Schedule Meeting
        </Button>
      </VStack>
    </Box>
  );
};

export default CalendarSection;
