import React from 'react';
import './News.css';

function News() {
  return (
    <section id="News">
         {/* Wrap the section with Link */}
        <h2>South Summit Fire Protection District News</h2>
        <p>2024 Open Burn Permit Information</p>

         {/* Link to the PDF */}
      <a 
        href="/Burn-Permit-info.pdf" 
        download="2024 Open Burn Permit Information.pdf"
        className="download-link" // (Optional) For styling
      >
        Download Permit Information
      </a>
    </section>
  );
}

export default News;
