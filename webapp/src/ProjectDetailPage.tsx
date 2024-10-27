import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProjectDetailPage.css';
import Popup from './components/Popup-Project'; // Adjust the path as necessary

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
    const project = mockProjects.find((proj) => proj.id === id);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

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
            <button onClick={togglePopup}>Show More Info</button> {/* Only one button here */}
        <div>
        <Popup
        content={
            <div>
                <h2>Additional Information</h2>
                <p>This is some additional content related to {project.title}.</p>
                <p>You can customize this section with any relevant details.</p>
            </div>
        }
        isOpen={isPopupOpen}
        onClose={togglePopup}
        />
        </div>
        </div>
    );
};

export default ProjectDetailPage;