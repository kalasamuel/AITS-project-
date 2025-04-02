import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
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
    role: 'student',
    registrar_code: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const { name, value } = e.target;
  
    if (name === "year_of_study") {
      let newValue = parseInt(value, 10);
      if (isNaN(newValue) || newValue < 1 || newValue > 5) return;
    }
  
    setFormData({ ...formData, [name]: value });
  };
  

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.institutional_email === formData.institutional_email && user.password === formData.password);

    if (user) {
      alert(`Welcome back, ${user.first_name} ${user.last_name}!`);
      setIsAuthenticated(true);
      navigate('/');
    } else {
      setError('Invalid email or password!');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.first_name || !formData.last_name || !formData.institutional_email || !formData.email || !formData.password || !formData.confirm_password) {
      setError('All fields are required.');
      return;
    }
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

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status === 201) {
        setMessage('Registration successful! Check your email for verification.');
        setTimeout(() => setIsLogin(true), 3000);
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to AITS</h1>
      <div className="toggle-container">
        <button className={`toggle-button ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Log In</button>
        <button className={`toggle-button ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
      </div>
      <div className="form-container">
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <h2>Log In</h2>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="institutional_email" value={formData.institutional_email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="login-button">Log In</button>
            <p className="forgot-password">Forgot Password?</p>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Webmail</label>
              <input type="email" name="institutional_email" value={formData.institutional_email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gmail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="registrar">Registrar</option>
              </select>
            </div>
            {formData.role === 'registrar' && (
              <div className="form-group">
                <label>Registrar Code</label>
                <input type="text" name="registrar_code" value={formData.registrar_code} onChange={handleChange} required />
              </div>
            )}
            {formData.role === "student" && (
              <>
                <div>
                  <label className="block font-medium">Student Number</label>
                  <input 
                    type="text" 
                    name="student_number" 
                    value={formData.student_number} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded" 
                  />
                </div>

                <div>
                  <label className="block font-medium">Year of Study</label>
                  <input 
                    type="number" 
                    name="year_of_study" 
                    value={formData.year_of_study} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded" 
                    min="1" 
                    max="5"
                    onInput={(e) => {
                      if (e.target.value < 1) e.target.value = 1;
                      if (e.target.value > 5) e.target.value = 5;
                    }}
                  />
                </div>
              </>
            )}
            {formData.role === "lecturer" && (
              <div>
                <label className="block font-medium">Lecturer ID</label>
                <input type="text" name="lecturer_id" value={formData.lecturer_id} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            )}

            {/* Password Fields */}
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
            </div>
            <button type="submit" className="signup-button">Sign Up</button>
          </form>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default Welcome;
