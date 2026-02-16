import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { FaSave, FaTimes } from 'react-icons/fa';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    projectName: '',
    company: '',
    description: '',
    'address.plot': '',
    'address.road': '',
    'address.block': '',
    'address.area': '',
    'address.city': 'Dhaka',
    status: 'Ongoing',
    startDate: '',
    finishDate: '',
    'specifications.floors': '',
    'specifications.areaPerFloor': '',
    'specifications.totalArea': '',
    'specifications.constructionType': '',
    featured: false,
    longitude: '90.4125',
    latitude: '23.8103',
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProject, setFetchingProject] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setFetchingProject(true);
      const response = await api.get(`/projects/${id}`);
      const project = response.data.data;

      setFormData({
        projectName: project.projectName,
        company: project.company,
        description: project.description,
        'address.plot': project.address.plot || '',
        'address.road': project.address.road || '',
        'address.block': project.address.block || '',
        'address.area': project.address.area,
        'address.city': project.address.city,
        status: project.status,
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        finishDate: project.finishDate ? project.finishDate.split('T')[0] : '',
        'specifications.floors': project.specifications?.floors || '',
        'specifications.areaPerFloor': project.specifications?.areaPerFloor || '',
        'specifications.totalArea': project.specifications?.totalArea || '',
        'specifications.constructionType': project.specifications?.constructionType || '',
        featured: project.featured,
        longitude: project.location?.coordinates?.[0] || '90.4125',
        latitude: project.location?.coordinates?.[1] || '23.8103',
      });
    } catch (error) {
      toast.error('Failed to load project');
    } finally {
      setFetchingProject(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== '' && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    // Append images
    images.forEach((image) => {
      data.append('images', image);
    });

    try {
      setLoading(true);
      if (isEditMode) {
        await api.put(`/projects/${id}`, data);
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', data);
        toast.success('Project created successfully');
      }
      navigate('/admin/projects');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProject) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="container-custom py-6">
          <h1 className="text-3xl font-heading font-bold">
            {isEditMode ? 'Edit Project' : 'Add New Project'}
          </h1>
        </div>
      </div>

      <div className="container-custom py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  required
                  value={formData.projectName}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company *</label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="input"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Plot</label>
                <input
                  type="text"
                  name="address.plot"
                  value={formData['address.plot']}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Road</label>
                <input
                  type="text"
                  name="address.road"
                  value={formData['address.road']}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Block</label>
                <input
                  type="text"
                  name="address.block"
                  value={formData['address.block']}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Area *</label>
                <input
                  type="text"
                  name="address.area"
                  required
                  value={formData['address.area']}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  name="address.city"
                  required
                  value={formData['address.city']}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Status *</label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Finish Date
                </label>
                <input
                  type="date"
                  name="finishDate"
                  value={formData.finishDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Featured Project</span>
                </label>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Floors</label>
                <input
                  type="text"
                  name="specifications.floors"
                  value={formData['specifications.floors']}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., G+9"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Area per Floor
                </label>
                <input
                  type="text"
                  name="specifications.areaPerFloor"
                  value={formData['specifications.areaPerFloor']}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 3200 sqft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Total Area
                </label>
                <input
                  type="text"
                  name="specifications.totalArea"
                  value={formData['specifications.totalArea']}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Construction Type
                </label>
                <input
                  type="text"
                  name="specifications.constructionType"
                  value={formData['specifications.constructionType']}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Fair-Face"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="input"
              />
              <p className="text-sm text-gray-500 mt-2">
                Select multiple images (max 5MB each)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <FaSave /> {loading ? 'Saving...' : 'Save Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="btn bg-gray-500 text-white hover:bg-gray-600 flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;