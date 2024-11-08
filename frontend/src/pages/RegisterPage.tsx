// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Define the expected shape of the error response
interface ErrorResponse {
  error: string;
}

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State to indicate loading
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      const response = await axios.post('/api/auth/register', { username, email, password });
      if (response.status === 201) {
        navigate('/login'); // Redirect to login page on success
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.error || 'Registration failed'); // Set the error message
    } finally {
      setLoading(false); // Stop loading after request
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-8 max-w-md shadow-lg rounded-lg bg-white mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">Create an Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            required
          />
          <button
            type="submit"
            className={`w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default RegisterPage;
