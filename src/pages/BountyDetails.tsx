import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Tag, ArrowLeft, DollarSign, X, Phone } from 'lucide-react';
import { fetchBountyById } from '../services/mockData';
import { MilestonesList } from '../components/bounties/MilestonesList';
import { Bounty } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useWallet } from '../hooks/useWallet';

export const BountyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const { isAuthenticated, userRole } = useAuth();
  const { isConnected, connectWallet } = useWallet();
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');

  // Detect demo mode via query param
  const isDemo = new URLSearchParams(location.search).get('demo') === '1' || (id && id.startsWith('fake-'));

  useEffect(() => {
    const loadBounty = async () => {
      try {
        if (id) {
          const data = await fetchBountyById(id);
          if (data) {
            setBounty(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch bounty:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBounty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // --- Custom creative layout for demo/fake bounties ---
  if (isDemo && bounty) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <Link to="/bounties" className="flex items-center text-gray-600 hover:text-primary-500 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Bounties</span>
            </Link>
            <span className="ml-auto px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white text-xs font-bold shadow">DEMO BOUNTY</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-4 border-dashed border-primary-200">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold text-primary-700 mb-2">{bounty.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {bounty.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">{tag}</span>
                  ))}
                </div>
                <p className="text-lg text-gray-700 mb-4">{bounty.description}</p>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded bg-accent-100 text-accent-700 font-medium mr-2">{bounty.category}</span>
                  <span className="inline-block px-3 py-1 rounded bg-secondary-100 text-secondary-700 font-medium">{bounty.location}</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <DollarSign className="w-5 h-5 text-success-600" />
                  <span className="text-2xl font-bold text-success-700">${bounty.totalAmount}</span>
                  <span className="text-gray-500">raised: ${bounty.raisedAmount}</span>
                </div>
                <div className="mb-4">
                  <Calendar className="w-5 h-5 text-primary-500 inline-block mr-1" />
                  <span className="font-medium">Due: {new Date(bounty.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2 text-accent-700">Impact</h2>
                  <p className="text-gray-700 italic">{bounty.impact}</p>
                </div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2 text-primary-700">Organization</h2>
                  <div className="flex items-center gap-3">
                    <span className="inline-block w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center font-bold text-primary-700 text-lg">{bounty.ngoName[0]}</span>
                    <span className="font-semibold text-lg">{bounty.ngoName}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <MilestonesList milestones={bounty.milestones} />
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2 text-secondary-700">Donors</h2>
              <div className="flex flex-wrap gap-4">
                {bounty.donors.map(donor => (
                  <div key={donor.id} className="bg-secondary-50 border border-secondary-200 rounded-lg px-4 py-2 flex flex-col items-center shadow-sm">
                    <Users className="w-5 h-5 text-secondary-500 mb-1" />
                    <span className="font-semibold text-secondary-700">{donor.name}</span>
                    <span className="text-xs text-gray-500">${donor.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Bounty Not Found</h2>
        <p className="text-gray-600 mb-6">The bounty you're looking for doesn't exist or has been removed.</p>
        <Link to="/bounties" className="btn btn-primary">
          Browse Bounties
        </Link>
      </div>
    );
  }

  const handleApplyToBounty = () => {
    alert('Your application has been submitted. The NGO will review your application.');
  };

  const handleDonate = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    alert(`Thank you for your donation of $${donationAmount}!`);
    setDonationAmount('');
  };

  const handleMpesaModal = () => {
    setShowMpesaModal(true);
  };

  const handleMpesaPayment = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    
    if (!mpesaNumber || mpesaNumber.length < 10) {
      alert('Please enter a valid M-Pesa number');
      return;
    }
    
    alert(`Processing M-Pesa payment of $${donationAmount} from ${mpesaNumber}. You will receive an STK push shortly.`);
    setDonationAmount('');
    setMpesaNumber('');
    setShowMpesaModal(false);
  };

  const handleMilestoneAction = (milestoneId: string, action: 'submit' | 'verify') => {
    if (action === 'submit') {
      alert(`Proof submitted for milestone ${milestoneId}. Waiting for NGO verification.`);
    } else {
      alert(`Milestone ${milestoneId} verified. Payment released to lawyer.`);
    }
  };

  return (
    <div className="pt-20 pb-12">
      {showMpesaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">M-Pesa Payment</h3>
              <button 
                onClick={() => setShowMpesaModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close M-Pesa Payment Modal"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-4">
                Enter the amount, select currency, and your M-Pesa number to make a payment.
              </p>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">                  
                  <input
                    type="number"
                    placeholder="Amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="input pl-10 w-full"
                    min="1"
                    step="1"
                  />
                </div>
                <select
                  aria-label="Select currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="input w-28"
                >
                  <option value="USD">USD</option>
                  <option value="KES">KES</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="e.g. 07XXXXXXXX"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  className="input pl-10 w-full"
                  maxLength={12}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowMpesaModal(false)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleMpesaPayment}
                className="btn btn-primary flex-1"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/bounties" className="flex items-center text-gray-600 hover:text-primary-500 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Bounties</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="card mb-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-serif font-bold">{bounty.title}</h1>
                <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ${bounty.totalAmount}
                </span>
              </div>
              
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
                <h3 className="text-xl font-bold mb-2">Description</h3>
                <p className="text-gray-700">
                  {bounty.description}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Impact</h3>
                <p className="text-gray-700">
                  {bounty.impact}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {bounty.tags.map((tag) => (
                    <div key={tag} className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">Organization</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                    <span className="font-medium text-gray-600">
                      {bounty.ngoName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{bounty.ngoName}</p>
                    <p className="text-sm text-gray-600">
                      Posted on {new Date(bounty.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <MilestonesList 
                milestones={bounty.milestones}
                isLawyer={isAuthenticated && userRole === 'lawyer' && bounty.assignedLawyer?.id === 'user_1'}
                onMilestoneAction={handleMilestoneAction}
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Funding Progress</h3>
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500"
                    style={{ width: `${(bounty.raisedAmount / bounty.totalAmount) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Raised: ${bounty.raisedAmount}</span>
                  <span>Goal: ${bounty.totalAmount}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Donation amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="input pl-10"
                    min="1"
                    step="1"
                  />
                </div>
                
                <button 
                  onClick={handleDonate}
                  className="btn btn-primary w-full py-2.5"
                >
                  {isConnected ? 'Donate Now' : 'Connect Wallet to Donate'}
                </button>
                <button 
                  onClick={handleMpesaModal}
                  className="btn btn-secondary w-full py-2.5"
                >
                  Pay with M-Pesa
                </button>
              </div>
            </div>
            
            {isAuthenticated && userRole === 'lawyer' && !bounty.assignedLawyer && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4">Apply for this Bounty</h3>
                <p className="text-gray-600 text-sm mb-4">
                  This bounty matches your expertise. Apply to represent this case and earn rewards upon completion of milestones.
                </p>
                <button 
                  onClick={handleApplyToBounty}
                  className="btn btn-secondary w-full py-2.5"
                >
                  Apply Now
                </button>
              </div>
            )}
            
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Donors</h3>
              {bounty.donors.length > 0 ? (
                <ul className="space-y-3">
                  {bounty.donors.map((donor) => (
                    <li key={donor.id} className="flex justify-between items-center">
                      <span className="font-medium">{donor.name}</span>
                      <span className="text-accent-600 font-semibold">${donor.amount}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">No donors yet. Be the first to contribute!</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
