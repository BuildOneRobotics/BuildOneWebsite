import React, { useState, useEffect } from 'react';
import './Admin.css';
import { savePosts, loadPosts } from '../utils/storage';

const ADMIN_CREDENTIALS = {
  bensteels: '2412',
  ethanpatmore: '1012'
};

const SWEAR_WORDS = ['damn', 'hell', 'crap', 'stupid', 'idiot', 'dumb', 'suck', 'hate'];

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [posts, setPosts] = useState([]);
  const [textColor, setTextColor] = useState('#ffffff');
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [fontSize, setFontSize] = useState('16');

  useEffect(() => {
    loadPosts().then(setPosts);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (ADMIN_CREDENTIALS[username] === pin) {
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
      description: description,
      imageUrl: imageUrl,
      author: username,
      date: new Date().toLocaleDateString(),
      pinned: false,
      isAnnouncement: true,
      style: {
        color: textColor,
        fontWeight: isBold ? 'bold' : 'normal',
        textDecoration: isUnderline ? 'underline' : 'none',
        fontStyle: isItalic ? 'italic' : 'normal',
        fontSize: fontSize + 'px'
      }
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    setAnnouncement('');
    setDescription('');
    setImageUrl('');
    setTextColor('#ffffff');
    setIsBold(false);
    setIsUnderline(false);
    setIsItalic(false);
    setFontSize('16');
  };

  const handlePin = (id) => {
    const updatedPosts = posts.map(p => p.id === id ? {...p, pinned: !p.pinned} : p);
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this post?')) return;
    const updatedPosts = posts.filter(p => p.id !== id);
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  const handleDeleteComment = (postId, commentIndex) => {
    if (!window.confirm('Delete this comment?')) return;
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const comments = [...(p.comments || [])];
        comments.splice(commentIndex, 1);
        return { ...p, comments };
      }
      return p;
    });
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all posts? This cannot be undone!')) return;
    setPosts([]);
    savePosts([]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminUser');
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
      
      <div className="admin-header">
        <h2>Welcome, {username}</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="announcement-section">
        <h2>Post Announcement</h2>
        <input
          type="text"
          placeholder="Announcement title..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />
        <input
          type="text"
          placeholder="Image URL (optional)..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        
        <div className="text-formatting">
          <div className="format-group">
            <label>Color:</label>
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
          </div>
          
          <div className="format-group">
            <label>Size:</label>
            <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} min="12" max="32" />
          </div>
          
          <div className="format-buttons">
            <button onClick={() => setIsBold(!isBold)} className={isBold ? 'active' : ''} style={{fontWeight: 'bold'}}>B</button>
            <button onClick={() => setIsItalic(!isItalic)} className={isItalic ? 'active' : ''} style={{fontStyle: 'italic'}}>I</button>
            <button onClick={() => setIsUnderline(!isUnderline)} className={isUnderline ? 'active' : ''} style={{textDecoration: 'underline'}}>U</button>
          </div>
        </div>
        
        <div className="preview" style={{color: textColor, fontWeight: isBold ? 'bold' : 'normal', textDecoration: isUnderline ? 'underline' : 'none', fontStyle: isItalic ? 'italic' : 'normal', fontSize: fontSize + 'px'}}>
          Preview: {announcement || 'Your announcement here...'}
        </div>
        
        <button onClick={handlePostAnnouncement}>Post Announcement</button>
      </div>

      <div className="moderation-section">
        <div className="mod-header">
          <h2>Moderate Forum Posts</h2>
          {posts.length > 0 && <button onClick={handleClearAll} className="clear-all-btn">Clear All Posts</button>}
        </div>
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
              {post.comments && post.comments.length > 0 && (
                <div className="mod-comments">
                  <h4>Comments ({post.comments.length})</h4>
                  {post.comments.map((c, i) => (
                    <div key={i} className="mod-comment">
                      <strong>{c.author}</strong>: {c.text}
                      <button onClick={() => handleDeleteComment(post.id, i)} className="delete-comment-btn">Delete</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mod-actions">
                <button onClick={() => handlePin(post.id)}>{post.pinned ? 'Unpin' : 'Pin'}</button>
                <button onClick={() => handleDelete(post.id)} className="delete-btn">Delete Post</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
