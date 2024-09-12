import { useContext, useState } from "react";
import { AppContext } from "../state/app.context";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { getUserData } from "../services/users.service";

export default function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const updateUser = prop => e => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });
  };

  const login = async () => {
    if (!user.email || !user.password) {
      alert('No credentials provided!');
      return;
    }

    try {
      const credentials = await loginUser(user.email, user.password);
      const userData = await getUserData(credentials.user.uid);
      setAppState({
        user: credentials.user,
        userData: userData[Object.keys(userData)[0]],
      });

      if (userData[Object.keys(userData)[0]].isBlocked) {
        alert('Your account is blocked. You have limited access.');
      }

      navigate(location.state?.from.pathname ?? '/');
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <div className="form-section">
        <label htmlFor="email">Email: </label>
        <input
          className="input-field"
          value={user.email}
          onChange={updateUser('email')}
          type="text"
          name="email"
          id="email"
          placeholder="Enter your email"
        /><br />
        <label htmlFor="password">Password: </label>
        <input
          className="input-field"
          value={user.password}
          onChange={updateUser('password')}
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
        /><br />
        <button className="login-btn" onClick={login}>Login</button>
      </div>
    </div>
  );
}
