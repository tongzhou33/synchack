import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import {
  Box,
  IconButton,
  Input,
  VStack,
  Button,
  Text,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  ButtonGroup,
} from "@chakra-ui/react";
import styles from "./style/postpage.module.css"; // Import the CSS module
import Post from "./post.js"; // Import the Post component

function AddPost() {
    const initialFocusRef = React.useRef();
    return (
      <Popover
        initialFocusRef={initialFocusRef}
        placement="bottom"
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Button colorScheme="blue" style={{ borderRadius: "20px" }}>
            New Post
          </Button>
        </PopoverTrigger>
        <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
          <PopoverHeader pt={4} fontWeight="bold" border="0">
            Manage Your Channels
          </PopoverHeader>
          <PopoverArrow bg="blue.800" />
          <PopoverCloseButton />
          <PopoverBody>
            <VStack spacing={4} width="100%">
              {[
                "Component 1",
                "Component 2",
                "Component 3",
                "Component 4",
                "Component 5",
              ].map((label, index) => (
                <Box key={index} width="100%">
                  <Text fontWeight="bold" mb={1}>
                    {label}
                  </Text>
                  <Input size="sm" placeholder={label} />
                </Box>
              ))}
            </VStack>
          </PopoverBody>
          <PopoverFooter
            border="0"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            pb={4}
          >
            <Box fontSize="sm">Step 2 of 4</Box>
            <ButtonGroup size="sm">
              <Button colorScheme="green">Setup Email</Button>
              <Button colorScheme="blue" ref={initialFocusRef}>
                Next
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );
  }
  
  export default AddPost;