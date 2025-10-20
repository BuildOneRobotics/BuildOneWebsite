import React from 'react';
import './Admin.css';

function Admin() {
  return (
    <div className="admin">
      <h1>Admin Control Panel</h1>
      
      <div className="admin-grid">
        <div className="admin-card">
          <h3>📊 Analytics</h3>
          <p className="stat">1,234 Users</p>
          <p className="stat">567 Posts</p>
          <button>View Details</button>
        </div>
        
        <div className="admin-card">
          <h3>👥 User Management</h3>
          <p className="stat">Active: 892</p>
          <p className="stat">New Today: 23</p>
          <button>Manage Users</button>
        </div>
        
        <div className="admin-card">
          <h3>📝 Content</h3>
          <p className="stat">Posts: 567</p>
          <p className="stat">Pending: 12</p>
          <button>Moderate</button>
        </div>
        
        <div className="admin-card">
          <h3>⚙️ Settings</h3>
          <p className="stat">System Status: ✅</p>
          <p className="stat">Uptime: 99.9%</p>
          <button>Configure</button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
