import React from 'react';
import styles from './style/postpage.module.css'; // Import the CSS module
import Post from './post.js'; // Import the Post component

function Postpage() {
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
                            <h1 className={styles.title}>Friendli</h1>
                            <div className={styles.searchContainer}>
                                <input 
                                    type="text" 
                                    className={styles.searchInput} 
                                    placeholder="Search posts, friends..." 
                                />
                            </div>
                        </div>
                        <p>Connect, share, and make new friends!</p>
                    </div>
                </header>
                
                {/* Post Feed Section */}
                <section className={styles.postFeed}>
                    <h2>Recent Posts</h2>
                    <Post />
                    <Post />
                    <Post />
                    {/* Add more posts to see the scrolling effect */}
                </section>
            </section>
        </div>
    );
}

export default Postpage;
