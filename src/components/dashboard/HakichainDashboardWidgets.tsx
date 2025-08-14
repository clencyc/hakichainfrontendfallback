import React from 'react';
import { FeedbackWidget, SupportWidget, trackFeatureClick } from './DashboardIntegration';

interface HakichainDashboardWidgetsProps {
  dashboardUrl?: string;
}

export const HakichainDashboardWidgets: React.FC<HakichainDashboardWidgetsProps> = ({
  dashboardUrl = 'ws://localhost:5000'
}) => {
  return (
    <>
      {/* Feedback Widget - will appear as floating button */}
      <FeedbackWidget socketUrl={dashboardUrl} />
      
      {/* Support Widget - will appear as floating help button */}
      <SupportWidget socketUrl={dashboardUrl} />
    </>
  );
};

// Enhanced tracking for Hakichain specific features
export const trackHakichainFeature = (feature: string, metadata?: any) => {
  const features = {
    'case_search': 'User searched for legal cases',
    'document_upload': 'User uploaded a document',
    'contract_create': 'User created a new contract',
    'esign_request': 'User requested e-signature',
    'chat_interaction': 'User interacted with chat',
    'profile_update': 'User updated profile',
    'billing_view': 'User viewed billing information',
    'settings_change': 'User changed settings',
    'hakilens_analysis': 'User used HakiLens analysis',
    'blockchain_transaction': 'User performed blockchain transaction'
  };

  trackFeatureClick(feature, {
    description: features[feature as keyof typeof features] || feature,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};

export default HakichainDashboardWidgets;
