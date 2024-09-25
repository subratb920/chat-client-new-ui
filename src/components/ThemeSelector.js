import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  HStack,
  Circle,
  IconButton,
} from "@chakra-ui/react";
import { FaPalette } from "react-icons/fa";

const ThemeSelector = ({ isOpen, onClose, setTheme }) => {
  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose} // Closes the popover
      placement="top-start"
      closeOnBlur={true} // Closes when clicking outside the popup
    >
      <PopoverTrigger>
        <IconButton
          icon={<FaPalette />}
          aria-label="Theme Selector"
          size="lg"
        />{" "}
        {/* Single button for the trigger */}
      </PopoverTrigger>
      <PopoverContent w="auto" borderRadius="md" boxShadow="lg" p={2}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <HStack spacing={3}>
            <Circle
              size="40px"
              bgGradient="linear(to-r, #fdfbfb, #ebedee)"
              cursor="pointer"
              onClick={() => setTheme("pastel")}
            />
            <Circle
              size="40px"
              bgGradient="linear(to-r, #fceabb, #f8b500)"
              cursor="pointer"
              onClick={() => setTheme("warm")}
            />
            <Circle
              size="40px"
              bgGradient="linear(to-r, #a8e6cf, #dcedc1)"
              cursor="pointer"
              onClick={() => setTheme("mintGreen")}
            />
            <Circle
              size="40px"
              bgGradient="linear(to-r, #d3d3d3, #ececec)"
              cursor="pointer"
              onClick={() => setTheme("coolGray")}
            />
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSelector;
