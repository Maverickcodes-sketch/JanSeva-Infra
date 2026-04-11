import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Loader } from '../components/Loader';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { ROLES } from '../utils/roleRoutes';
import { issuesAPI } from '../services/api';

export const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      await new Promise(resolve => setTimeout(resolve, 800));

      setStats({
        total: 24,
        pending: 8,
        inProgress: 10,
        completed: 6,
        critical: 3,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCitizenDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FileText}
          label="My Issues"
          value={stats?.total || 0}
          color="blue"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats?.pending || 0}
          color="yellow"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={stats?.completed || 0}
          color="green"
        />
      </div>

      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-primary-foreground mb-8">
        <h2 className="text-2xl font-bold mb-2">Report a New Issue</h2>
        <p className="mb-6 opacity-90">
          Help improve your community by reporting civic issues
        </p>
        <Link
          to="/report"
          className="inline-flex items-center px-6 py-3 bg-background text-primary font-medium rounded-lg hover:bg-accent/10 transition-colors"
        >
          <FileText className="h-5 w-5 mr-2" />
          Report Issue
        </Link>
      </div>
    </>
  );

  const renderEngineerDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FileText}
          label="Assigned"
          value={stats?.total || 0}
          color="blue"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats?.pending || 0}
          color="yellow"
        />
        <StatCard
          icon={TrendingUp}
          label="In Progress"
          value={stats?.inProgress || 0}
          color="orange"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={stats?.completed || 0}
          color="green"
        />
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Link
            to="/assigned"
            className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
          >
            <span className="font-medium text-foreground">View Assigned Issues</span>
            <span className="text-primary">→</span>
          </Link>
        </div>
      </div>
    </>
  );

  const renderSupervisorDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FileText}
          label="Total Issues"
          value={stats?.total || 0}
          color="blue"
        />
        <StatCard
          icon={AlertCircle}
          label="Critical"
          value={stats?.critical || 0}
          color="red"
        />
        <StatCard
          icon={TrendingUp}
          label="In Progress"
          value={stats?.inProgress || 0}
          color="orange"
        />
        <StatCard
          icon={CheckCircle}
          label="Resolved"
          value={stats?.completed || 0}
          color="green"
        />
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Map Overview</h2>
        <p className="mb-6 opacity-90">
          View all issues on the map and assign to engineers
        </p>
        <Link
          to="/map"
          className="inline-flex items-center px-6 py-3 bg-background text-foreground font-medium rounded-lg hover:bg-accent/20 transition-colors"
        >
          <MapPin className="h-5 w-5 mr-2" />
          Open Map View
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Welcome, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1 capitalize">{user?.role} Dashboard</p>
          </div>

          {loading ? (
            <Loader size="lg" />
          ) : (
            <>
              {user?.role === ROLES.CITIZEN && renderCitizenDashboard()}
              {user?.role === ROLES.ENGINEER && renderEngineerDashboard()}
              {user?.role === ROLES.SUPERVISOR && renderSupervisorDashboard()}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-primary/10 text-primary',
    yellow: 'bg-chart-4/10 text-chart-4',
    green: 'bg-chart-3/10 text-chart-3',
    orange: 'bg-accent/10 text-accent',
    red: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
