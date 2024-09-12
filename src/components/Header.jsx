import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../state/app.context";
import { logoutUser } from "../services/auth.service";
import logo from '../assets/profile-picture.jpg/Logo.png'; 

export default function Header() {
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
    <header>
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Plate Pleasures Logo" className="logo" />
          <h1>Plate Pleasures</h1>
        </div>
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          {user && (
            <>
              <NavLink to="/posts">All posts</NavLink>
              <NavLink to="/posts-create">Create post</NavLink>
              <NavLink to="/profile">Profile</NavLink> 
              {userData?.isAdmin && ( 
                <NavLink to="/admin">Admin Panel</NavLink> 
              )}
            </>
          )}
          {!user && <NavLink to="/login">Login</NavLink>}
          {!user && <NavLink to="/register">Register</NavLink>}
        </div>
        <div className="logout-container">
          {user && <button onClick={logout}>Logout</button>}
          {userData && <span>Welcome, {userData.handle}</span>}
        </div>
      </nav>
    </header>
  );
}
