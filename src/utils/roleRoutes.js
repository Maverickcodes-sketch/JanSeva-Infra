// Role-based access control configuration

export const ROLES = {
  CITIZEN: 'citizen',
  ENGINEER: 'engineer',
  SUPERVISOR: 'supervisor',
};

// Route access configuration
export const ROUTE_ACCESS = {
  '/dashboard': [ROLES.CITIZEN, ROLES.ENGINEER, ROLES.SUPERVISOR],
  '/report': [ROLES.CITIZEN],
  '/my-issues': [ROLES.CITIZEN],
  '/assigned': [ROLES.ENGINEER],
  '/issue/:id/update': [ROLES.ENGINEER],
  '/map': [ROLES.SUPERVISOR],
  '/issue/:id': [ROLES.CITIZEN, ROLES.ENGINEER, ROLES.SUPERVISOR],
};

// Check if user has access to route
export const hasAccess = (userRole, route) => {
  // Remove dynamic params from route
  const routePattern = Object.keys(ROUTE_ACCESS).find(pattern => {
    const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$');
    return regex.test(route);
  });

  if (!routePattern) return true; // Public route

  const allowedRoles = ROUTE_ACCESS[routePattern];
  return allowedRoles.includes(userRole);
};

// Get default route for role
export const getDefaultRoute = (role) => {
  switch (role) {
    case ROLES.CITIZEN:
      return '/dashboard';
    case ROLES.ENGINEER:
      return '/assigned';
    case ROLES.SUPERVISOR:
      return '/map';
    default:
      return '/login';
  }
};
