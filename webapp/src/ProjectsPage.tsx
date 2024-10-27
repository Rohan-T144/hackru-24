import React from 'react';
import ProjectCard from './components/ProjectCard';

interface Project {
  id: string;
  title: string;
  score: number;
}

const ProjectsPage: React.FC = () => {
  const projects: Project[] = [
    { id: '1', title: 'Project 1', score: 85 },
    { id: '2', title: 'Project 2', score: 92 },
  ];

  return (
    <div className="projects-page">
      <h1>Projects</h1>
      <div className="project-cards">
        {projects.map((project) => (
          <ProjectCard key={project.id} id={project.id} title={project.title} score={project.score} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;