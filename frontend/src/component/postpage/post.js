import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike, BiChat, BiShare } from "react-icons/bi";
import { useRecoilValue } from "recoil";
import { userState } from "../../App.js";

function Post() {
  const [posts, setPosts] = useState([]); // State to hold posts
  const [error, setError] = useState(null); // State to handle errors
  const { token, email } = useRecoilValue(userState); // Destructure token and email from userState
  
  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchData = async () => {
      if (!token || !email) {
        setError("No token or email found. Please log in first.");
        return;
      }
      console.log(email);
      console.log(token);

      try {
        const response = await axios.get("http://localhost:5005/usr/post/all", {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token for authorization
            "Content-Type": "application/json",
            email: email, // Add email header if the backend requires it
          },
        });
        setPosts(response.data.posts); // Assuming response contains { posts: [...] }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please try again later.");
      }
    };

    fetchData();
  }, [token, email]); // Re-run fetchData when token or email changes

  if (error) {
    return <div>Error: {error}</div>; // Display an error message if there's an error
  }

  return (
    <div>
      {posts.map((post) => (
        <Card key={post.id} maxW="md" mb={4}>
          <CardHeader>
            <Flex spacing="4">
              <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                <Avatar name={post.author} src={post.authorAvatarUrl} />
                <Box>
                  <Heading size="sm">{post.author}</Heading>
                  <Text>{post.role}</Text>
                </Box>
              </Flex>
              <IconButton
                variant="ghost"
                colorScheme="gray"
                aria-label="See menu"
                icon={<BsThreeDotsVertical />}
              />
            </Flex>
          </CardHeader>
          <CardBody>
            <Text>{post.content}</Text>
          </CardBody>
          {post.imageUrl && (
            <Image objectFit="cover" src={post.imageUrl} alt="Post Image" />
          )}

          <CardFooter
            justify="space-between"
            flexWrap="wrap"
            sx={{
              "& > button": {
                minW: "136px",
              },
            }}
          >
            <Button flex="1" variant="ghost" leftIcon={<BiLike />}>
              Like
            </Button>
            <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
              Comment
            </Button>
            <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
              Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default Post;
