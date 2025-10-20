import React from 'react';
import './Forum.css';

function Forum() {
  return (
    <div className="forum">
      <h1>Community Forum</h1>
      
      <div className="forum-posts">
        <div className="post-card">
          <h3>Welcome to BuildOne Forum</h3>
          <p>Share ideas, ask questions, and connect with the community.</p>
          <span className="author">Admin • 2 days ago</span>
        </div>
        
        <div className="post-card">
          <h3>Latest Robotics Updates</h3>
          <p>Check out our newest automation solutions and features.</p>
          <span className="author">BuildOne Team • 5 days ago</span>
        </div>
        
        <div className="post-card">
          <h3>Feature Requests</h3>
          <p>Tell us what features you'd like to see in future releases.</p>
          <span className="author">Community • 1 week ago</span>
        </div>
      </div>
      
      <button className="new-post-btn">Create New Post</button>
    </div>
  );
}

export default Forum;
