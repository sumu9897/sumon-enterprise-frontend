import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FaProjectDiagram,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaEnvelopeOpen,
  FaArrowRight,
  FaSignOutAlt,
} from 'react-icons/fa';

const Dashboard = () => {
  const { admin, logout } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    ongoingProjects: 0,
    finishedProjects: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch projects
      const projectsResponse = await api.get('/projects?limit=100');
      const projects = projectsResponse.data.data;

      // Fetch inquiry stats
      const inquiryStatsResponse = await api.get('/inquiries/stats');
      const inquiryStats = inquiryStatsResponse.data.data;

      // Fetch recent inquiries
      const recentInquiriesResponse = await api.get('/inquiries?limit=5');
      const inquiries = recentInquiriesResponse.data.data;

      setStats({
        totalProjects: projects.length,
        ongoingProjects: projects.filter((p) => p.status === 'Ongoing').length,
        finishedProjects: projects.filter((p) => p.status === 'Finished').length,
        totalInquiries: inquiryStats.total,
        unreadInquiries: inquiryStats.unread,
      });

      setRecentInquiries(inquiries);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: <FaProjectDiagram className="text-4xl" />,
      color: 'bg-blue-500',
      link: '/admin/projects',
    },
    {
      title: 'Ongoing Projects',
      value: stats.ongoingProjects,
      icon: <FaClock className="text-4xl" />,
      color: 'bg-orange-500',
      link: '/admin/projects?status=Ongoing',
    },
    {
      title: 'Finished Projects',
      value: stats.finishedProjects,
      icon: <FaCheckCircle className="text-4xl" />,
      color: 'bg-green-500',
      link: '/admin/projects?status=Finished',
    },
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: <FaEnvelope className="text-4xl" />,
      color: 'bg-purple-500',
      link: '/admin/inquiries',
    },
    {
      title: 'Unread Inquiries',
      value: stats.unreadInquiries,
      icon: <FaEnvelopeOpen className="text-4xl" />,
      color: 'bg-red-500',
      link: '/admin/inquiries?status=unread',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {admin?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/projects/new" className="btn-primary">
              Add New Project
            </Link>
            <Link to="/admin/projects" className="btn-outline">
              Manage Projects
            </Link>
            <Link to="/admin/inquiries" className="btn-outline">
              View Inquiries
            </Link>
            <Link to="/" className="btn-outline">
              View Public Site
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {statCards.map((card, index) => (
                <Link
                  key={index}
                  to={card.link}
                  className={`${card.color} text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-4">
                    {card.icon}
                    <FaArrowRight className="text-2xl opacity-75" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{card.value}</div>
                  <div className="text-sm opacity-90">{card.title}</div>
                </Link>
              ))}
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Inquiries</h2>
                <Link
                  to="/admin/inquiries"
                  className="text-primary hover:text-primary-dark font-medium flex items-center gap-2"
                >
                  View All <FaArrowRight />
                </Link>
              </div>

              {recentInquiries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No inquiries yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInquiries.map((inquiry) => (
                        <tr key={inquiry._id}>
                          <td className="font-medium">{inquiry.name}</td>
                          <td>{inquiry.email}</td>
                          <td className="max-w-xs truncate">{inquiry.subject}</td>
                          <td>
                            <span
                              className={`badge ${
                                inquiry.status === 'unread'
                                  ? 'bg-red-100 text-red-800'
                                  : inquiry.status === 'read'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {inquiry.status}
                            </span>
                          </td>
                          <td>
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* System Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">System Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Logged in as:</span>
                    <span className="font-medium">{admin?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium capitalize">{admin?.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Login:</span>
                    <span className="font-medium">
                      {admin?.lastLogin
                        ? new Date(admin.lastLogin).toLocaleString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Projects:</span>
                    <span className="font-medium">{stats.ongoingProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed Projects:</span>
                    <span className="font-medium">{stats.finishedProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Inquiries:</span>
                    <span className="font-medium text-red-600">
                      {stats.unreadInquiries}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;