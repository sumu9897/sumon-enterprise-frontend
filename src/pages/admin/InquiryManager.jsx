import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { FaTrash, FaEnvelope, FaEnvelopeOpen, FaSearch } from 'react-icons/fa';

const InquiryManager = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/inquiries?limit=100');
      setInquiries(response.data.data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status });
      toast.success('Status updated');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete inquiry from "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/inquiries/${id}`);
      toast.success('Inquiry deleted');
      fetchInquiries();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      toast.error('Failed to delete inquiry');
    }
  };

  const filteredInquiries = filter
    ? inquiries.filter((inq) => inq.status === filter)
    : inquiries;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="container-custom py-6">
          <h1 className="text-3xl font-heading font-bold">Manage Inquiries</h1>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inquiries List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex gap-4 mb-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All Inquiries</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="spinner mx-auto"></div>
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No inquiries found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.map((inquiry) => (
                        <tr
                          key={inquiry._id}
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            if (inquiry.status === 'unread') {
                              handleStatusChange(inquiry._id, 'read');
                            }
                          }}
                        >
                          <td>
                            {inquiry.status === 'unread' ? (
                              <FaEnvelope className="text-red-500" />
                            ) : (
                              <FaEnvelopeOpen className="text-gray-400" />
                            )}
                          </td>
                          <td className="font-medium">{inquiry.name}</td>
                          <td>{inquiry.email}</td>
                          <td className="max-w-xs truncate">{inquiry.subject}</td>
                          <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(inquiry._id, inquiry.name);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-4 text-gray-600">
              Showing {filteredInquiries.length} of {inquiries.length} inquiries
            </div>
          </div>

          {/* Inquiry Detail */}
          <div className="lg:col-span-1">
            {selectedInquiry ? (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Inquiry Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <p className="font-medium">{selectedInquiry.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p>{selectedInquiry.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone
                    </label>
                    <p>{selectedInquiry.phone}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Subject
                    </label>
                    <p className="font-medium">{selectedInquiry.subject}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Message
                    </label>
                    <p className="whitespace-pre-line bg-gray-50 p-3 rounded">
                      {selectedInquiry.message}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Date
                    </label>
                    <p>
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Status
                    </label>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) =>
                        handleStatusChange(selectedInquiry._id, e.target.value)
                      }
                      className="input"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t">
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                      className="btn-primary w-full text-center"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-500 text-center">
                  Select an inquiry to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryManager;