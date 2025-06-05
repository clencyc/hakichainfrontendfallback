import { DashboardLayout } from './DashboardLayout';

interface LawyerDashboardLayoutProps {
  children: React.ReactNode;
}

export const LawyerDashboardLayout = ({ children }: LawyerDashboardLayoutProps) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};