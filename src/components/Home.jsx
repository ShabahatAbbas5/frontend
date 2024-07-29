import React from 'react';
import './Home.css'; // Import the CSS file
import SSFD from  '../assets/ssfd01.jpg'; // Import the image

function Home() {
  return (
    <div className="home">
      <h2>South Summit Fire Protection District</h2>
      <p>This site is currently under Maintanence</p>
      {/* Example image */}
      <img src={SSFD} alt="South Summit Fire Protection District" />
    </div>
  );
}

export default Home;