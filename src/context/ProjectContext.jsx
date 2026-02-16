import { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const value = {
    projects,
    setProjects,
    loading,
    setLoading,
    selectedProject,
    setSelectedProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};