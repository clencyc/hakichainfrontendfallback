import { Bounty, Transaction, User } from '../types';

// Mock Users with valid UUID format
export const mockUsers: User[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Kamau',
    email: 'lawyer@example.com',
    role: 'lawyer',
    avatar: 'https://images.pexels.com/photos/5081971/pexels-photo-5081971.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Human rights attorney with 8 years of experience in public interest litigation.',
    lsk_number: 'LSK12345',
    specializations: ['Human Rights', 'Land Rights', 'Constitutional Law'],
    location: 'Nairobi, Kenya',
    rating: 4.8,
    casesCompleted: 24,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Justice Africa',
    email: 'ngo@example.com',
    role: 'ngo',
    organization: 'Justice Africa',
    location: 'Nairobi, Kenya',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Sarah Johnson',
    email: 'donor@example.com',
    role: 'donor',
  },
];

// Mock Bounties with updated UUIDs
export const mockBounties: Bounty[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    title: 'Land Rights Dispute',
    description: 'Representing indigenous community in Eastern Province fighting illegal land grabbing by a multinational corporation. Need legal support for court appearances and document preparation.',
    ngoId: '123e4567-e89b-12d3-a456-426614174001',
    ngoName: 'Justice Africa',
    totalAmount: 2500,
    raisedAmount: 1800,
    status: 'open',
    category: 'Land Rights',
    location: 'Eastern Province, Kenya',
    createdAt: '2025-04-10T10:00:00Z',
    dueDate: '2025-05-20T10:00:00Z',
    milestones: [
      {
        id: '123e4567-e89b-12d3-a456-426614174004',
        title: 'Initial Documentation',
        description: 'Prepare and file initial documentation with the court',
        amount: 500,
        dueDate: '2025-04-25T10:00:00Z',
        status: 'pending',
        proofRequired: 'Court filing receipt and documentation',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174005',
        title: 'First Court Appearance',
        description: 'Represent the community in first court hearing',
        amount: 800,
        dueDate: '2025-05-05T10:00:00Z',
        status: 'pending',
        proofRequired: 'Court attendance record and hearing summary',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174006',
        title: 'Evidence Collection',
        description: 'Collect and organize evidence from community members',
        amount: 600,
        dueDate: '2025-05-10T10:00:00Z',
        status: 'pending',
        proofRequired: 'Evidence catalog and witness statements',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174007',
        title: 'Final Submission',
        description: 'Prepare and submit final arguments',
        amount: 600,
        dueDate: '2025-05-18T10:00:00Z',
        status: 'pending',
        proofRequired: 'Copy of submitted arguments and receipt',
      },
    ],
    donors: [
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Sarah Johnson',
        amount: 1000,
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174008',
        name: 'Anonymous Donor',
        amount: 800,
      },
    ],
    tags: ['Land Rights', 'Indigenous Communities', 'Corporate Accountability'],
    impact: 'This case will help protect the land rights of over 200 families in the indigenous community and set a precedent for future cases.',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174009',
    title: 'Domestic Violence Protection',
    description: 'Legal support needed for a domestic violence survivor seeking a protection order and legal separation. Includes representation in court and legal counseling.\n\nThis project will provide a lifeline to a mother and her two children, helping them escape an abusive environment and secure a safer future. The lawyer will work closely with the family, the courts, and local organizations to ensure comprehensive protection and support.\n\nKey project features include emergency legal filings, court representation, and ongoing counseling to empower the survivor and her children.',
    ngoId: '123e4567-e89b-12d3-a456-426614174001',
    ngoName: 'Justice Africa',
    totalAmount: 1800,
    raisedAmount: 1200,
    status: 'open',
    category: 'Family Law',
    location: 'Mombasa, Kenya',
    createdAt: '2025-04-12T10:00:00Z',
    dueDate: '2025-05-15T10:00:00Z',
    milestones: [
      {
        id: 'm1',
        title: 'Protection Order Filing',
        description: 'File for emergency protection order',
        amount: 400,
        dueDate: '2025-04-20T10:00:00Z',
        status: 'completed',
        proofRequired: 'Filed protection order documents',
        proofSubmitted: {
          documentHash: 'xyz123',
          timestamp: '2025-04-20T12:00:00Z',
          url: '#',
        },
      },
      {
        id: 'm2',
        title: 'Court Representation',
        description: 'Represent client in protection order hearing',
        amount: 500,
        dueDate: '2025-04-30T10:00:00Z',
        status: 'pending',
        proofRequired: 'Court appearance record',
      },
      {
        id: 'm3',
        title: 'Legal Separation Filing',
        description: 'Prepare and file legal separation documents',
        amount: 600,
        dueDate: '2025-05-10T10:00:00Z',
        status: 'pending',
        proofRequired: 'Filed separation documents',
      },
      {
        id: 'm4',
        title: 'Follow-up and Support',
        description: 'Provide legal counseling and follow-up support',
        amount: 300,
        dueDate: '2025-05-15T10:00:00Z',
        status: 'pending',
        proofRequired: 'Counseling session notes and action plan',
      },
    ],
    donors: [
      {
        id: 'donor-1',
        name: 'Sarah Johnson',
        amount: 700,
      },
      {
        id: 'donor-2',
        name: 'Anonymous Donor',
        amount: 500,
      },
    ],
    tags: ['Domestic Violence', 'Family Law', 'Protection Order', 'Women Empowerment', 'Child Safety'],
    impact: 'This case will help protect a mother and her two children from an abusive situation and provide them with legal protection, emotional support, and a pathway to independence. By supporting this project, donors are directly contributing to breaking the cycle of violence and empowering survivors to rebuild their lives.',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174015',
    title: 'Environmental Justice Case',
    description: 'Seeking legal representation for a community affected by industrial pollution. Case involves gathering evidence and filing claims against the company responsible.',
    ngoId: '123e4567-e89b-12d3-a456-426614174001',
    ngoName: 'Justice Africa',
    totalAmount: 3000,
    raisedAmount: 1500,
    status: 'open',
    category: 'Environmental Law',
    location: 'Kisumu, Kenya',
    createdAt: '2025-04-05T10:00:00Z',
    dueDate: '2025-06-10T10:00:00Z',
    milestones: [
      {
        id: '123e4567-e89b-12d3-a456-426614174016',
        title: 'Evidence Collection',
        description: 'Collect environmental data and health impact evidence',
        amount: 800,
        dueDate: '2025-04-25T10:00:00Z',
        status: 'pending',
        proofRequired: 'Environmental testing results and health reports',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174017',
        title: 'Case Filing',
        description: 'Prepare and file case documents',
        amount: 700,
        dueDate: '2025-05-15T10:00:00Z',
        status: 'pending',
        proofRequired: 'Filed case documents',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174018',
        title: 'Initial Hearing',
        description: 'Represent community in initial hearing',
        amount: 800,
        dueDate: '2025-05-30T10:00:00Z',
        status: 'pending',
        proofRequired: 'Court appearance record',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174019',
        title: 'Final Submission',
        description: 'Prepare and submit final arguments',
        amount: 700,
        dueDate: '2025-06-05T10:00:00Z',
        status: 'pending',
        proofRequired: 'Final submission documents',
      },
    ],
    donors: [
      {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Sarah Johnson',
        amount: 1000,
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174020',
        name: 'Anonymous Donor',
        amount: 500,
      },
    ],
    tags: ['Environmental Justice', 'Industrial Pollution', 'Community Rights'],
    impact: 'This case will help a community of 500+ people affected by industrial pollution and potentially lead to cleanup and compensation.',
  },
];

// Mock Transactions with updated UUIDs
export const mockTransactions: Transaction[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174021',
    type: 'donation',
    amount: 1000,
    from: '123e4567-e89b-12d3-a456-426614174002',
    to: '123e4567-e89b-12d3-a456-426614174003',
    timestamp: '2025-04-10T14:30:00Z',
    status: 'completed',
    bountyId: '123e4567-e89b-12d3-a456-426614174003',
    txHash: '0x1a2b3c4d5e6f7g8h9i0j',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174022',
    type: 'donation',
    amount: 800,
    from: '123e4567-e89b-12d3-a456-426614174008',
    to: '123e4567-e89b-12d3-a456-426614174003',
    timestamp: '2025-04-11T09:15:00Z',
    status: 'completed',
    bountyId: '123e4567-e89b-12d3-a456-426614174003',
    txHash: '0x2b3c4d5e6f7g8h9i0j1k',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174023',
    type: 'donation',
    amount: 700,
    from: '123e4567-e89b-12d3-a456-426614174002',
    to: '123e4567-e89b-12d3-a456-426614174009',
    timestamp: '2025-04-12T11:45:00Z',
    status: 'completed',
    bountyId: '123e4567-e89b-12d3-a456-426614174009',
    txHash: '0x3c4d5e6f7g8h9i0j1k2l',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174024',
    type: 'donation',
    amount: 500,
    from: '123e4567-e89b-12d3-a456-426614174014',
    to: '123e4567-e89b-12d3-a456-426614174009',
    timestamp: '2025-04-13T16:20:00Z',
    status: 'completed',
    bountyId: '123e4567-e89b-12d3-a456-426614174009',
    txHash: '0x4d5e6f7g8h9i0j1k2l3m',
  },
];

// API mock functions
export const fetchBounties = (): Promise<Bounty[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBounties);
    }, 500);
  });
};

export const fetchBountyById = (id: string): Promise<Bounty | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bounty = mockBounties.find(b => b.id === id);
      resolve(bounty);
    }, 500);
  });
};

export const fetchUserById = (id: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.id === id);
      resolve(user);
    }, 500);
  });
};

export const fetchTransactionsByBountyId = (bountyId: string): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactions = mockTransactions.filter(tx => tx.bountyId === bountyId);
      resolve(transactions);
    }, 500);
  });
};

export const fetchUserTransactions = (userId: string): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactions = mockTransactions.filter(tx => tx.from === userId || tx.to === userId);
      resolve(transactions);
    }, 500);
  });
};