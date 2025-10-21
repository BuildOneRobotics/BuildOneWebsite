import React, { useState, useEffect } from 'react';
import './Admin.css';
import { savePosts, loadPosts } from '../utils/storage';
import { validateAdmin, isSuperAdmin } from '../utils/auth';

const SWEAR_WORDS = ['damn', 'hell', 'crap', 'stupid', 'idiot', 'dumb', 'suck', 'hate'];
const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [userRole, setUserRole] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    setUsername('');
    setPin('');
  }, []);
  const [announcement, setAnnouncement] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState('title');
  const [titleStyle, setTitleStyle] = useState({ color: '#ffffff', fontSize: '16', fontFamily: 'inherit', bold: false, italic: false, underline: false });
  const [descStyle, setDescStyle] = useState({ color: '#ffffff', fontSize: '16', fontFamily: 'inherit', bold: false, italic: false, underline: false });
  
  const currentStyle = editMode === 'title' ? titleStyle : descStyle;
  const setCurrentStyle = editMode === 'title' ? setTitleStyle : setDescStyle;

  useEffect(() => {
    loadPosts().then(data => {
      const cleaned = cleanOldComments(data);
      setPosts(cleaned);
      if (cleaned.length !== data.length) {
        savePosts(cleaned);
      }
    });
  }, []);

  const cleanOldComments = (posts) => {
    const now = Date.now();
    return posts.map(post => {
      if (post.isAnnouncement) return post;
      
      if (post.comments) {
        const validComments = post.comments.filter(c => {
          const commentDate = new Date(c.date).getTime();
          return (now - commentDate) < THREE_MONTHS_MS;
        });
        return { ...post, comments: validComments };
      }
      return post;
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await validateAdmin(username, pin);
    if (result.valid) {
      setIsLoggedIn(true);
      setCurrentUser(result.username);
      setUserRole(result.role);
      setError('');
      localStorage.setItem('adminUser', result.username);
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
      author: currentUser,
      date: new Date().toLocaleDateString(),
      pinned: false,
      isAnnouncement: true,
      titleStyle: {
        color: titleStyle.color,
        fontWeight: titleStyle.bold ? 'bold' : 'normal',
        textDecoration: titleStyle.underline ? 'underline' : 'none',
        fontStyle: titleStyle.italic ? 'italic' : 'normal',
        fontSize: titleStyle.fontSize + 'px',
        fontFamily: titleStyle.fontFamily
      },
      descStyle: {
        color: descStyle.color,
        fontWeight: descStyle.bold ? 'bold' : 'normal',
        textDecoration: descStyle.underline ? 'underline' : 'none',
        fontStyle: descStyle.italic ? 'italic' : 'normal',
        fontSize: descStyle.fontSize + 'px',
        fontFamily: descStyle.fontFamily
      }
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    setAnnouncement('');
    setDescription('');
    setImageUrl('');
    setTitleStyle({ color: '#ffffff', fontSize: '16', fontFamily: 'inherit', bold: false, italic: false, underline: false });
    setDescStyle({ color: '#ffffff', fontSize: '16', fontFamily: 'inherit', bold: false, italic: false, underline: false });
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

  const handleExportData = () => {
    const dataStr = JSON.stringify(posts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forum-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleViewAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  if (!isLoggedIn) {
    return (
      <div className="admin">
        <div className="login-container">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin} autoComplete="off">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
            <input type="password" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} autoComplete="new-password" />
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
        <div>
          <p className="welcome-text">Welcome, {currentUser}</p>
          <span className="role-badge">{userRole === 'super' ? '👑 Super Admin' : '🛡️ Moderator'}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {userRole === 'super' && <div className="announcement-section">
        <h2>Post Announcement</h2>
        
        <div className="edit-mode-selector">
          <button type="button" className={editMode === 'title' ? 'active' : ''} onClick={() => setEditMode('title')}>Format Title</button>
          <button type="button" className={editMode === 'description' ? 'active' : ''} onClick={() => setEditMode('description')}>Format Description</button>
        </div>
        
        <input type="text" placeholder="Announcement title..." value={announcement} onChange={(e) => setAnnouncement(e.target.value)} />
        <textarea placeholder="Description (optional)..." value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
        <input type="text" placeholder="Image URL (optional)..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        
        <div className="text-formatting">
          <p className="format-hint">Formatting {editMode === 'title' ? 'Title' : 'Description'}</p>
          <div className="format-group">
            <label>Color:</label>
            <input type="color" value={currentStyle.color} onChange={(e) => setCurrentStyle({...currentStyle, color: e.target.value})} />
          </div>
          <div className="format-group">
            <label>Size:</label>
            <input type="number" value={currentStyle.fontSize} onChange={(e) => setCurrentStyle({...currentStyle, fontSize: e.target.value})} min="12" max="32" />
          </div>
          <div className="format-group">
            <label>Font:</label>
            <select value={currentStyle.fontFamily} onChange={(e) => setCurrentStyle({...currentStyle, fontFamily: e.target.value})} className="font-select">
              <option value="inherit">Default</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Courier New', monospace">Courier</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Comic Sans MS', cursive">Comic Sans</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </select>
          </div>
          <div className="format-buttons">
            <button type="button" onClick={() => setCurrentStyle({...currentStyle, bold: !currentStyle.bold})} className={currentStyle.bold ? 'active' : ''} style={{fontWeight: 'bold'}}>B</button>
            <button type="button" onClick={() => setCurrentStyle({...currentStyle, italic: !currentStyle.italic})} className={currentStyle.italic ? 'active' : ''} style={{fontStyle: 'italic'}}>I</button>
            <button type="button" onClick={() => setCurrentStyle({...currentStyle, underline: !currentStyle.underline})} className={currentStyle.underline ? 'active' : ''} style={{textDecoration: 'underline'}}>U</button>
          </div>
        </div>
        
        <div className="preview">
          <div style={{color: titleStyle.color, fontWeight: titleStyle.bold ? 'bold' : 'normal', textDecoration: titleStyle.underline ? 'underline' : 'none', fontStyle: titleStyle.italic ? 'italic' : 'normal', fontSize: titleStyle.fontSize + 'px', fontFamily: titleStyle.fontFamily}}>
            <strong>Title:</strong> {announcement || 'Your announcement here...'}
          </div>
          <div style={{color: descStyle.color, fontWeight: descStyle.bold ? 'bold' : 'normal', textDecoration: descStyle.underline ? 'underline' : 'none', fontStyle: descStyle.italic ? 'italic' : 'normal', fontSize: descStyle.fontSize + 'px', fontFamily: descStyle.fontFamily, marginTop: '10px'}}>
            <strong>Description:</strong> {description || 'Your description here...'}
          </div>
        </div>
        
        <button onClick={handlePostAnnouncement}>Post Announcement</button>
      </div>}

      {userRole === 'super' && (
        <div className="super-admin-section">
          <h2>Super Admin Controls</h2>
          <div className="super-controls">
            <button onClick={handleExportData}>📥 Export All Data</button>
            <button onClick={handleViewAnalytics}>📊 View Analytics</button>
            <button onClick={handleClearAll} className="danger-btn">🗑️ Clear All Posts</button>
          </div>
          {showAnalytics && (
            <div className="analytics-panel">
              <h2>Forum Analytics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">{posts.length}</span>
                  <span className="stat-label">Total Posts</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{posts.filter(p => p.isAnnouncement).length}</span>
                  <span className="stat-label">Announcements</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}</span>
                  <span className="stat-label">Total Comments</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{posts.filter(p => p.pinned).length}</span>
                  <span className="stat-label">Pinned Posts</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="moderation-section">
        <div className="mod-header">
          <h2>Moderate Forum Posts</h2>
        </div>
        {posts.length === 0 ? (
          <p className="no-posts">No posts to moderate</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="mod-post">
              <div className="mod-post-header">
                <p className="mod-post-title">{post.title}</p>
                {post.pinned && <span className="pinned-badge">📌 Pinned</span>}
                {post.isAnnouncement && <span className="announcement-badge">📢 Announcement</span>}
              </div>
              <p className="mod-author">By {post.author} • {post.date}</p>
              {post.comments && post.comments.length > 0 && (
                <div className="mod-comments">
                  <p className="comments-header">Comments ({post.comments.length})</p>
                  {post.comments.map((c, i) => (
                    <div key={i} className="mod-comment">
                      <strong>{c.author}</strong>: {c.text}
                      <button onClick={() => handleDeleteComment(post.id, i)} className="delete-comment-btn">Delete</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mod-actions">
                {userRole === 'super' && <button onClick={() => handlePin(post.id)}>{post.pinned ? 'Unpin' : 'Pin'}</button>}
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
