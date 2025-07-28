import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowLeft, DollarSign } from 'lucide-react';
import { fetchBountyById, mockBounties } from '../services/mockData';
import { MilestonesList } from '../components/bounties/MilestonesList';
import { Bounty } from '../types';

export const BountyDemoDetails = () => {

  // Always show the fake bounty the lawyer is assigned to (bounty-fake-1)
  const bounty = mockBounties.find(b => b.id === 'bounty-fake-1') || null;
  const isLoading = false;

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
}; 