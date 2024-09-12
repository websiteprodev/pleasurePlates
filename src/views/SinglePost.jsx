import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, deletePost, likePost, dislikePost, unlikePost, undislikePost } from '../services/posts.service';
import Comments from '../components/Comments';
import { AppContext } from '../state/app.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

export default function SinglePost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);
    const [post, setPost] = useState(null);
    const [likedBy, setLikedBy] = useState([]);
    const [dislikedBy, setDislikedBy] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const postData = await getPostById(id);
                setPost(postData);
                setLikedBy(postData.likedBy || []);
                setDislikedBy(postData.dislikedBy ? Object.keys(postData.dislikedBy) : []);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                setError('Failed to load the post. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleLike = async () => {
        if (!userData) {
            alert('You must be logged in to like a post.');
            return;
        }

        const isLiked = likedBy.includes(userData.handle);
        const isDisliked = dislikedBy.includes(userData.handle);

        try {
            if (isLiked) {
                await unlikePost(userData.handle, id);
                setLikedBy(likedBy.filter(handle => handle !== userData.handle));
            } else {
                await likePost(userData.handle, id);
                setLikedBy([...likedBy, userData.handle]);
                if (isDisliked) {
                    await undislikePost(userData.handle, id);
                    setDislikedBy(dislikedBy.filter(handle => handle !== userData.handle));
                }
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
            alert('Failed to like/dislike post. Please try again.');
        }
    };

    const handleDislike = async () => {
        if (!userData) {
            alert('You must be logged in to dislike a post.');
            return;
        }

        const isLiked = likedBy.includes(userData.handle);
        const isDisliked = dislikedBy.includes(userData.handle);

        try {
            if (isDisliked) {
                await undislikePost(userData.handle, id);
                setDislikedBy(dislikedBy.filter(handle => handle !== userData.handle));
            } else {
                await dislikePost(userData.handle, id);
                setDislikedBy([...dislikedBy, userData.handle]);
                if (isLiked) {
                    await unlikePost(userData.handle, id);
                    setLikedBy(likedBy.filter(handle => handle !== userData.handle));
                }
            }
        } catch (error) {
            console.error('Failed to toggle dislike:', error);
            alert('Failed to dislike post. Please try again.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                navigate('/posts');
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('Failed to delete post. Please try again.');
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!post) {
        return <p>Post not found.</p>;
    }

    const formattedDate = new Date(post.createdOn).toLocaleDateString();
    const isLiked = likedBy.includes(userData?.handle);
    const isDisliked = dislikedBy.includes(userData?.handle);

    return (
        <div className="single-post">
            <h1>{post.title}</h1>
            {post.imageUrl && (
                <div className="post-image-container">
                    <img src={post.imageUrl} alt={post.title} className="post-image" />
                </div>
            )}
            <p>Category: {post.category}</p>
            <p>Tags: {post.tags?.join(', ')}</p>
            <p>{post.content}</p>
            <p>Posted by: {post.author} on {formattedDate}</p>
            <div className="post-actions">
                <button
                    className={`like-btn ${isLiked ? 'active' : ''}`}
                    onClick={handleLike}
                >
                    <FontAwesomeIcon icon={faThumbsUp} /> 
                </button>
                <span>{likedBy.length}</span>
                <button
                    className={`dislike-btn ${isDisliked ? 'active' : ''}`}
                    onClick={handleDislike}
                >
                    <FontAwesomeIcon icon={faThumbsDown} /> 
                </button>
                <span>{dislikedBy.length}</span>
                {(userData?.handle === post.author || userData?.isAdmin) && (
                    <>
                        <button onClick={handleDelete}>Delete</button>
                    </>
                )}
            </div>
            <Comments postId={post.id} postAuthor={post.author} />
        </div>
    );
}
