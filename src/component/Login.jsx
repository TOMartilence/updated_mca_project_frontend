import { useState } from 'react';
function Login({ onLoginSuccess }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
  
    const handleChange = (e) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok && result.token) {
          onLoginSuccess(result.token); // Store JWT and trigger Main view
        } else {
          alert('Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    };
  
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  export default Login;
  