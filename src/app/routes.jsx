import { createBrowserRouter, Navigate } from 'react-router';
import { Landing } from '../pages/Landing';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { ReportIssue } from '../pages/ReportIssue';
import { MyIssues } from '../pages/MyIssues';
import { AssignedIssues } from '../pages/AssignedIssues';
import { UpdateIssue } from '../pages/UpdateIssue';
import { MapView } from '../pages/MapView';
import { IssueDetails } from '../pages/IssueDetails';
import { Unauthorized } from '../pages/Unauthorized';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { ROLES } from '../utils/roleRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.CITIZEN, ROLES.ENGINEER, ROLES.SUPERVISOR]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/report',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.CITIZEN]}>
        <ReportIssue />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-issues',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.CITIZEN]}>
        <MyIssues />
      </ProtectedRoute>
    ),
  },
  {
    path: '/assigned',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ENGINEER]}>
        <AssignedIssues />
      </ProtectedRoute>
    ),
  },
  {
    path: '/issue/:id/update',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ENGINEER]}>
        <UpdateIssue />
      </ProtectedRoute>
    ),
  },
  {
    path: '/map',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR]}>
        <MapView />
      </ProtectedRoute>
    ),
  },
  {
    path: '/issue/:id',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.CITIZEN, ROLES.ENGINEER, ROLES.SUPERVISOR]}>
        <IssueDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
