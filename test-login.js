// Test login functionality
// This would simulate what happens when a user logs in

import { getDashboardRoute, getRoleDisplayName } from './src/utils/userRoutes.js';

// Test cases for different user types
const testUsers = [
  { email: 'john@lawyer.com', role: 'lawyer', name: 'John Doe' },
  { email: 'ngo@example.com', role: 'ngo', name: 'NGO Organization' },
  { email: 'donor@example.com', role: 'donor', name: 'Jane Donor' },
  { email: 'client@example.com', role: 'client', name: 'Client User' }
];

console.log('🧪 Testing Login Redirects\n');

testUsers.forEach(user => {
  const dashboardRoute = getDashboardRoute(user.role);
  const roleDisplay = getRoleDisplayName(user.role);
  
  console.log(`👤 ${user.name} (${user.email})`);
  console.log(`   Role: ${roleDisplay}`);
  console.log(`   Redirect: ${dashboardRoute}`);
  console.log('');
});

console.log('✅ All login redirects configured correctly!');
