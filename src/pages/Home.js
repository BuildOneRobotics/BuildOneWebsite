import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>BuildOne</h1>
        <p className="subtitle">Building the Future of Technology</p>
        <p className="description">We create innovative solutions that transform ideas into reality through cutting-edge development and thoughtful design.</p>
      </div>
      
      <div className="features">
        <div className="card">
          <h2>Advanced Development</h2>
          <p>Modern development practices with robust, scalable solutions built for the future</p>
        </div>
        <div className="card">
          <h2>Innovation Focus</h2>
          <p>Pushing boundaries with creative approaches to complex technical challenges</p>
        </div>
        <div className="card">
          <h2>Quality Assurance</h2>
          <p>Rigorous testing and optimization to ensure reliable, high-performance results</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
