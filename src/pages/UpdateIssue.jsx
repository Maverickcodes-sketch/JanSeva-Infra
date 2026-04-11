import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Loader } from '../components/Loader';
import { Camera, CheckCircle } from 'lucide-react';
import { issuesAPI } from '../services/api';
import { toast } from 'sonner';

export const UpdateIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [issue, setIssue] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    remarks: '',
    completionImage: null,
    completionImagePreview: null,
  });

  useEffect(() => {
    fetchIssueDetails();
  }, [id]);

  const fetchIssueDetails = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data
      const mockIssue = {
        id: id,
        title: 'Water leak on Oak Street',
        description: 'Major water leak from underground pipe causing road flooding.',
        status: 'in_progress',
        priority: 'Critical',
        location: { lat: 40.7614, lng: -73.9776, address: 'Oak Street' },
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
        createdAt: '2026-04-10T08:00:00Z',
      };

      setIssue(mockIssue);
      setFormData((prev) => ({ ...prev, status: mockIssue.status }));
    } catch (error) {
      console.error('Error fetching issue:', error);
      toast.error('Failed to load issue details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          completionImage: reader.result,
          completionImagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.status) {
      toast.error('Please select a status');
      return;
    }

    setSubmitting(true);

    try {
      await issuesAPI.updateIssue(id, {
        status: formData.status,
        remarks: formData.remarks,
        completionImage: formData.completionImage,
        updatedAt: new Date().toISOString(),
      });

      toast.success('Issue updated successfully!');
      navigate('/assigned');
    } catch (error) {
      console.error('Error updating issue:', error);
      toast.error('Failed to update issue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="lg:pl-64 pt-16">
          <div className="flex justify-center items-center h-96">
            <Loader size="lg" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:pl-64 pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Update Issue</h1>
            <p className="text-muted-foreground mt-1">{issue?.title}</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-4">Issue Details</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-muted-foreground">Description</dt>
                <dd className="text-foreground">{issue?.description}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Location</dt>
                <dd className="text-foreground">{issue?.location?.address}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Priority</dt>
                <dd>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
                    {issue?.priority}
                  </span>
                </dd>
              </div>
              {issue?.image && (
                <div>
                  <dt className="text-sm text-muted-foreground mb-2">Issue Image</dt>
                  <dd>
                    <img
                      src={issue.image}
                      alt="Issue"
                      className="w-full max-w-md rounded-lg"
                    />
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-6">Update Status</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, remarks: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes or comments about the resolution..."
                />
              </div>

              {formData.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Completion Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border rounded-lg hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      {formData.completionImagePreview ? (
                        <div className="relative">
                          <img
                            src={formData.completionImagePreview}
                            alt="Completion"
                            className="mx-auto h-48 w-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                completionImage: null,
                                completionImagePreview: null,
                              }))
                            }
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                          <div className="flex text-sm text-muted-foreground">
                            <label className="relative cursor-pointer bg-card rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload completion photo</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Update Issue
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/assigned')}
                className="px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
