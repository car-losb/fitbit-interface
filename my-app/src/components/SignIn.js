import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

// FitBit API Specification Imports
// import requests
// import fitbit

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // Dummy authentication logic
    if (email === 'jane.doe@gmail.com' && password === '1234') {
      // FitBit API OAuth 2.0 Specification
        // access_token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1MzM0giLCJzdWIiOiJCWlk4NUIiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJlY2cgcnNldCByb3h5IHJwcm8gcm51dCByc2xlIHJjZiByYWN0IHJyZXMgcmxvYyByd2VpIHJociBydGVtIiwiZXhwIjoxNzQ0ODEwMDY2LCJpYXQiOjE3MTMyNzQwNjZ9.CaQwg7LEjcu2yLr_ClxtzDpcQ-QFfRZ0-eMt-1E5TRg"
        // consumer_secret: "69cf6cb557b303414cf57660f0d6d94b"
        // header = {'Authorization' : 'Bearer {}'.format(access_token)}
      // if (authentication returns !NULL) => direct to health report page
        // Direct patient to Health Report page
        navigate('/health-report');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="SignIn">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
