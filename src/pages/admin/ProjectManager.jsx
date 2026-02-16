import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects?limit=100');
      setProjects(response.data.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.projectName.toLowerCase().includes(search.toLowerCase()) ||
      project.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? project.status === filter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="container-custom py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-heading font-bold">Manage Projects</h1>
            <Link to="/admin/projects/new" className="btn-primary flex items-center gap-2">
              <FaPlus /> Add New Project
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <FaSearch className="inline mr-2" />
                Search Projects
              </label>
              <input
                type="text"
                placeholder="Search by name or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input"
              >
                <option value="">All Status</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Finished">Finished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="spinner mx-auto"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No projects found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Project Name</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project._id}>
                      <td>
                        {project.images?.[0] ? (
                          <img
                            src={project.images[0].url}
                            alt={project.projectName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded"></div>
                        )}
                      </td>
                      <td className="font-medium">{project.projectName}</td>
                      <td>{project.company}</td>
                      <td>
                        {project.address.area}, {project.address.city}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            project.status === 'Ongoing'
                              ? 'badge-ongoing'
                              : 'badge-finished'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td>{new Date(project.startDate).toLocaleDateString()}</td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            to={`/projects/${project.slug}`}
                            className="text-blue-600 hover:text-blue-800"
                            title="View"
                          >
                            <FaEye size={18} />
                          </Link>
                          <Link
                            to={`/admin/projects/edit/${project._id}`}
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(project._id, project.projectName)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;