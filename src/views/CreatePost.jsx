import { useContext, useState } from "react";
import { createPost as apiCreatePost } from "../services/posts.service";
import { AppContext } from '../state/app.context';
import { uploadImage } from '../services/storage.service';

export default function CreatePostComponent() {
    const titleMinLength = 16;
    const titleMaxLength = 64;
    const contentMinLength = 32;
    const contentMaxLength = 8192;

    const [post, setPost] = useState({
        title: '',
        content: '',
        category: '',
        tags: [],
        image: null,
    });
    const [tagInput, setTagInput] = useState('');
    const { userData } = useContext(AppContext);
    const [imageUrl, setImageUrl] = useState(''); 

    const updatePost = (key, value) => {
        setPost({
            ...post,
            [key]: value,
        });
    };

    const handleCreatePost = async () => {
        if (!userData) {
            alert('You must be logged in to create a post.');
            return;
        }

        if (userData.isBlocked) {
            alert('Your account is blocked. You cannot create a post.');
            return;
        }

        if (post.title.trim().length < titleMinLength || post.title.trim().length > titleMaxLength) {
            alert('The title must be between 16 and 64 symbols');
            return;
        }
        if (post.content.trim().length < contentMinLength || post.content.trim().length > contentMaxLength) {
            alert('Content too short!');
            return;
        }
        if (post.category === '') {
            alert('Please select a category!');
            return;
        }

        try {
            let imageUrl = null;
            if (post.image) {
                imageUrl = await uploadImage(post.image); 
            }

            await apiCreatePost(userData.handle, post.title, post.content, post.category, post.tags, imageUrl); 

            setPost({ title: '', content: '', category: '', tags: [], image: null });
            setTagInput('');
            setImageUrl(''); 
            alert('Post created successfully!');
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to create post. Please try again.');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPost({ ...post, image: file });

            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTag = () => {
        const lowerCaseTag = tagInput.toLowerCase();
        if (tagInput && !post.tags.includes(lowerCaseTag)) {
            setPost({ ...post, tags: [...post.tags, lowerCaseTag] });
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setPost({ ...post, tags: post.tags.filter(tag => tag !== tagToRemove) });
    };

    return (
        <div className="create-post-page">
            <h1>Create Post</h1>
            <div className="form-section">
                <label htmlFor="title">Title: </label>
                <input
                    className="input-field"
                    value={post.title}
                    onChange={e => updatePost('title', e.target.value)}
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter post title"
                /><br />
                <label htmlFor="content">Content: </label>
                <textarea
                    className="input-field"
                    value={post.content}
                    onChange={e => updatePost('content', e.target.value)}
                    name="content"
                    id="content"
                    placeholder="Write your post content here"
                /><br />
                <label htmlFor="category">Category: </label>
                <select
                    className="input-field"
                    value={post.category}
                    onChange={e => updatePost('category', e.target.value)}
                    name="category"
                    id="category"
                >
                    <option value="">Select a category</option>
                    <option value="Soups">Soups</option>
                    <option value="Salads">Salads</option>
                    <option value="Main courses">Main courses</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Dessert">Dessert</option>
                </select><br />
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
                    {post.tags.map(tag => (
                        <li key={tag} className="tag-item">
                            {tag} <button className="remove-tag-btn" onClick={() => removeTag(tag)}>Remove</button>
                        </li>
                    ))}
                </ul><br />
                <label className="upload-image-label" htmlFor="image">Upload Image: </label>
                <input
                    type="file"
                    id="image"
                    className="upload-image-input"
                    accept="image/*"
                    onChange={handleImageUpload}
                /><br />
                {imageUrl && <img src={imageUrl} className="upload-image-preview" alt="Preview" />}
                <button className="create-post-btn" onClick={handleCreatePost}>Create</button>
            </div>
        </div>
    );
}
