import React, { useEffect, useState } from "react";
import { getAllPosts } from "../services/posts.service";
import { Link } from "react-router-dom";

export default function TopLikedPostsPage() {
    const [topLikedPosts, setTopLikedPosts] = useState([]);

    useEffect(() => {
        const fetchTopLikedPosts = async () => {
            try {
                const allPosts = await getAllPosts();
                const topLiked = allPosts
                    .sort((a, b) => (b.likedBy?.length || 0) - (a.likedBy?.length || 0))
                    .slice(0, 10);

                setTopLikedPosts(topLiked);
            } catch (error) {
                console.error("Failed to fetch top liked posts:", error);
            }
        };

        fetchTopLikedPosts();
    }, []);

    return (
        <div className="top-posts-page">
            <h1>Top 10 Most Liked Posts</h1>
            <ul>
                {topLikedPosts.map((post, index) => (
                    <li key={post.id}>
                        <h2>{index + 1}. <Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
                        <p>{post.likedBy?.length || 0} likes</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
