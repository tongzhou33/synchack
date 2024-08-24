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
import AddPost from "./addpost.js";

function Postpage() {
  const [showInputs, setShowInputs] = useState(false); // State to manage input visibility

  const handleToggle = () => {
    setShowInputs(!showInputs); // Toggle input fields visibility
  };

  return (
    <div className={styles.appContainer}>
      {/* High-tech grid overlay */}
      <div className={styles.highTechOverlay}></div>
      {/* Chinese mountains overlay */}
      <div className={styles.mountainsOverlay}></div>

      {/* Main content container */}
      <section className={styles.postPageContainer}>
        {/* Hero Section */}
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.headerContent}>
              <span style={{ display: "flex" }}>
                <IconButton
                  style={{ marginRight: "0.5rem" }}
                  colorScheme="blue"
                  aria-label="Search database"
                  icon={<FaUserFriends />}
                />
                <h1 className={styles.title}>Friendli</h1>
              </span>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search posts, friends..."
                />
              </div>
              <AddPost />
            </div>
            <p>Connect, share, and make new friends!</p>
          </div>
        </header>

        {/* Post Feed Section */}
        <section className={styles.postFeed}>
          <h2>Recent Posts</h2>

          <Post />
          <br />
          <Post />
          <br />
          <Post />
          <br />
          {/* Add more posts to see the scrolling effect */}
        </section>
      </section>
    </div>
  );
}

export default Postpage;
