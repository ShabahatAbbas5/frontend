import React from 'react';
import './Footer.css'; // Import the Footer CSS file

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} South Summit Fire District</p>
        {/* Add more footer content (e.g., contact info, links) */}
      </div>
    </footer>
  );
}

export default Footer;

