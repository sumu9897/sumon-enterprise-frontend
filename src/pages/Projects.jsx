import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter } from 'react-icons/fa';
import projectsData from '../data/projects.json'; // ← import your JSON file

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    company: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, [filters, pagination.page]);

  const fetchProjects = () => {
    try {
      setLoading(true);

      // 1. Filter the imported JSON data
      let filtered = projectsData.filter((project) => {
        const matchStatus =
          !filters.status ||
          project.status.toLowerCase() === filters.status.toLowerCase();

        const matchCompany =
          !filters.company ||
          (project.company &&
            project.company
              .toLowerCase()
              .includes(filters.company.toLowerCase()));

        const matchSearch =
          !filters.search ||
          project.projectName
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          (project.company &&
            project.company
              .toLowerCase()
              .includes(filters.search.toLowerCase())) ||
          (project.address.area &&
            project.address.area
              .toLowerCase()
              .includes(filters.search.toLowerCase())) ||
          (project.address.city &&
            project.address.city
              .toLowerCase()
              .includes(filters.search.toLowerCase()));

        return matchStatus && matchCompany && matchSearch;
      });

      // 2. Paginate the filtered results
      const total = filtered.length;
      const pages = Math.ceil(total / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginated = filtered.slice(startIndex, startIndex + pagination.limit);

      setProjects(paginated);
      setPagination((prev) => ({ ...prev, total, pages }));
    } catch (error) {
      toast.error('Failed to load projects');
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({ status: '', company: '', search: '' });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Our Projects
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our portfolio of completed and ongoing construction projects
            across Bangladesh
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <FaFilter className="inline mr-2" />
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input"
              >
                <option value="">All Status</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Finished">Finished</option>
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Company
              </label>
              <input
                type="text"
                placeholder="Filter by company..."
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                className="input"
              />
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <FaSearch className="inline mr-2" />
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, city, area..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.status || filters.company || filters.search) && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          {loading ? (
            'Loading...'
          ) : (
            <>
              Showing {projects.length} of {pagination.total} projects
            </>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">
              No projects found matching your criteria.
            </p>
            <button onClick={clearFilters} className="btn-primary mt-4">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="card group"
                >
                  {/* Project Image */}
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    {project.images?.[0] ? (
                      <img
                        src={project.images[0].url}
                        alt={project.projectName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                      {project.projectName}
                    </h3>

                    {project.company && (
                      <p className="text-gray-600 mb-2 line-clamp-1">
                        {project.company}
                      </p>
                    )}

                    <p className="text-sm text-gray-500 mb-1">
                      {[project.address.area, project.address.city]
                        .filter(Boolean)
                        .join(', ')}
                    </p>

                    {project.address.plot && (
                      <p className="text-xs text-gray-400 mb-3">
                        Plot {project.address.plot}
                        {project.address.road && `, Road ${project.address.road}`}
                        {project.address.block && `, Block ${project.address.block}`}
                      </p>
                    )}

                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span
                        className={`badge ${
                          project.status === 'Ongoing'
                            ? 'badge-ongoing'
                            : 'badge-finished'
                        }`}
                      >
                        {project.status}
                      </span>

                      <div className="text-right text-xs text-gray-500">
                        {project.specifications?.floors && (
                          <span className="block">{project.specifications.floors}</span>
                        )}
                        <span>
                          {project.startDate}
                          {project.finishDate ? ` – ${project.finishDate}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn btn-outline disabled:opacity-50"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {[...Array(pagination.pages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-10 h-10 rounded ${
                        pagination.page === index + 1
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="btn btn-outline disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;