'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ApiService from '@/http/axios-connector/axiosConnector';
import { CreateUserDTO } from '@/http/DTO/CreateUserDTO'; // Assuming CreateUserDTO is correctly imported from its path
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function RegisterView() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const userData: CreateUserDTO = { name:username, email, password }; // Assuming CreateUserDTO has these fields

    try {
      const response = await ApiService.createUser(userData);
      // Assuming ApiService.createUser returns a boolean or user data on success
      toast.success('User created successfully!');
      console.log('User created:', response);
      router.push('/login'); // Redirect to login page after successful registration
    } catch (error) {
      // The ApiService interceptor will handle displaying the toast for API errors.
      console.error('Registration failed:', error);
      // toast.error('Registration failed. Please try again.'); // Redundant due to interceptor
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Create an Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
