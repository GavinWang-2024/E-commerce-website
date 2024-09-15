import React, { useState, useEffect } from 'react';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  refresh: string;
  access: string;
}

const LoginView: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      return data.access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      handleLogout();
      return null;
    }
  };


  const customFetch = async (url: string, options: RequestInit = {})=>{
    const accessToken=localStorage.getItem('accessToken');
    const response=await fetch(url,{
      ...options,
      headers:{
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    if(response.status===401){
      const newToken=await refreshAccessToken();
      if(newToken){
        return fetch(url,{
          ...options,
          headers:{
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          },
        });
      }
    }
    return response;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data: LoginResponse = await response.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      setIsLoggedIn(true);
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error("Authentication failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await customFetch('http://127.0.0.1:8000/accounts/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setError('Logout failed. Please try again.');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setCredentials({ username: '', password: '' });
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading && <p>Loading...</p>}
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" value={credentials.username} onChange={handleInputChange} placeholder="Username" required />
          <input type="password" name="password" value={credentials.password} onChange={handleInputChange} placeholder="Password" required />
          <button type="submit" disabled={isLoading}>Login</button>
        </form>
      ) : (
        <div>
          <p>You are logged in</p>
          <button onClick={handleLogout} disabled={isLoading}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default LoginView;