import React, { useEffect, useRef } from 'react';
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

  // const projects = useRef<any>(projects_mock);

  // useEffect(() => {
  //   fetch('/api/sample1/get_project_documents')
  //     .then((response) => {
  //       console.log(response);
  //       response.text().then((text) => console.log(text))
  //       response.json()
  //     })
  //     .then((data) => {
  //       projects.current.push(data);
  //       console.log(data);
  //       console.log(projects.current);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching projects:', error);
  //     });
  // }, []);

  return (
    <div className="projects-page">
      <h1>Projects</h1>
      <div className="project-cards">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} id={project.id} title={project.title} score={project.score} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;