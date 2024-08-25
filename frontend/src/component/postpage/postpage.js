import React, { useState } from "react";
import { FaSync, FaUserFriends } from "react-icons/fa";
import { IconButton } from "@chakra-ui/react";
import styles from "./style/postpage.module.css";
import Post from "./post.js";
import AddPost from "./addpost.js";
import Friends from "../friends/friends.js";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../App.js";

function Postpage() {
  const [showAddPost, setShowAddPost] = useState(false); // State to manage AddPost visibility
  const [, setUser] = useRecoilState(userState);

  const handleRefresh = () => {
    setUser((prev) => ({ ...prev, updatedPost: !prev.updatedPost }));
  };

  return (
    <div className={styles.appContainer}>
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
                  onClick={() => setShowAddPost(!showAddPost)}
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
            {showAddPost ? <Friends /> : null}

            <p>Connect, share, and make new friends!</p>
          </div>
        </header>

        {/* Post Feed Section */}
        <section className={styles.postFeedTitle}>
          <h2>Recent Posts</h2>
          <IconButton
            style={{ marginRight: "0.5rem" }}
            colorScheme="blue"
            aria-label="Search database"
            icon={<FaSync />}
            onClick={handleRefresh}
          />

          {/* Add more posts to see the scrolling effect */}
        </section>

        <section className={styles.postFeedBody}>
          <Post />
        </section>
      </section>
    </div>
  );
}

export default Postpage;
