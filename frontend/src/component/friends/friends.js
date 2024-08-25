import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Input, Button, useToast, FormControl, FormLabel, List, ListItem, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { userState } from "../../App.js";
import styles from "./styles/friends.module.css";
import { motion } from "framer-motion";

function Friends() {
    const [friendName, setFriendName] = useState(""); // State to hold the friend's name input
    const [friends, setFriends] = useState([]); // State to hold the list of friends
    const { token, email } = useRecoilValue(userState); // Access user token and email from Recoil state
    const toast = useToast(); // Chakra UI toast for notifications

    // Fetch the list of friends from the backend when the component mounts
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get("http://localhost:5005/usr/friend/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        email: email,
                    },
                });
                setFriends(response.data.friends); // Assuming response contains { friends: [...] }
            } catch (err) {
                console.error("Error fetching friends:", err);
                toast({
                    title: "Error fetching friends.",
                    description: "Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchFriends();
    }, [token, email, toast]); // Dependencies to re-run effect if token, email, or toast changes

    // Function to handle adding a friend
    const handleAddFriend = async () => {
        if (!friendName.trim()) {
            toast({
                title: "Invalid input.",
                description: "Please enter a friend's email.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await axios.post(
                "http://localhost:5005/usr/friend/add",
                { friendEmail: friendName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        email: email,
                    },
                }
            );
            setFriends((prevFriends) => [...prevFriends, friendName]); // Update the friends list
            setFriendName(""); // Clear the input field
            toast({
                title: "Friend added.",
                description: `${friendName} has been added to your friends list.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error("Error adding friend:", err);
            toast({
                title: "Error adding friend.",
                description: "Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <section>
            <Box className={styles.sectionBox} p={4}>
                <FormControl id="friendName" mb={4}>
                    <Input
                        type="text"
                        placeholder="Enter friend's email"
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                    />
                </FormControl>
                <Button className={styles.addFriendButton} colorScheme="teal" onClick={handleAddFriend}>
                    Add Friend
                </Button>
            </Box>

            <Box className={styles.friendsListBox} p={4} mt={4}>
                <Text fontSize="lg" mb={2}>Friends List:</Text>
                <List spacing={3}>
                    {friends.map((friend, index) => (
                        <ListItem key={index} className={styles.friendItem}>
                            <Text>{friend}</Text>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </section>
    );
}

export default Friends;
