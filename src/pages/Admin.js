import React, { useState, useEffect } from 'react';
import './Admin.css';

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if ((username === 'bensteels' && pin === '2412') || (username === 'ethanpatmore' && pin === '1012')) {
      setIsLoggedIn(true);
      setError('');
      localStorage.setItem('adminUser', username);
    } else {
      setError('Invalid username or pin');
    }
  };

  const handlePostAnnouncement = () => {
    if (!announcement.trim()) return;
    const newPost = {
      id: Date.now(),
      title: announcement,
      author: username,
      date: new Date().toLocaleDateString(),
      pinned: false,
      isAnnouncement: true
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    setAnnouncement('');
  };

  const handlePin = (id) => {
    const updatedPosts = posts.map(p => p.id === id ? {...p, pinned: !p.pinned} : p);
    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
  };

  const handleDelete = (id) => {
    const updatedPosts = posts.filter(p => p.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
  };

  if (!isLoggedIn) {
    return (
      <div className="admin">
        <div className="login-container">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <h1>Admin Control Panel</h1>
      
      <div className="announcement-section">
        <h2>Post Announcement</h2>
        <input
          type="text"
          placeholder="Announcement title..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
        />
        <button onClick={handlePostAnnouncement}>Post Announcement</button>
      </div>

      <div className="moderation-section">
        <h2>Moderate Forum Posts</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No posts to moderate</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="mod-post">
              <div className="mod-post-header">
                <h3>{post.title}</h3>
                {post.pinned && <span className="pinned-badge">📌 Pinned</span>}
                {post.isAnnouncement && <span className="announcement-badge">📢 Announcement</span>}
              </div>
              <p className="mod-author">By {post.author} • {post.date}</p>
              <div className="mod-actions">
                <button onClick={() => handlePin(post.id)}>{post.pinned ? 'Unpin' : 'Pin'}</button>
                <button onClick={() => handleDelete(post.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
