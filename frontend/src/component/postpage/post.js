import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Avatar,
  Box,
  Heading,
  IconButton,
  Text,
  Image,
  Button,
  Input,
  Stack,
} from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { BiLike, BiChat, BiShare, BiUserPlus, BiBookmarkAdd, BiBookmark } from "react-icons/bi";
import { useRecoilValue } from "recoil";
import { userState } from "../../App.js";

function removeNullsFromArray(array) {
  return array.filter((item) => item !== null).reverse();
}

function Post() {
  const [posts, setPosts] = useState([]); // State to hold posts
  const [error, setError] = useState(null); // State to handle errors
  const [openChatId, setOpenChatId] = useState(null); // State to track which post's chat is open
  const [newMessage, setNewMessage] = useState(""); // State to handle new message input
  const { token, email, updatedPost } = useRecoilValue(userState); // Destructure token and email from userState

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchData = async () => {
      if (!token || !email) {
        setError('No token or email found. Please log in first.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5005/usr/post/all', {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token for authorization
            'Content-Type': 'application/json',
            email: email, // Add email header if the backend requires it
          },
        });
        console.log(response.data.posts);
        setPosts(removeNullsFromArray(response.data.posts)); // Assuming response contains { posts: [...] }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please try again later.');
      }
    };

    fetchData();
  }, [updatedPost]); // Re-run fetchData when updatedPost changes

  const toggleChat = (postId) => {
    // Toggle the chat container for the specific post
    setOpenChatId(openChatId === postId ? null : postId);
    setNewMessage(""); // Reset new message input when toggling
  };

  const handleSendMessage = async (postId) => {
    if (!newMessage.trim()) return; // Do not send empty messages

    try {
      const time = new Date().toISOString(); // Example timestamp
      await axios.post(
        "http://localhost:5005/usr/message/send",
        { postId, time, message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            email: email,
          },
        }
      );

      setNewMessage(""); // Clear the input field after sending
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again later.");
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <Card key={post.id} maxW='md' mb={4}>
          <CardHeader>
            <Flex spacing='4'>
              <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                <Avatar name={post.author} src={post.authorAvatarUrl} />
                <Box>
                  <Heading size='sm'>{post.title}</Heading>
                  <Text>{post.role}</Text>
                </Box>
              </Flex>
              <IconButton
                variant='ghost'
                colorScheme='gray'
                aria-label='Delete post'
                icon={<BsTrash />}
                onClick={() => handleDelete(post.id)}
              />
            </Flex>
          </CardHeader>
          <CardBody>
            <Text>Description: {post.description}</Text>
            <Text>
              Capacity: {post.members.length} / {post.max_members}
            </Text>
            <Text>Join Requirements: {post.requirements}</Text>
          </CardBody>
          {post.imageUrl && <Image objectFit='cover' src={post.imageUrl} alt='Post Image' />}

          <CardFooter
            justify='space-between'
            flexWrap='wrap'
            sx={{
              '& > button': {
                minW: '136px',
              },
            }}
          >
            <Button flex="1" variant="ghost" leftIcon={<BiUserPlus />}>
              Join Group
            </Button>
            <Button
              flex="1"
              variant="ghost"
              leftIcon={<BiChat />}
              onClick={() => toggleChat(post.id)}
            >
              Chat
            </Button>
            <Button flex="1" variant="ghost" leftIcon={<BiBookmark />}>
              Bookmark
            </Button>
          </CardFooter>

          {openChatId === post.id && (
            <Box p={4} bg="gray.100">
              <Text>Group Chat:</Text>
              {post.messages && post.messages.map((message) => (
                <Box key={message.id} p={2} bg="white" my={2}>
                  <Text fontWeight="bold">{message.author}</Text>
                  <Text>{message.text}</Text>
                </Box>
              ))}
              <Stack direction="row" mt={4} align="center">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  flex="1"
                />
                <Button colorScheme="blue" onClick={() => handleSendMessage(post.id)}>
                  Send
                </Button>
              </Stack>
            </Box>
          )}
        </Card>
      ))}
    </div>
  );
}

export default Post;
