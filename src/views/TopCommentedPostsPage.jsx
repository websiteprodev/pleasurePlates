import React, { useEffect, useState } from "react";
import { getAllPosts } from "../services/posts.service";
import { Link } from "react-router-dom";

export default function TopCommentedPostsPage() {
    const [topCommentedPosts, setTopCommentedPosts] = useState([]);

    useEffect(() => {
        const fetchTopCommentedPosts = async () => {
            try {
                const allPosts = await getAllPosts();
                const topCommented = allPosts
                    .sort((a, b) => Object.keys(b.comments || {}).length - Object.keys(a.comments || {}).length)
                    .slice(0, 10);

                setTopCommentedPosts(topCommented);
            } catch (error) {
                console.error("Failed to fetch top commented posts:", error);
            }
        };

        fetchTopCommentedPosts();
    }, []);

    return (
        <div className="top-posts-page">
            <h1>Top 10 Most Commented Posts</h1>
            <ul>
                {topCommentedPosts.map((post, index) => (
                    <li key={post.id}>
                        <h2>{index + 1}. <Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
                        <p>{Object.keys(post.comments || {}).length} comments</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
