// app/page.tsx
'use client'; // Penting: Komponen ini menggunakan Hooks (useState, useRouter)

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Perubahan: useRouter dari 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (username === 'administrator' && password === '12345678') {
      router.push('/loans');
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen font-sans p-4 mt-8">
      <h1 className="text-4xl font-bold text-white mb-8">Login</h1>
      <form onSubmit={handleSubmit} className="bg-gray-300 p-10 rounded-lg shadow-xl w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-800 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          />
        </div>
        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out"
        >
          Login
        </button>
      </form>
    </div>
  );
}