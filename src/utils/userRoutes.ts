/**
 * Get the dashboard route for a user based on their role
 */
export function getDashboardRoute(userRole: string): string {
  switch (userRole) {
    case 'lawyer':
      return '/lawyer-dashboard';
    case 'ngo':
      return '/ngo-dashboard';
    case 'donor':
      return '/donor-dashboard';
    case 'client':
      return '/'; // Default home page for clients
    default:
      return '/'; // Default fallback
  }
}

/**
 * Get a friendly role name for display
 */
export function getRoleDisplayName(userRole: string): string {
  switch (userRole) {
    case 'lawyer':
      return 'Legal Professional';
    case 'ngo':
      return 'NGO Organization';
    case 'donor':
      return 'Donor';
    case 'client':
      return 'Client';
    default:
      return 'User';
  }
}
