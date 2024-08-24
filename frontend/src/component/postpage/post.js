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
} from '@chakra-ui/react';
import { BsTrash } from 'react-icons/bs';
import { BiLike, BiChat, BiShare } from 'react-icons/bi';
import { useRecoilValue } from 'recoil';
import { userState } from '../../App.js';

function removeNullsFromArray(array) {
  return array.filter((item) => item !== null).reverse();
}

function Post() {
  const [posts, setPosts] = useState([]); // State to hold posts
  const [error, setError] = useState(null); // State to handle errors
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
  }, [updatedPost, posts]); // Re-run fetchData when token or email changes

  const handleDelete = async (postId) => {
    try {
      await axios.delete('http://localhost:5005/usr/post/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          email: email,
        },
        data: {
          postId: postId, // Send the postId to be deleted
        },
      });
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete the post. Please try again later.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>; // Display an error message if there's an error
  }

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
            <Button flex='1' variant='ghost' leftIcon={<BiLike />}>
              Like
            </Button>
            <Button flex='1' variant='ghost' leftIcon={<BiChat />}>
              Comment
            </Button>
            <Button flex='1' variant='ghost' leftIcon={<BiShare />}>
              Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default Post;
