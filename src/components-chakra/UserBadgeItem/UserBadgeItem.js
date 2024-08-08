import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
      <Box
          px={2}
          py={1}
          bg="blue.400"
          borderRadius="lg"
          m={1}
          mb={2}
          variant="solid"
          fontSize="12px"
          bgColor="purple"
          color={"white"}
          cursor="pointer"
          display="flex"
          justifyContent="space-between"
          onClick={handleFunction}
      >
          {user.name}
          <CloseIcon pl={1} />
    </Box>
  )
}

export default UserBadgeItem
