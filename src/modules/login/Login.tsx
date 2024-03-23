import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";

interface LoginResponse {
  data: {
    token: string;
  }
}

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post<LoginResponse>(
        'http://localhost/api/user/login/',
        { email, password }
      );
      const token = response.data.data.token;
      localStorage.setItem('token', token);
    } catch (error) {
      setError("Invalid name or password");
      console.log("Login failed: ", error);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login;
