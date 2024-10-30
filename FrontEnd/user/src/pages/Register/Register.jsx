import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.scss';

function Register() {
  const [stallName, setStallName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    // console.log(stallName,email,password)
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    try {
       await axios.post('https://inventory-system-vert.vercel.app/user/register', { stallName, email, password });
      setMessage({ type: "success", text: "Registered successfully!" });
      navigate('/login');
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Registration failed" });
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Register Your Stall</h2>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <label>Stall Name:</label>
        <input 
          type="text" 
          value={stallName} 
          onChange={(e) => setStallName(e.target.value)} 
          required 
        />
        
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <label>Confirm Password:</label>
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
}

export default Register;
