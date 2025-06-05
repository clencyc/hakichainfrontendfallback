import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  DollarSign, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { fetchBounties, fetchTransactionsByBountyId } from '../services/mockData';
import { Bounty, Transaction } from '../types';
import { useAuth } from '../hooks/useAuth';
import { MilestonesList } from '../components/bounties/MilestonesList';

export const NGODashboard = () => {
  const { user } = useAuth();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bounties' | 'transactions'>('overview');
  const [selectedBountyId, setSelectedBountyId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allBounties = await fetchBounties();
        // Filter bounties for this NGO
        const ngoBounties = allBounties.filter(bounty => bounty.ngoId === user?.id);
        setBounties(ngoBounties.length ? ngoBounties : allBounties); // For demo, show all if none match
        
        // Load transactions for the first bounty
        if (ngoBounties.length > 0) {
          const bountyTxs = await fetchTransactionsByBountyId(ngoBounties[0].id);
          setTransactions(bountyTxs);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  const handleMilestoneAction = (milestoneId: string, action: 'verify') => {
    // In a real application, this would interact with the blockchain
    if (action === 'verify') {
      alert(`Milestone ${milestoneId} verified. Payment released to lawyer.`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">NGO Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your legal bounties and track case progress</p>
        </div>
        
        <div className="mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-3 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'overview' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-3 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'bounties' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('bounties')}
            >
              Your Bounties ({bounties.length})
            </button>
            <button
              className={`py-3 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'transactions' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card bg-white flex items-center p-6">
                <div className="rounded-full bg-primary-100 p-3 mr-4">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Active Bounties</p>
                  <p className="text-2xl font-bold">{bounties.length}</p>
                </div>
              </div>
              
              <div className="card bg-white flex items-center p-6">
                <div className="rounded-full bg-secondary-100 p-3 mr-4">
                  <Users className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Donors</p>
                  <p className="text-2xl font-bold">{bounties.reduce((acc, b) => acc + b.donors.length, 0)}</p>
                </div>
              </div>
              
              <div className="card bg-white flex items-center p-6">
                <div className="rounded-full bg-success-100 p-3 mr-4">
                  <CheckCircle className="h-6 w-6 text-success-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Completed Milestones</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
              
              <div className="card bg-white flex items-center p-6">
                <div className="rounded-full bg-accent-100 p-3 mr-4">
                  <DollarSign className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Raised</p>
                  <p className="text-2xl font-bold">${bounties.reduce((acc, b) => acc + b.raisedAmount, 0)}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="card mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                    <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start p-3 border-l-4 border-success-500 bg-success-50 rounded">
                      <CheckCircle className="w-5 h-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Milestone verified: Initial Documentation</p>
                        <p className="text-sm text-gray-600">Land Rights Dispute • 2 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 border-l-4 border-primary-500 bg-primary-50 rounded">
                      <DollarSign className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">New donation received: $500</p>
                        <p className="text-sm text-gray-600">Land Rights Dispute • 3 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 border-l-4 border-secondary-500 bg-secondary-50 rounded">
                      <FileText className="w-5 h-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">New bounty created: Domestic Violence Protection</p>
                        <p className="text-sm text-gray-600">by {user?.name} • 1 week ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Funding Progress</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {bounties.map(bounty => (
                      <div key={bounty.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{bounty.title}</h3>
                          <span className="text-sm font-medium">${bounty.raisedAmount} / ${bounty.totalAmount}</span>
                        </div>
                        
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div 
                            className="h-full bg-primary-500"
                            style={{ width: `${(bounty.raisedAmount / bounty.totalAmount) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{Math.round((bounty.raisedAmount / bounty.totalAmount) * 100)}% Funded</span>
                          <span>{bounty.donors.length} Donor{bounty.donors.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="card mb-6">
                  <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                  
                  <div className="space-y-3">
                    <Link 
                      to="/create-bounty" 
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="font-medium">Create New Bounty</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary-600" />
                    </Link>
                    
                    <button 
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors w-full text-left"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center mr-3">
                          <Clock className="w-4 h-4 text-secondary-600" />
                        </div>
                        <span className="font-medium">Review Pending Milestones</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary-600" />
                    </button>
                    
                    <button 
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors w-full text-left"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center mr-3">
                          <BarChart3 className="w-4 h-4 text-accent-600" />
                        </div>
                        <span className="font-medium">Generate Impact Report</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary-600" />
                    </button>
                  </div>
                </div>
                
                <div className="card">
                  <h2 className="text-xl font-bold mb-4">Case Impact</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">People Served</p>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold mr-2">200+</span>
                        <span className="text-sm text-success-600">↑ 12% from previous</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Success Rate</p>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold mr-2">85%</span>
                        <span className="text-sm text-success-600">↑ 5% from previous</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Avg. Case Completion</p>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold mr-2">45 days</span>
                        <span className="text-sm text-success-600">↓ 3 days from average</span>
                      </div>
                    </div>
                    
                    <button className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                      <span>View Full Impact Report</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'bounties' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Bounties</h2>
              <Link to="/create-bounty" className="btn btn-primary">
                Create New Bounty
              </Link>
            </div>
            
            {selectedBountyId ? (
              <div className="mb-4">
                <button 
                  onClick={() => setSelectedBountyId(null)}
                  className="flex items-center text-primary-600 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Back to all bounties</span>
                </button>
                
                <div className="card">
                  {bounties.filter(b => b.id === selectedBountyId).map(bounty => (
                    <div key={bounty.id}>
                      <div className="mb-6">
                        <div className="flex justify-between items-start">
                          <h2 className="text-2xl font-bold mb-2">{bounty.title}</h2>
                          <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            ${bounty.totalAmount}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{bounty.description}</p>
                        
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{bounty.location}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Due: {new Date(bounty.dueDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{bounty.donors.length} donor{bounty.donors.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="text-lg font-bold mb-2">Funding Status</h3>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <div 
                              className="h-full bg-primary-500"
                              style={{ width: `${(bounty.raisedAmount / bounty.totalAmount) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>${bounty.raisedAmount} raised</span>
                            <span>${bounty.totalAmount - bounty.raisedAmount} needed</span>
                          </div>
                        </div>
                      </div>
                      
                      <MilestonesList 
                        milestones={bounty.milestones} 
                        isLawyer={false}
                        onMilestoneAction={handleMilestoneAction}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bounties.map(bounty => (
                  <div 
                    key={bounty.id}
                    onClick={() => setSelectedBountyId(bounty.id)}
                    className="card hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="relative mb-4">
                      <div className="absolute top-0 right-0 bg-accent-500 text-white px-2 py-1 rounded-bl-lg text-sm font-medium">
                        ${bounty.totalAmount}
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500"
                          style={{ width: `${(bounty.raisedAmount / bounty.totalAmount) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>${bounty.raisedAmount} raised</span>
                        <span>${bounty.totalAmount - bounty.raisedAmount} needed</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2">{bounty.title}</h3>
                    
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{bounty.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Due: {new Date(bounty.dueDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {bounty.status === 'in-progress' 
                            ? 'In Progress'
                            : bounty.status === 'completed'
                            ? 'Completed'
                            : 'Open'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{bounty.milestones.length} milestones</span>
                      <span className="text-primary-600 text-sm font-medium flex items-center">
                        <span>Manage</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                ))}
                
                <Link 
                  to="/create-bounty"
                  className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-all"
                >
                  <Plus className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium text-center">Create New Bounty</p>
                </Link>
              </div>
            )}
          </motion.div>
        )}
        
        {activeTab === 'transactions' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <div>
                  <select className="input py-1.5 text-sm">
                    <option>All Transactions</option>
                    <option>Donations</option>
                    <option>Milestone Payments</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From/To
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.type === 'donation' ? 'Donation' : 'Milestone Payment'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.bountyId && (
                              <span>
                                {bounties.find(b => b.id === transaction.bountyId)?.title || 'Unknown Bounty'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            transaction.type === 'donation' ? 'text-success-600' : 'text-warning-600'
                          }`}>
                            {transaction.type === 'donation' ? '+' : '-'}${transaction.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transaction.type === 'donation' 
                              ? transaction.from.includes('anonymous') ? 'Anonymous Donor' : 'Sarah Johnson'
                              : 'John Kamau'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'completed' ? 'bg-success-100 text-success-800' : 
                            transaction.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                            'bg-error-100 text-error-800'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a 
                            href="#" 
                            className="text-primary-600 hover:text-primary-900 truncate block max-w-[100px]"
                            title={transaction.txHash}
                          >
                            {transaction.txHash}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {transactions.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};