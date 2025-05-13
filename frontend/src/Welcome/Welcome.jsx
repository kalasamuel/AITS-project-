import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Welcome.css';
import { BACKEND_URL } from '../config';

const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    institutional_email: '',
    email: '',
    student_number: '',
    year_of_study: '',
    lecturer_id: '',
    password: '',
    confirm_password: '',
    role: '',
    registrar_code: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle URL Query Parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const verified = queryParams.get('verified');
    if (verified === 'true') {
      setIsLogin(true);
      setMessage('Webmail verified successfully! You can now log in.');

      const emailFromQuery = queryParams.get('institutional_email');
      if (emailFromQuery) {
        setFormData((prev) => ({
          ...prev,
          institutional_email: emailFromQuery,
        }));
      }
    }
  }, [location]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Validate year_of_study
    if (name === 'year_of_study') {
      const newValue = parseInt(value, 10);
      if (!isNaN(newValue) && newValue >= 1 && newValue <= 5) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: newValue,
        }));
      }
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_role', data.user.role);

        window.dispatchEvent(new Event("storage"));
        // Navigate based on role
        if (data.user.role === 'student') {
          window.location.href = "/student/home";
        } else if (data.user.role === 'lecturer') {
          window.location.href = "/lecturer/home";
        } else if (data.user.role === 'registrar') {
          window.location.href = "/registrar/home";
        } else {
          navigate("/welcome");
        }
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (error) {
      setError('An error occurred. Login failed.');
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validation
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.institutional_email ||
      !formData.email ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError('All fields are required.');
      return;
    }
    //if (formData.password.length < 8) {
      //setError('Password must be at least 8 characters long.');
    //  return;
   // }
   // if (!/[!@#$%^&*]/.test(formData.password)) {
    //  setError('Password must contain at least one special character (!@#$%^&*).');
     // return;
   // }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.role === 'student' && (!formData.student_number || !formData.year_of_study)) {
      setError('Student number and year of study are required for students.');
      return;
    }
    if (formData.role === 'lecturer' && !formData.lecturer_id) {
      setError('Lecturer ID is required for lecturers.');
      return;
    }
    if (formData.role === 'registrar' && !formData.registrar_code) {
      setError('Registrar Code is required.');
      return;
    }

    // Submit Registration
    try {
      const response = await fetch('/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status === 201) {
        setMessage('Registration successful! Please verify your email.');
        navigate(`/otp-verification?institutional_email=${formData.institutional_email}`);
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  // Render Form
  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <h1 className="welcome-to">Welcome to AITS</h1>

        {/* Toggle Between Login and Sign Up */}
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

        {/* Form Container */}
        <div className="form-container">
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <h2>Log In</h2>
              <div className="form-group">
                <label>Webmail</label>
                <input
                  type="email"
                  name="institutional_email"
                  value={formData.institutional_email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="login-button">Log In</button>
              <p className="forgot-password">Forgot Password?</p>
            </form>
          ) : (
            <form onSubmit={handleSignUp}>
              <h2>Sign Up</h2>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Webmail</label>
                <input
                  type="email"
                  name="institutional_email"
                  value={formData.institutional_email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gmail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="" disabled>Select Role</option>
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="registrar">Registrar</option>
                </select>
              </div>
              {formData.role === 'registrar' && (
                <div className="form-group">
                  <label>Registrar Code</label>
                  <input
                    type="text"
                    name="registrar_code"
                    value={formData.registrar_code}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              {formData.role === 'student' && (
                <>
                  <div className="form-group">
                    <label>Student Number</label>
                    <input
                      type="text"
                      name="student_number"
                      value={formData.student_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Year of Study</label>
                    <input
                      type="number"
                      name="year_of_study"
                      value={formData.year_of_study}
                      onChange={handleChange}
                      min="1"
                      max="5"
                      required
                    />
                  </div>
                </>
              )}
              {formData.role === 'lecturer' && (
                <div className="form-group">
                  <label>Lecturer ID</label>
                  <input
                    type="text"
                    name="lecturer_id"
                    value={formData.lecturer_id}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="signup-button">Sign Up</button>
            </form>
          )}
        </div>

        {/* Error and Success Messages */}
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default Welcome;