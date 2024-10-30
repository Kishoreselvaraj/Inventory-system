import React, { useState } from 'react'; // Use import statement for React and useState
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Login.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to store error messages
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Reset any previous errors

    try {
      const response = await axios.post('http://localhost:5000/user/login', { email, password }); // Replace with your actual login endpoint
      console.log(response.data); // You can log response data for debugging
      navigate('/dashboard', { state: { email } }); // Redirect to the desired page after login
    } catch (error) {
      // Handle errors from the server
      setError(error.response?.data?.message || 'Login failed. Please try again.'); // Display error message
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form className="login-details" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required // Make the field required
          />
          
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required // Make the field required
          />
          
          <button type="submit" className="login-button">Login</button>
        </form>
        
        {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>} {/* Display error message if any */}
        
        <p className="register-prompt">
          Don't have an account? <a href="/register" className="register-link">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
