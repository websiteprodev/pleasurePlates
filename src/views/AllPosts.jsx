
import React from "react";
import { useEffect, useState } from "react";
import { getAllPosts } from "../services/posts.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import Post from '../components/Post';

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const [category, setCategory] = useState('all');
    const [sort, setSort] = useState('newest');
    const [searchTerm, setSearchTerm] = useState(search);

    
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;

    const fetchPosts = async (searchTerm) => {
        setLoading(true);
        try {
            const postsData = await getAllPosts(searchTerm);
            const transformedPosts = postsData.map(post => ({
                ...post,
                likedBy: Array.isArray(post.likedBy) ? post.likedBy : Object.keys(post.likedBy ?? {}),
                dislikedBy: Array.isArray(post.dislikedBy) ? post.dislikedBy : Object.keys(post.dislikedBy ?? {}),
                comments: post.comments || {},
                createdOn: post.createdOn || new Date().toISOString(),
            }));
            setPosts(transformedPosts);
            filterPosts(transformedPosts, category, sort);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            alert('Failed to fetch posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(search);
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        setSearchParams({ search: searchTerm });
        fetchPosts(searchTerm);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const filterPosts = (posts, category, sort) => {
        let filtered = posts;
        if (category !== 'all') {
            filtered = filtered.filter(post => post.category === category);
        }

        if (sort === 'mostLiked') {
            filtered.sort((a, b) => b.likedBy.length - a.likedBy.length);
        } else if (sort === 'newest') {
            filtered.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        }

        setFilteredPosts([...filtered]);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        filterPosts(posts, event.target.value, sort);
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
        filterPosts(posts, category, event.target.value);
    };

    const handleDelete = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
        filterPosts(posts.filter(post => post.id !== postId), category, sort);
    };

    
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredPosts.length / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="content">
            <h1>Posts</h1>
            <div className="filters-container">
                <label htmlFor="search">Search: </label>
                <input
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    type="text"
                    name="search"
                    id="search"
                />
                <button onClick={handleSearchSubmit}>Search</button>

                <label htmlFor="category">Category: </label>
                <select value={category} onChange={handleCategoryChange} name="category" id="category">
                    <option value="all">All</option>
                    <option value="Soups">Soups</option>
                    <option value="Salads">Salads</option>
                    <option value="Main courses">Main courses</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Dessert">Dessert</option>
                </select>

                <label htmlFor="sort">Sort by: </label>
                <select value={sort} onChange={handleSortChange} name="sort" id="sort">
                    <option value="newest">Newest</option>
                    <option value="mostLiked">Most Liked</option>
                </select>
            </div>
            {loading ? (
                <p>Loading posts...</p>
            ) : filteredPosts.length > 0 ? (
                <>
                    <div className="posts-grid">
                        {currentPosts.map(post => (
                            <div key={post.id} className="post-card">
                                <Post post={post} onDelete={handleDelete} />
                            </div>
                        ))}
                    </div>
                    <nav className="pagination">
                        <ul className="pagination-list">
                            {pageNumbers.map(number => (
                                <li key={number} className="pagination-item">
                                    <button onClick={() => paginate(number)} className="pagination-link">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </>
            ) : (
                <p>No posts found.</p>
            )}
        </div>
    );
}
