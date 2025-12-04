import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { diseases } from '../data/diseases';

const API = import.meta.env.VITE_REACT_API || ''

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [specialization, setSpecialization] = useState(diseases[0].name);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role, specialization }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Failed to signup');
      }
    } catch (err) {
      setError('Failed to signup');
    }
  };

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        {role === 'doctor' && (
          <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} required>
            {diseases.map(d => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit">Signup</button>
      </form>
      <p className="link-text">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup;

