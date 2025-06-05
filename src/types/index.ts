// User types
export type UserRole = 'lawyer' | 'ngo' | 'donor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  lskNumber?: string; // For lawyers
  organization?: string; // For NGOs
  specializations?: string[]; // For lawyers
  location?: string;
  rating?: number;
  casesCompleted?: number;
}

// Bounty types
export type BountyStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'completed' | 'in-review';
  proofRequired: string;
  proofSubmitted?: {
    documentHash: string;
    timestamp: string;
    url: string;
  };
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  ngoId: string;
  ngoName: string;
  totalAmount: number;
  raisedAmount: number;
  status: BountyStatus;
  category: string;
  location: string;
  createdAt: string;
  dueDate: string;
  milestones: Milestone[];
  assignedLawyer?: {
    id: string;
    name: string;
    rating: number;
  };
  donors: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
  tags: string[];
  impact: string;
}

// Document types
export interface Document {
  id: string;
  name: string;
  hash: string;
  timestamp: string;
  milestoneId: string;
  bountyId: string;
  uploadedBy: string;
  url: string;
  verified: boolean;
}

// Transaction types
export interface Transaction {
  id: string;
  type: 'donation' | 'milestone-payment' | 'withdrawal';
  amount: number;
  from: string;
  to: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  bountyId?: string;
  milestoneId?: string;
  txHash?: string;
}