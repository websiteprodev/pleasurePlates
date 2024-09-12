import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { AppContext } from '../state/app.context';
import { updatePost } from '../services/posts.service';

export default function EditPost({ post, onSave }) {
    const { userData } = useContext(AppContext);
    const [editedPost, setEditedPost] = useState({
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || [], 
    });

    const [tagInput, setTagInput] = useState('');

    const updateEditedPost = (key, value) => {
        setEditedPost({
            ...editedPost,
            [key]: value,
        });
    };

    const handleSave = async () => {
        if (!userData) {
            alert('You must be logged in to edit a post.');
            return;
        }

        if (editedPost.title.trim().length < 16 || editedPost.title.trim().length > 64) {
            alert('The title must be between 16 and 64 symbols');
            return;
        }
        if (editedPost.content.trim().length < 32 || editedPost.content.trim().length > 8192) {
            alert('Content too short!');
            return;
        }
        if (editedPost.category === '') {
            alert('Please select a category!');
            return;
        }

        try {
            await updatePost(post.id, editedPost);
            alert('Post updated successfully!');
            onSave(); 
        } catch (error) {
            console.error('Failed to update post:', error);
            alert('Failed to update post. Please try again.');
        }
    };

    const addTag = () => {
        const lowerCaseTag = tagInput.toLowerCase();
        if (tagInput && !editedPost.tags.includes(lowerCaseTag)) {
            setEditedPost({ ...editedPost, tags: [...editedPost.tags, lowerCaseTag] });
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setEditedPost({ ...editedPost, tags: editedPost.tags.filter(tag => tag !== tagToRemove) });
    };

    return (
        <div className="edit-post-form">
            <h1>Edit Post</h1>
            <label htmlFor="title">Title: </label>
            <input
                className="input-field"
                value={editedPost.title}
                onChange={e => updateEditedPost('title', e.target.value)}
                type="text"
                name="title"
                id="title"
            /><br />
            <label htmlFor="content">Content: </label>
            <textarea
                className="input-field"
                value={editedPost.content}
                onChange={e => updateEditedPost('content', e.target.value)}
                name="content"
                id="content"
            /><br />
            <label htmlFor="category">Category: </label>
            <select
                className="input-field"
                value={editedPost.category}
                onChange={e => updateEditedPost('category', e.target.value)}
                name="category"
                id="category"
            >
                <option value="">Select a category</option>
                <option value="Soups">Soups</option>
                <option value="Salads">Salads</option>
                <option value="Main courses">Main courses</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Dessert">Dessert</option>
            </select><br /><br />
            <label htmlFor="tags">Tags: </label>
            <input
                className="input-field"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                type="text"
                name="tags"
                id="tags"
                placeholder="Add tags"
            />
            <button className="add-tag-btn" onClick={addTag}>Add Tag</button>
            <ul className="tags-list">
                {editedPost.tags.map(tag => (
                    <li key={tag} className="tag-item">
                        {tag} <button className="remove-tag-btn" onClick={() => removeTag(tag)}>Remove</button>
                    </li>
                ))}
            </ul><br />
            <button className="save-post-btn" onClick={handleSave}>Save</button>
        </div>
    );
}

EditPost.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string), 
    }).isRequired,
    onSave: PropTypes.func.isRequired,
};
