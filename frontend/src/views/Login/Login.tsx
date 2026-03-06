'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { LoginDTO } from '@/http/DTO/LoginDTO'; // Assuming LoginDTO is correctly imported from its path

export default function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: LoginDTO = { name: username, password };
    try {
      const response = await ApiService.login(credentials);
      // Assuming ApiService.login returns a UserOutputDTO or similar on success
      toast.success('Login successful!');
      console.log('Login successful:', response);
      window.location.href = '/';
      // TODO: Handle successful login, e.g., store token, redirect to dashboard
      // For now, just log and show a toast.
    } catch (error) {
      // The ApiService interceptor will handle displaying the toast for API errors.
      // You can add additional specific error handling here if needed.
      console.error('Login failed:', error);
      // toast.error('Login failed. Please check your credentials.'); // This would be redundant due to the interceptor
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Need an account?{" "}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Create user
          </Link>
        </div>
      </div>
    </div>
  );
}
