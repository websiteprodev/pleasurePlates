import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaCommentAlt, FaThumbsUp, FaClipboardList, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { AppContext } from '../state/app.context';
import { logoutUser } from '../services/auth.service';

export default function Sidebar() {
    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await logoutUser();
            setAppState({ user: null, userData: null });
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
            alert('Failed to logout. Please try again.');
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-icon-container">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'sidebar-icon active' : 'sidebar-icon')}>
                    <FaHome />
                    <span className="tooltip">Home</span>
                </NavLink>
            </div>
            {user ? (
                <>
                    <div className="sidebar-icon-container">
                        <NavLink to="/top-commented" className={({ isActive }) => (isActive ? 'sidebar-icon active' : 'sidebar-icon')}>
                            <FaCommentAlt />
                            <span className="tooltip">Most Commented</span>
                        </NavLink>
                    </div>
                    <div className="sidebar-icon-container">
                        <NavLink to="/top-liked" className={({ isActive }) => (isActive ? 'sidebar-icon active' : 'sidebar-icon')}>
                            <FaThumbsUp />
                            <span className="tooltip">Most Liked</span>
                        </NavLink>
                    </div>
                    <div className="sidebar-icon-container">
                        <NavLink to="/my-posts" className={({ isActive }) => (isActive ? 'sidebar-icon active' : 'sidebar-icon')}>
                            <FaClipboardList />
                            <span className="tooltip">My Posts</span>
                        </NavLink>
                    </div>
                    <div className="sidebar-icon-container">
                        <button className="sidebar-icon" onClick={logout}>
                            <FaSignOutAlt />
                            <span className="tooltip">Logout</span>
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="sidebar-icon-container">
                        <NavLink to="/login" className={({ isActive }) => (isActive ? 'sidebar-icon active' : 'sidebar-icon')}>
                            <FaSignInAlt />
                            <span className="tooltip">Login</span>
                        </NavLink>
                    </div>
                    <div className="sidebar-icon-container">
                        <NavLink to="/register" className={({ isActive }) => (isActive ? 'sidebar-icon active' : 'sidebar-icon')}>
                            <FaUserPlus />
                            <span className="tooltip">Register</span>
                        </NavLink>
                    </div>
                </>
            )}
        </div>
    );
}
