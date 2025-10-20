import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>BuildOne Robotics</h1>
        <p className="subtitle">Innovating the Future of Automation</p>
        <p className="description">We build cutting-edge robotic solutions that transform industries and empower businesses.</p>
      </div>
      
      <div className="features">
        <div className="card">
          <h3>🤖 Advanced Robotics</h3>
          <p>State-of-the-art robotic systems designed for precision and efficiency</p>
        </div>
        <div className="card">
          <h3>⚡ Automation</h3>
          <p>Streamline your operations with intelligent automation solutions</p>
        </div>
        <div className="card">
          <h3>🔧 Custom Solutions</h3>
          <p>Tailored robotic systems to meet your specific business needs</p>
        </div>
      </div>


    </div>
  );
}

export default Home;
