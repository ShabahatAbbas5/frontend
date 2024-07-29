import React from 'react';
import './Header.css'; // Import your CSS file
import logo from '../assets/ssfd-logo.png'; // Example logo import
import { useNavigate, Link } from 'react-router-dom'; // Import Link and useNavigate

function Header() {
  const navigate = useNavigate(); 

  return (
    <header>
       <img 
        src={logo} 
        alt="SSFD Logo" 
        onClick={() => navigate('/')} // Add onClick handler
      />
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li> {/* Use Link for navigation */}
          <li><Link to="/about">About</Link></li> {/* Use Link for navigation */}
          <li><Link to="/resources">Resources</Link></li>
          <li><Link to="/prevention">Prevention</Link></li>
          <li><Link to="/education">Education</Link></li>
          <li><Link to="/permits">Permits</Link></li>
          <li><Link to="/news">News</Link></li>
          <li><Link to="/public-records">Public Records</Link></li>
          <li><Link to="/elections">Elections</Link></li>
          <li><Link to="/recruitment-and-hiring">Recruitment & Hiring</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
