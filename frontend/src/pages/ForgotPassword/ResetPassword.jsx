import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');


  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password/reset-password`, { token, password });
      alert('Password changed successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const serverMessage = error.response.data.message;
        if (serverMessage.includes("expired")) {
          alert("Your reset link has expired. Please request a new one.");
          setMessage("The reset link has expired.");
        } else {
          alert("Invalid reset token. Please request a new one.");
          setMessage("Invalid reset token.");
        }
      } else {
        setMessage('Failed to change password. Please try again later.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-500 p-4">
      <div className="bg-gray-300 p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-center font-bold">Change Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col mt-4">
          <label htmlFor="password" className="font-bold mb-1">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded p-2 w-full mb-2 outline-none"
          />
          <label htmlFor="confirmPassword" className="font-bold mb-1">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="border rounded p-2 w-full mb-2 outline-none"
          />
          <button type="submit" className="bg-green-700 text-white rounded px-4 py-2">Change Password</button>
        </form>
        {message && <p className="mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;