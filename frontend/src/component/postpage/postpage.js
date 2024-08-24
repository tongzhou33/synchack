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

function WalkthroughPopover() {
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
              <WalkthroughPopover />
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
