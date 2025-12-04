import React from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../data/Reviews';
import { diseases } from '../data/diseases';
const Landing = () => {
  return (
    <div className="landing-page">
      <header className="hero">
        <h1>Welcome to Our Hospital</h1>
        <p>Your health is our priority. Connect with specialists and manage your health tests efficiently.</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </header>

      <section className="services-section">
        <h2>Our rev</h2>
        <div className="services-grid">
          {diseases.map((r) => (
            <div key={r.name} className="service-card">
              <h3>{r.name}</h3>
              <p>{r.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          {reviews.map((r) => (
            <div key={r.name} className="service-card">
              <h3>{r.name}</h3>
              <p>{r.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;

