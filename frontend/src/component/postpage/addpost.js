import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [max_members, setNoMembers] = useState("");
  const [requirements, setRequirements] = useState("");
  const toast = useToast();
  const initialFocusRef = React.useRef();

  const handleSubmit = async () => {
    // Prepare the data to send to the backend
    const postData = {
      title,
      description,
      location,
      date,
      requirements,
    };

    try {
      // Make an API call to the backend to create a new post
      const response = await axios.put(
        "http://localhost:5005/usr/post/create",
        postData,
        {
          headers: {
            postId: getRandomNumber,
            title: title,
            location: location,
            time: date,
            description: description,
            max_members: max_members,
            requirements: requirements,
          },
        }
      );

      // Display a success toast message
      toast({
        title: "Post created.",
        description: "Your new post has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      // Handle error and display an error toast message
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error creating post:", error);
    }
  };

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
          Create a New Post
        </PopoverHeader>
        <PopoverArrow bg="blue.800" />
        <PopoverCloseButton />
        <PopoverBody>
          <VStack spacing={4} width="100%">
            <Box width="100%">
              <Text fontWeight="bold" mb={1}>
                Title
              </Text>
              <Input
                size="sm"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>
            <Box width="100%">
              <Text fontWeight="bold" mb={1}>
                Description
              </Text>
              <Input
                size="sm"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
            <Box width="100%">
              <Text fontWeight="bold" mb={1}>
                Location
              </Text>
              <Input
                size="sm"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Box>
            <Box width="100%">
              <Text fontWeight="bold" mb={1}>
                Date
              </Text>
              <Input
                size="sm"
                placeholder="Enter date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Box>
            <Box width="100%">
              <Text fontWeight="bold" mb={1}>
                Requirements
              </Text>
              <Input
                size="sm"
                placeholder="Enter requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </Box>
          </VStack>
        </PopoverBody>
        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <ButtonGroup size="sm">
            <Button colorScheme="blue" onClick={handleSubmit}>
              Submit
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

export default AddPost;
