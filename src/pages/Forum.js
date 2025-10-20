import React, { useState, useEffect } from 'react';
import './Forum.css';

function Forum() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts);
      setPosts(parsed.sort((a, b) => b.pinned - a.pinned));
    }
  }, []);

  const handleAddComment = (postId) => {
    if (!comment.trim() || !guestName.trim()) return;
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const comments = p.comments || [];
        return {
          ...p,
          comments: [...comments, { author: guestName, text: comment, date: new Date().toLocaleString() }]
        };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    setComment('');
  };

  return (
    <div className="forum">
      <h1>Community Forum</h1>
      
      <div className="forum-posts">
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet. Check back soon!</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card" onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}>
              <div className="post-header">
                <h3 style={post.style || {}}>{post.title}</h3>
                {post.pinned && <span className="pin-badge">📌</span>}
                {post.isAnnouncement && <span className="announcement-badge">📢</span>}
              </div>
              <span className="author">By {post.author} • {post.date}</span>
              
              {selectedPost === post.id && (
                <div className="comments-section">
                  <h4>Comments</h4>
                  {post.comments && post.comments.map((c, i) => (
                    <div key={i} className="comment">
                      <strong>{c.author}</strong>: {c.text}
                      <span className="comment-date">{c.date}</span>
                    </div>
                  ))}
                  <div className="add-comment">
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
