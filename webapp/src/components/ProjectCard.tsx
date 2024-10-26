import React from 'react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  id: string;
  title: string;
  score: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, score }) => {
  return (
    <Link to={`/projects/${id}`} className="project-card-link">
      <div className="project-card">
        <h3>{title}</h3>
        <p>Best Score: {score}</p>
      </div>
    </Link>
  );
};

export default ProjectCard;