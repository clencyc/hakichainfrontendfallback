import { useState, useCallback } from 'react';
import { Step, CallBackProps, STATUS } from 'react-joyride';

export interface TourStep extends Step {
  target: string;
  content: string;
  title?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  disableBeacon?: boolean;
  spotlightClicks?: boolean;
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="logo"]',
    content: 'Welcome to your HakiChain Lawyer Dashboard! This is your central hub for managing cases, clients, and legal work.',
    title: 'Welcome to HakiChain! 🎉',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="overview"]',
    content: 'Your Overview dashboard shows key metrics, recent cases, and important notifications at a glance.',
    title: 'Dashboard Overview',
    placement: 'right',
  },
  {
    target: '[data-tour="cases"]',
    content: 'Manage all your legal cases here. Track progress, add notes, and collaborate with clients.',
    title: 'Cases Management',
    placement: 'right',
  },
  {
    target: '[data-tour="hakilens"]',
    content: 'HakiLens is your powerful case search tool. Find relevant legal precedents and case law quickly.',
    title: 'HakiLens - Case Search 🔍',
    placement: 'right',
  },
  {
    target: '[data-tour="hakidraft"]',
    content: 'HakiDraft is your AI legal assistant. Get help with legal research, document drafting, and case analysis.',
    title: 'HakiDraft - AI Assistant 🤖',
    placement: 'right',
  },
  {
    target: '[data-tour="hakireview"]',
    content: 'HakiReview uses AI to analyze and review legal documents, helping you catch important details.',
    title: 'HakiReview - Document Analysis 📄',
    placement: 'right',
  },
  {
    target: '[data-tour="hakireminders"]',
    content: 'Never miss important deadlines! HakiReminders helps you manage court dates, client meetings, and deadlines.',
    title: 'HakiReminders - Stay Organized ⏰',
    placement: 'right',
  },
  {
    target: '[data-tour="documents"]',
    content: 'Store, organize, and manage all your legal documents securely in one place.',
    title: 'Document Management 📁',
    placement: 'right',
  },
  {
    target: '[data-tour="settings"]',
    content: 'Customize your profile, notification preferences, and account settings here.',
    title: 'Settings ⚙️',
    placement: 'top',
  },
  {
    target: '[data-tour="signout"]',
    content: 'You can safely sign out when you\'re done. Your work is automatically saved!',
    title: 'Sign Out 👋',
    placement: 'bottom',
  },
];

export const useDashboardTour = () => {
  const [runTour, setRunTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const startTour = useCallback(() => {
    setRunTour(true);
    setTourStep(0);
  }, []);

  const stopTour = useCallback(() => {
    setRunTour(false);
    setTourStep(0);
  }, []);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, type, index } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
      setTourStep(0);
    } else if (type === 'step:after') {
      setTourStep(index + 1);
    }
  }, []);

  return {
    runTour,
    tourStep,
    tourSteps: TOUR_STEPS,
    startTour,
    stopTour,
    handleJoyrideCallback,
  };
};
