import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { IssueCard } from '../components/IssueCard';
import { Loader } from '../components/Loader';
import { Filter } from 'lucide-react';
import { issuesAPI } from '../services/api';
import { toast } from 'sonner';

export const MyIssues = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockIssues = [
        {
          id: '1',
          title: 'Broken streetlight on Main Street',
          description: 'The streetlight has been out for 3 days, making the area unsafe at night.',
          status: 'in_progress',
          priority: 'High',
          location: { lat: 40.7128, lng: -74.006, address: 'Main Street' },
          image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
          createdAt: '2026-04-08T10:00:00Z',
        },
        {
          id: '2',
          title: 'Pothole on Elm Avenue',
          description: 'Large pothole causing damage to vehicles.',
          status: 'pending',
          priority: 'Medium',
          location: { lat: 40.7589, lng: -73.9851, address: 'Elm Avenue' },
          createdAt: '2026-04-09T14:30:00Z',
        },
        {
          id: '3',
          title: 'Overflowing garbage bin',
          description: 'Public bin has been full for days, attracting pests.',
          status: 'completed',
          priority: 'Low',
          location: { lat: 40.7488, lng: -73.9857, address: 'Park Avenue' },
          createdAt: '2026-04-05T09:15:00Z',
        },
      ];

      setIssues(mockIssues);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Issues</h1>
              <p className="text-muted-foreground mt-1">Track your reported issues</p>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No issues found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
