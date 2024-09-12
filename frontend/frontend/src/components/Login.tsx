import React, { useState } from 'react';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  refresh: string;
  access: string;
}

interface ErrorResponse {
  error: string;
}

const LoginView: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [isLoggedIn,setIsLoggedIn]=useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Sending login request:", credentials);
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      const data: LoginResponse = await response.json();
      console.log("Login successful:", data);



    } catch (error) {
      if (error instanceof Error) {
        console.log("Authentication failed:", error.message);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" value={credentials.username} onChange={handleInputChange} placeholder="Username" required />
      <input type="password" name="password" value={credentials.password} onChange={handleInputChange} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginView;