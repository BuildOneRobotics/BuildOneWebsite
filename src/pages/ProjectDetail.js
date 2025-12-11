import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProjectDetail.css';

function ProjectDetail() {
  const { projectId } = useParams();
  
  // Editable content state
  const [content, setContent] = useState({
    'rusty-lighthouse': {
      title: 'The Rusty LightHouse',
      article: 'Enter your article content about The Rusty LightHouse here...',
      image: ''
    },
    'rusty-developer-studio': {
      title: 'Rusty-Developer-Studio',
      article: 'Enter your article content about Rusty-Developer-Studio here...',
      image: ''
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content[projectId] || {});

  const handleSave = () => {
    setContent(prev => ({
      ...prev,
      [projectId]: editContent
    }));
    setIsEditing(false);
    // Save to localStorage
    localStorage.setItem('project-content', JSON.stringify({
      ...content,
      [projectId]: editContent
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditContent(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    // Load saved content
    const saved = localStorage.getItem('project-content');
    if (saved) {
      const parsedContent = JSON.parse(saved);
      setContent(parsedContent);
      setEditContent(parsedContent[projectId] || content[projectId]);
    } else {
      setEditContent(content[projectId]);
    }
  }, [projectId]);

  const currentContent = content[projectId];

  if (!currentContent) {
    return (
      <div className="project-detail">
        <div className="project-not-found">
          <h1>Project Not Found</h1>
          <Link to="/projects">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <div className="project-header">
        <Link to="/projects" className="back-link">← Back to Projects</Link>
        <div className="project-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit Content
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          )}
        </div>
      </div>

      <article className="project-article">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editContent.title}
              onChange={(e) => setEditContent(prev => ({ ...prev, title: e.target.value }))}
              className="title-input"
              placeholder="Project title"
            />
            
            <div className="image-upload">
              <label htmlFor="image-upload">Upload Image:</label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {editContent.image && (
                <div className="image-preview">
                  <img src={editContent.image} alt="Preview" />
                </div>
              )}
            </div>

            <textarea
              value={editContent.article}
              onChange={(e) => setEditContent(prev => ({ ...prev, article: e.target.value }))}
              className="article-input"
              placeholder="Write your article content here..."
              rows={15}
            />
          </div>
        ) : (
          <div className="article-content">
            <h1>{currentContent.title}</h1>
            
            {currentContent.image && (
              <div className="article-image">
                <img src={currentContent.image} alt={currentContent.title} />
              </div>
            )}
            
            <div className="article-text">
              {currentContent.article.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

export default ProjectDetail;