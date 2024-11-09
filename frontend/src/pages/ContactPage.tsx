// src/pages/ContactPage.tsx

import React, { useState } from 'react';
import Layout from '../components/Layout';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);

    // Clear form fields after submit
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <Layout>
        <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Contact Us</h2>
                <p className="mt-2 text-sm text-gray-600">
                    We'd love to hear from you! Fill out the form below to get in touch.
                </p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
                {success && (
                    <p className="text-green-500 text-center mb-4">Thank you for reaching out! We'll get back to you soon.</p>
                )}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                    </label>
                    <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Your Name"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                    </label>
                    <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                    </label>
                    <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Write your message here..."
                    rows={4}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Send Message
                </button>
                </form>
            </div>
        </div>
    </Layout>
  );
};

export default ContactPage;
