import React from 'react';
import { Link } from 'react-router-dom';
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
        <h2>Our Services</h2>
        <div className="services-grid">
          {diseases.map((service) => (
            <div key={service.name} className="service-card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;

