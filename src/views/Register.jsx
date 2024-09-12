import { useContext, useState } from "react";
import { registerUser } from "../services/auth.service";
import { AppContext } from "../state/app.context";
import { useNavigate } from "react-router-dom";
import { createUserHandle, getUserByHandle, saveUserDetails } from "../services/users.service";

export default function Register() {
  const minNameLength = 4;
  const maxNameLength = 32;

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const { setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const updateUser = prop => e => {
    setUser({
      ...user,
      [prop]: e.target.value,
    })
  };

  const register = async () => {
    if (!user.email || !user.password) {
      alert('No credentials provided!');
      return;
    }
    if (user.firstName.length < minNameLength || user.firstName.length > maxNameLength 
      || user.lastName.length < minNameLength || user.lastName.length > maxNameLength){
      alert('First and last names must be between 4 and 32 symbols')
      return;
    }
    try {
      const userFromDB = await getUserByHandle(user.firstName);
      if (userFromDB) {
        alert(`User ${user.firstName} already exists!`);
        return;
      }
      const credential = await registerUser(user.email, user.password);
      const isAdmin = user.email.endsWith("@admin.com"); 

      await createUserHandle(user.firstName, credential.user.uid, user.email);

      await saveUserDetails({
        uid: credential.user.uid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin,
        handle: user.firstName || 'defaultHandle' 
      });
      
      setAppState({ user: credential.user, userData: null, isAdmin }); 
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      <div className="form-section">
        <label htmlFor="firstName">First Name: </label>
        <input
          className="input-field"
          value={user.firstName}
          onChange={updateUser('firstName')}
          type="text"
          name="firstName"
          id="firstName"
          placeholder="Enter your first name"
        /><br />
        <label htmlFor="lastName">Last Name: </label>
        <input
          className="input-field"
          value={user.lastName}
          onChange={updateUser('lastName')}
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Enter your last name"
        /><br />
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
        <button className="register-btn" onClick={register}>Register</button>
      </div>
    </div>
  )
}
