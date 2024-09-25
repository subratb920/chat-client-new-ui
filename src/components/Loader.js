// src/components/Loader.js
import React from "react";
import { Spinner, Box } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" h="100%">
      <Spinner size="xl" color="teal.500" />
    </Box>
  );
};

export default Loader;
