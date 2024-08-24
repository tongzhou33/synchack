import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Input, Button, useToast, FormControl, FormLabel } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike, BiChat, BiShare } from "react-icons/bi";
import { useRecoilValue } from "recoil";
import { userState } from "../../App.js";
import styles from "./styles/friends.module.css";

function Friends() {
    const [friendName, setFriendName] = useState(""); // State to hold the friend's name input
    const { token } = useRecoilValue(userState); // Access user token from Recoil state
  
    return (
        <section>
            <Box p={8} maxW="sm" mx="auto">
                <FormControl id="friendName" mb={4}>
                    <Input
                    type="text"
                    placeholder="Enter friend's name"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    />
                </FormControl>
                <Button className = {styles.addFriendButton} colorScheme="teal" >
                    Add Friend
                </Button>
            </Box>
        </section>
    );
}

export default Friends;