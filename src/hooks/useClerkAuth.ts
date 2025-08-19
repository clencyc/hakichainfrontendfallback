import { useUser, useAuth } from '@clerk/clerk-react';

export function useClerkAuth() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  return {
    isLoaded,
    isSignedIn,
    user,
    signOut,
    userId: user?.id,
    emailAddress: user?.emailAddresses?.[0]?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    imageUrl: user?.imageUrl,
  };
}
