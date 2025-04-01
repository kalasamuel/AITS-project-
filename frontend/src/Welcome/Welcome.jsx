import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = ({ setIsAuthenticated, setUserType }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState(''); // Updated variable name
  const [role, setRole] = useState('student');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      alert(`Welcome back, ${user.fullName}!`);
      setIsAuthenticated(true);
      setUserType(user.role); // Set the user type (student, lecturer, registrar)
      navigate(user.role === 'lecturer' ? '/lecturer/home' : '/'); // Redirect based on role
    } else {
      alert('Invalid email or password!');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      alert('A user with this email already exists!');
      return;
    }

    const newUser = {
      fullName,
      email,
      referenceNumber, // Updated key
      role,
      password,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('otp', otp);
    alert(`Your OTP is: ${otp}`);

    navigate('/otp-verification', { state: { email } });
  };

  return (
    <div className="welcome-container">
      <h1 className='welcome-to'>Welcome to AITS</h1>
      <div className="toggle-container">
        <button
          className={`toggle-button ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Log In
        </button>
        <button
          className={`toggle-button ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>
      <div className="form-container">
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <h2>Log In</h2>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Log In
            </button>
            <p className="forgot-password">Forgot Password?</p>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="registrar">Registrar</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reference Number</label> {/* Updated label */}
              <input
                type="text"
                value={referenceNumber} // Updated variable
                onChange={(e) => setReferenceNumber(e.target.value)} // Updated handler
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Welcome;