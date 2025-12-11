import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Load projects from admin configuration
    const saved = localStorage.getItem('projects-config');
    if (saved) {
      const projectsConfig = JSON.parse(saved);
      const projectsArray = Object.entries(projectsConfig).map(([id, project]) => ({
        id,
        ...project
      }));
      setProjects(projectsArray);
    } else {
      // Default projects if none configured
      setProjects([
        {
          id: 'rusty-lighthouse',
          title: 'The Rusty LightHouse',
          description: 'A modern lighthouse management system built with Rust',
          status: 'Active'
        },
        {
          id: 'rusty-developer-studio',
          title: 'Rusty-Developer-Studio',
          description: 'Comprehensive development environment for Rust projects',
          status: 'In Development'
        }
      ]);
    }
  }, []);

  return (
    <div className="projects">
      <div className="projects-header">
        <h1>Projects</h1>
        <p>Explore our innovative solutions and development work</p>
      </div>
      
      <div className="projects-grid">
        {projects.map(project => (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`} 
            className="project-card"
          >
            <div className="project-status">{project.status}</div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Projects;