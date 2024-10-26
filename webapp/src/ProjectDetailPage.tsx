import React from 'react';
import { useParams } from 'react-router-dom';
import './ProjectDetailPage.css';

interface AudioFile {
  title: string;
  audioUrl: string;
}

interface Project {
  id: string;
  title: string;
  audioFiles: AudioFile[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Project 1',
    audioFiles: [
      { title: 'Recording 1', audioUrl: '/audio/project1/recording1.mp3' },
      { title: 'Recording 2', audioUrl: '/audio/project1/recording2.mp3' },
    ],
  },
  {
    id: '2',
    title: 'Project 2',
    audioFiles: [
      { title: 'Recording 1', audioUrl: '/audio/project2/recording1.mp3' },
      { title: 'Recording 2', audioUrl: '/audio/project2/recording2.mp3' },
    ],
  },
  // Add more mock projects here
];

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = mockProjects.find((proj) => proj.id == id);

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <div className="project-detail-page">
      <h1>{project.title}</h1>
      <div className="audio-list">
        {project.audioFiles.map((audio, index) => (
          <div key={index} className="audio-item">
            <h4>{audio.title}</h4>
            <audio controls src={audio.audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetailPage;