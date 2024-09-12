import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../state/app.context';
import { getUserByHandle } from '../services/users.service';
import Comments from './Comments';
import EditPost from './EditPost';
import { dislikePost, likePost, unlikePost, undislikePost, deletePost } from '../services/posts.service';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Post({ post, onDelete }) {
    const { userData } = useContext(AppContext);
    const [authorName, setAuthorName] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [likedBy, setLikedBy] = useState(post.likedBy || []);
    const [dislikedBy, setDislikedBy] = useState(post.dislikedBy || []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserByHandle(post.author);
                setAuthorName(user?.name || post.author);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, [post.author]);

    const toggleLike = async () => {
        if (!userData) {
            alert('You must be logged in to like a post.');
            return;
        }

        const isLiked = Array.isArray(likedBy) && likedBy.includes(userData.handle);
        const isDisliked = Array.isArray(dislikedBy) && dislikedBy.includes(userData.handle);

        try {
            if (isLiked) {
                await unlikePost(userData.handle, post.id);
                setLikedBy(likedBy.filter(handle => handle !== userData.handle));
            } else {
                await likePost(userData.handle, post.id);
                setLikedBy([...likedBy, userData.handle]);
                if (isDisliked) {
                    await undislikePost(userData.handle, post.id);
                    setDislikedBy(dislikedBy.filter(handle => handle !== userData.handle));
                }
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
            alert('Failed to like/dislike post. Please try again.');
        }
    };

    const toggleDislike = async () => {
        if (!userData) {
            alert('You must be logged in to dislike a post.');
            return;
        }

        const isLiked = Array.isArray(likedBy) && likedBy.includes(userData.handle);
        const isDisliked = Array.isArray(dislikedBy) && dislikedBy.includes(userData.handle);

        try {
            if (isDisliked) {
                await undislikePost(userData.handle, post.id);
                setDislikedBy(dislikedBy.filter(handle => handle !== userData.handle));
            } else {
                await dislikePost(userData.handle, post.id);
                setDislikedBy([...dislikedBy, userData.handle]);
                if (isLiked) {
                    await unlikePost(userData.handle, post.id);
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
                await deletePost(post.id);
                if (onDelete) {
                    onDelete(post.id);
                }
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('Failed to delete post. Please try again.');
            }
        }
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const formattedDate = new Date(post.createdOn).toLocaleDateString();
    const snippet = post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content;

    return (
        <div className="post-card">
            <Link to={`/posts/${post.id}`}>
                <h3 className="post-title">{post.title}</h3>
            </Link>
            <p className="post-category">Category: {post.category}</p>
            <p className="post-tags">Tags: {post.tags?.join(', ')}</p>
            {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="post-image" />}
            <p className="post-content">{isExpanded ? post.content : snippet}</p>
            {post.content.length > 100 && (
                <button className="toggle-content-btn" onClick={toggleExpanded}>
                    {isExpanded ? 'See Less' : 'See More'}
                </button>
            )}
            {(userData?.handle === post.author || userData?.isAdmin) && (
                    <>
                        <button className="edit-btn" onClick={toggleEdit}>{isEditing ? 'Cancel' : 'Edit'}</button>
                    </>
                )}
            <p className="post-author">Posted By: {authorName} on {formattedDate}</p>
            <div className="post-actions">
                <button
                    className={`like-btn ${Array.isArray(likedBy) && likedBy.includes(userData?.handle) ? 'active' : ''}`}
                    onClick={toggleLike}
                >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>{likedBy.length}</span>
                </button>
                <button
                    className={`dislike-btn ${Array.isArray(dislikedBy) && dislikedBy.includes(userData?.handle) ? 'active' : ''}`}
                    onClick={toggleDislike}
                >
                    <FontAwesomeIcon icon={faThumbsDown} />
                    <span>{dislikedBy.length}</span>
                </button>
                {(userData?.handle === post.author || userData?.isAdmin) && (
                    <>
                        <button className="delete-btn" onClick={handleDelete}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </>
                )}
            </div>
            {isEditing && <EditPost post={post} onSave={handleSave} />}
            <Comments postId={post.id} postAuthor={post.author} />

        </div>
    );
}

Post.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdOn: PropTypes.string.isRequired,
        likedBy: PropTypes.arrayOf(PropTypes.string),
        dislikedBy: PropTypes.arrayOf(PropTypes.string),
        category: PropTypes.string,
        imageUrl: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    onDelete: PropTypes.func,
};
