import React from 'react';
import styles from './style/postpage.module.css'; // Import the CSS module

function Post() {
    return (
        <div className={styles.postContainer}>
            <div className={styles.postHeader}>
                <img src="https://via.placeholder.com/40" alt="Profile" className={styles.profilePic} />
                <span className={styles.username}>John Doe</span>
            </div>
            <div className={styles.postContent}>
                <p>This is the content of the post. It could be text, images, or a combination of both.</p>
                <img src="https://via.placeholder.com/300" alt="Post Content" className={styles.postImage} />
            </div>
            <div className={styles.postInteractions}>
                <button className={styles.interactionButton}>Like</button>
                <button className={styles.interactionButton}>Comment</button>
                <button className={styles.interactionButton}>Share</button>
                <button className={styles.interactionButton}>Save</button>
            </div>
            <div className={styles.postFooter}>
                <span className={styles.timestamp}>2 hours ago</span>
                <span className={styles.additionalInfo}>View all 10 comments</span>
            </div>
        </div>
    );
}

export default Post;
