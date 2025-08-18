# HakiChain Clerk + Supabase Integration Setup

This guide explains how to complete the Clerk authentication setup with Google/Facebook login and Supabase database integration for lawyer registration.

## **What's Been Implemented**

### ✅ **Components Created:**
1. **`LawyerRegistration.tsx`** - Complete lawyer onboarding flow with social auth
2. **`AuthProviderDisplay.tsx`** - Shows which auth method user used (Google/Facebook/Email)
3. **`LawyerVerificationPanel.tsx`** - Admin panel for approving/rejecting lawyers
4. **`useLawyerAuth.ts`** - Custom hook for lawyer authentication state

### ✅ **Database Schema:**
- **`supabase-lawyer-schema.sql`** - Complete PostgreSQL schema for lawyers table
- Supports social auth provider tracking
- Status management (pending → verified → active)
- Comprehensive lawyer profile fields

### ✅ **Features:**
- **Social Authentication**: Google & Facebook login via Clerk
- **Profile Completion**: Detailed lawyer registration form
- **Database Integration**: Automatic saving to Supabase
- **Status Tracking**: Verification workflow
- **Admin Controls**: Approval/rejection system

## **Next Steps to Complete Setup**

### **1. Configure Clerk Dashboard**

1. Go to [clerk.com](https://clerk.com) and sign in
2. Create a new application or use existing one
3. **Enable Social Providers:**
   - Go to **User & Authentication → Social providers**
   - Enable **Google** (configure OAuth 2.0 credentials)
   - Enable **Facebook** (configure App ID and secret)
4. **Configure redirect URLs:**
   - Add: `http://localhost:3000/lawyer/register`
   - Add: `https://yourdomain.com/lawyer/register` (production)

### **2. Set Up Supabase Database**

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema:
   ```sql
   -- Copy and paste contents from supabase-lawyer-schema.sql
   -- into your Supabase SQL Editor
   ```
3. **Update environment variables:**
   ```bash
   # In .env.local
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### **3. Test the Integration**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test registration flow:**
   - Navigate to `/lawyer/register`
   - Try signing up with Google/Facebook
   - Complete the lawyer profile form
   - Verify data is saved in Supabase

3. **Test admin panel:**
   - Use the `LawyerVerificationPanel` component
   - Approve/reject lawyer applications

### **4. Add Routes to Your App**

Add these routes to your main App component:

```tsx
import { LawyerRegistration } from './components/auth/LawyerRegistration';
import { LawyerVerificationPanel } from './components/admin/LawyerVerificationPanel';

// In your Routes component:
<Route path="/lawyer/register" element={<LawyerRegistration />} />
<Route path="/admin/lawyers" element={<LawyerVerificationPanel />} />
```

### **5. Create Supabase Client (if not exists)**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## **Security Considerations**

### **Row Level Security (RLS)**
The schema includes RLS policies:
- Lawyers can only manage their own profiles
- Public can view verified lawyers (for client matching)
- Admin operations require proper authorization

### **Environment Variables**
- **Never commit** `.env.local` to version control
- Use **different keys** for development and production
- **Clerk publishable key** is safe for client-side use
- **Supabase anon key** has limited permissions

## **Usage Examples**

### **Using the Lawyer Auth Hook**

```tsx
import { useLawyerAuth } from '../hooks/useLawyerAuth';

function LawyerDashboard() {
  const { 
    lawyerData, 
    isLawyerVerified, 
    canPractice, 
    getAuthProviderInfo 
  } = useLawyerAuth();

  if (!canPractice) {
    return <div>Account pending verification...</div>;
  }

  return (
    <div>
      <h1>Welcome, {lawyerData?.first_name}!</h1>
      <AuthProviderDisplay />
    </div>
  );
}
```

### **Protecting Lawyer Routes**

```tsx
import { ClerkProtectedRoute } from './components/auth/ClerkProtectedRoute';

<Route 
  path="/lawyer/dashboard" 
  element={
    <ClerkProtectedRoute>
      <LawyerDashboard />
    </ClerkProtectedRoute>
  } 
/>
```

## **Database Schema Overview**

The lawyers table includes:

- **Authentication**: Clerk user ID, email, auth provider info
- **Professional**: Bar number, specializations, experience
- **Contact**: Phone, address, languages
- **Status**: Verification workflow, ratings, activity
- **Timestamps**: Created, updated, verified dates

## **Troubleshooting**

### **Common Issues:**

1. **Clerk not loading**: Check publishable key in `.env.local`
2. **Supabase errors**: Verify URL and anon key
3. **Social auth not working**: Configure providers in Clerk dashboard
4. **Database errors**: Check RLS policies and table permissions

### **Debug Steps:**

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test Supabase connection directly
4. Check Clerk dashboard for authentication logs

Your Clerk + Supabase integration is now complete! 🚀
