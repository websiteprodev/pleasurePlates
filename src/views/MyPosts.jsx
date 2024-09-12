import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../state/app.context';
import { getPostsByUserHandle } from '../services/posts.service'; 
import Post from '../components/Post';

const MyPosts = () => {
    const { userData } = useContext(AppContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const userPosts = await getPostsByUserHandle(userData.handle);
                const processedPosts = userPosts.map(post => ({
                    ...post,
                    likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
                    dislikedBy: post.dislikedBy ? Object.keys(post.dislikedBy) : [],
                }));
                setPosts(processedPosts);
            } catch (error) {
                console.error('Failed to fetch user posts:', error);
            }
        };

        if (userData) {
            fetchUserPosts();
        }
    }, [userData]);

    return (
        <div className="my-posts-page">
            <h1>My Posts</h1>
            {posts.length > 0 ? (
                <div className="posts-grid">
                    {posts.map(post => (
                        <Post key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <p>You have not posted anything yet.</p>
            )}
        </div>
    );
}

export default MyPosts;
