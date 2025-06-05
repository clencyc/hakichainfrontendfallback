import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Tag, ArrowLeft, DollarSign } from 'lucide-react';
import { fetchBountyById } from '../services/mockData';
import { MilestonesList } from '../components/bounties/MilestonesList';
import { Bounty } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useWallet } from '../hooks/useWallet';

export const BountyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const { isAuthenticated, userRole } = useAuth();
  const { isConnected, connectWallet } = useWallet();

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
    // In a real application, this would send an application to the blockchain
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

    // In a real application, this would initiate a blockchain transaction
    alert(`Thank you for your donation of $${donationAmount}!`);
    setDonationAmount('');
  };

  const handleMilestoneAction = (milestoneId: string, action: 'submit' | 'verify') => {
    // In a real application, this would interact with the blockchain
    if (action === 'submit') {
      alert(`Proof submitted for milestone ${milestoneId}. Waiting for NGO verification.`);
    } else {
      alert(`Milestone ${milestoneId} verified. Payment released to lawyer.`);
    }
  };

  return (
    <div className="pt-20 pb-12">
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
                isLawyer={isAuthenticated && userRole === 'lawyer' && bounty.assignedLawyer?.id === 'user_1'} // This would normally use actual user ID
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