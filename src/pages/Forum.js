import React, { useState, useEffect } from 'react';
import './Forum.css';
import { savePosts, loadPosts } from '../utils/storage';

const SWEAR_WORDS = ['damn', 'hell', 'crap', 'stupid', 'idiot', 'dumb', 'suck', 'hate', 'fuck', 'shit', 'ass', 'bitch', 'bastard'];
const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;

function Forum() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const migrateOldPosts = async () => {
      const oldPosts = localStorage.getItem('forumPosts');
      if (oldPosts) {
        const posts = JSON.parse(oldPosts);
        if (posts.length > 0) {
          await fetch('https://buildonerobotics.vercel.app/api/migrate-posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ posts })
          });
        }
      }
    };

    migrateOldPosts();

    fetch('https://buildonerobotics.vercel.app/api/posts')
      .then(res => res.json())
      .then(data => {
        const cleaned = cleanOldComments(data);
        setPosts(cleaned.sort((a, b) => b.pinned - a.pinned));
      })
      .catch(() => {
        loadPosts().then(data => {
          const cleaned = cleanOldComments(data);
          setPosts(cleaned.sort((a, b) => b.pinned - a.pinned));
        });
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

  const filterSwearWords = (text) => {
    let filtered = text;
    SWEAR_WORDS.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '***');
    });
    return filtered;
  };

  const handleAddComment = (postId) => {
    if (!comment.trim() || !guestName.trim()) {
      setError('Please enter your name and comment');
      return;
    }
    
    const filteredComment = filterSwearWords(comment);
    const filteredName = filterSwearWords(guestName);
    
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const comments = p.comments || [];
        return {
          ...p,
          comments: [...comments, { author: filteredName, text: filteredComment, date: new Date().toLocaleString() }]
        };
      }
      return p;
    });
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    setComment('');
    setError('');
  };

  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'announcements' && post.isAnnouncement) ||
                           (filterType === 'discussions' && !post.isAnnouncement);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'mostComments':
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        default: // newest
          return new Date(b.date) - new Date(a.date);
      }
    });

  return (
    <div className="forum">
      <div className="forum-header">
        <h1>Community Forum</h1>
        <p>Join the conversation and connect with our community</p>
      </div>
      
      <div className="forum-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="forum-filters">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostComments">Most Comments</option>
          </select>
          
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
            <option value="all">All Posts</option>
            <option value="announcements">Announcements</option>
            <option value="discussions">Discussions</option>
          </select>
        </div>
      </div>
      
      <div className="forum-stats">
        <div className="stat">
          <span className="stat-number">{posts.length}</span>
          <span className="stat-label">Total Posts</span>
        </div>
        <div className="stat">
          <span className="stat-number">{posts.filter(p => p.isAnnouncement).length}</span>
          <span className="stat-label">Announcements</span>
        </div>
        <div className="stat">
          <span className="stat-number">{posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}</span>
          <span className="stat-label">Comments</span>
        </div>
      </div>
      
      <div className="forum-posts">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="no-posts">
            {searchTerm || filterType !== 'all' ? (
              <div>
                <p>No posts match your search criteria.</p>
                <button onClick={() => { setSearchTerm(''); setFilterType('all'); }}>Clear Filters</button>
              </div>
            ) : (
              <p>No posts yet. Check back soon!</p>
            )}
          </div>
        ) : (
          filteredAndSortedPosts.map(post => (
            <div key={post.id} className="post-card" onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}>
              <div className="post-header">
                <h2 style={post.titleStyle || post.style || {}}>{post.title}</h2>
                {post.pinned && <span className="pin-badge">📌</span>}
                {post.isAnnouncement && <span className="announcement-badge">📢</span>}
              </div>
              <span className="author">By {post.author} • {post.date}</span>
              {post.description && <p className="post-description" style={post.descStyle || post.style || {}}>{post.description}</p>}
              {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
              
              {selectedPost === post.id && (
                <div className="comments-section">
                  <h3>Comments</h3>
                  {post.comments && post.comments.map((c, i) => (
                    <div key={i} className="comment">
                      <strong>{c.author}</strong>: {c.text}
                      <span className="comment-date">{c.date}</span>
                    </div>
                  ))}
                  <div className="add-comment">
                    {error && <p className="comment-error">{error}</p>}
                    <input
                      type="text"
                      placeholder="Your name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={(e) => { e.stopPropagation(); handleAddComment(post.id); }}>Comment</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Forum;
