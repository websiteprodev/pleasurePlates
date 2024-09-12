import { useEffect, useState } from 'react';
import './index.css';         
import './App.css';            
import './styles/styles.css';  
import Home from './views/Home';
import AllPosts from './views/AllPosts';
import CreatePost from './views/CreatePost';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile'; 
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './views/NotFound';
import SinglePost from './views/SinglePost';
import AdminPanel from './views/AdminPanel';
import { AppContext } from './state/app.context';
import Login from './views/Login';
import Authenticated from './hoc/Authenticated';
import Register from './views/Register';
import TopCommentedPostsPage from './views/TopCommentedPostsPage'; 
import TopLikedPostsPage from './views/TopLikedPostsPage';
import { auth } from './config/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData } from './services/users.service';
import MyPosts from './views/MyPosts';

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (appState.user !== user) {
      setAppState((prevState) => ({ ...prevState, user }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const data = await getUserData(user.uid);
        const userData = data[Object.keys(data)[0]];

        console.log('User data fetched:', userData);

        setAppState((prevState) => ({ ...prevState, userData }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <Header />
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/posts' element={<Authenticated><AllPosts /></Authenticated>} />
            <Route path='/posts/:id' element={<Authenticated><SinglePost /></Authenticated>} />
            <Route path='/posts-create' element={<Authenticated><CreatePost /></Authenticated>} />
            <Route path='/admin' element={<Authenticated><AdminPanel /></Authenticated>} />
            <Route path='/profile' element={<Authenticated><Profile /></Authenticated>} /> 
            <Route path='/top-commented' element={<TopCommentedPostsPage />} /> 
            <Route path='/top-liked' element={<TopLikedPostsPage />} /> 
            <Route path='/my-posts' element={<Authenticated><MyPosts /></Authenticated>} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

function Footer() {
  return <footer>&copy; 2024 Culinary Forum. A Culinary Project by Telerik. All rights reserved.</footer>;
}

export default App;
