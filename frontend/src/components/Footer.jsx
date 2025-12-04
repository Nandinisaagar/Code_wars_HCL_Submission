import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Hospital App. All rights reserved.</p>
      <p>Providing quality care for everyone.</p>
    </footer>
  );
};

export default Footer;

