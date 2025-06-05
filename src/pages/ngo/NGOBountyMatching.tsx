import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, AlertCircle } from 'lucide-react';
import { LawyerMatchingList } from '../../components/matching/LawyerMatchingList';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';

export const NGOBountyMatching = () => {
  const { bountyId } = useParams<{ bountyId: string }>();
  const [selectedLawyer, setSelectedLawyer] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleSelectLawyer = async (lawyerId: string) => {
    if (!bountyId) return;
    
    setIsAssigning(true);
    try {
      // Update bounty status and assign lawyer
      const { error: bountyError } = await supabase
        .from('bounties')
        .update({
          status: 'in-progress',
          assigned_lawyer_id: lawyerId
        })
        .eq('id', bountyId);

      if (bountyError) throw bountyError;

      // Create lawyer case
      const { error: caseError } = await supabase
        .from('lawyer_cases')
        .insert({
          lawyer_id: lawyerId,
          bounty_id: bountyId,
          status: 'active',
          hourly_rate: 150 // This would normally be configurable
        });

      if (caseError) throw caseError;

      setSelectedLawyer(lawyerId);
    } catch (error) {
      console.error('Error assigning lawyer:', error);
      alert('Failed to assign lawyer');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Lawyer Matching</h1>
          <p className="text-lg text-gray-600">Find the perfect lawyer for your case</p>
        </div>

        <div className="mb-8 p-4 bg-primary-50 border-l-4 border-primary-500 rounded-md">
          <div className="flex">
            <AlertCircle className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-primary-700">AI-Powered Matching</h3>
              <p className="text-primary-600">
                Our AI system matches lawyers based on specialization (30%), location (25%), 
                experience with similar cases (25%), and current availability (20%).
              </p>
            </div>
          </div>
        </div>

        {selectedLawyer ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-success-50 border border-success-200 p-6 text-center"
          >
            <Award className="w-12 h-12 text-success-600 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-success-700 mb-2">Lawyer Assigned Successfully!</h2>
            <p className="text-success-600">
              The selected lawyer has been notified and can now begin working on your case.
            </p>
          </motion.div>
        ) : (
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Matching Lawyers</h2>
              <p className="text-gray-600">
                These lawyers best match your case requirements and preferences
              </p>
            </div>

            <div className="p-6">
              <LawyerMatchingList
                bountyId={bountyId!}
                onSelect={handleSelectLawyer}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};