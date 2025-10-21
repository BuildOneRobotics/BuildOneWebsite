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

  useEffect(() => {
    loadPosts().then(data => {
      const cleaned = cleanOldComments(data);
      setPosts(cleaned.sort((a, b) => b.pinned - a.pinned));
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
                {post.isHTML ? (
                  <h2 dangerouslySetInnerHTML={{__html: post.title}} />
                ) : (
                  <h2 style={post.titleStyle || post.style || {}}>{post.title}</h2>
                )}
                {post.pinned && <span className="pin-badge">📌</span>}
                {post.isAnnouncement && <span className="announcement-badge">📢</span>}
              </div>
              <span className="author">By {post.author} • {post.date}</span>
              {post.description && (
                post.isHTML ? (
                  <div className="post-description" dangerouslySetInnerHTML={{__html: post.description}} />
                ) : (
                  <p className="post-description" style={post.descStyle || post.style || {}}>{post.description}</p>
                )
              )}
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
