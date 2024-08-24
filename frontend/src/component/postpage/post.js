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

function Post() {
  const [posts, setPosts] = useState([]); // State to hold posts
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5005/usr/post/all", {
          headers: {
            Authorization: "Bearer YOUR_TOKEN_HERE", // Replace with the actual token or use state to manage it
            "Content-Type": "application/json",
          },
        });
        setPosts(response.data.posts); // Assuming response contains { posts: [...] }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message); // Set the error message in case of failure
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once when component mounts

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
