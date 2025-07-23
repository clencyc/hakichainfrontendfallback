import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LawyerDashboardLayout } from '../layout/LawyerDashboardLayout';
import { DashboardLayout } from '../layout/DashboardLayout';

interface RoleBasedSettingsLayoutProps {
  children: ReactNode;
}

export const RoleBasedSettingsLayout = ({ children }: RoleBasedSettingsLayoutProps) => {
  const { user } = useAuth();
  const Wrapper = user?.role === 'lawyer' ? LawyerDashboardLayout : DashboardLayout;
  const cardClass = user?.role === 'lawyer' ? 'mt-16' : '';

  return (
    <Wrapper>
      <div className={`w-full ${cardClass}`}>{children}</div>
    </Wrapper>
  );
}; 