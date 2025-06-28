import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Award, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MatchingLawyer {
  lawyer_id: string;
  name: string;
  email: string;
  location: string;
  specializations: string[];
  matching_score: number;
  matching_factors: {
    specialization: number;
    location: number;
    experience: number;
    availability: number;
  };
}

interface LawyerMatchingListProps {
  bountyId: string;
  onSelect?: (lawyerId: string) => void;
}

export const LawyerMatchingList = ({ bountyId, onSelect }: LawyerMatchingListProps) => {
  const [matchingLawyers, setMatchingLawyers] = useState<MatchingLawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMatchingLawyers = async () => {
      try {
        const { data, error } = await .rpc('get_matching_lawyers', {
          bounty_id: bountyId,
          limit_count: 10
        });

        if (error) throw error;
        setMatchingLawyers(data || []);
      } catch (err) {
        console.error('Error loading matching lawyers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (bountyId) {
      loadMatchingLawyers();
    }
  }, [bountyId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matchingLawyers.map((lawyer, index) => (
        <motion.div
          key={lawyer.lawyer_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium mr-2">{lawyer.name}</h3>
                <div className="flex items-center text-sm text-primary-600">
                  <Star className="w-4 h-4 mr-1" />
                  <span>{lawyer.matching_score.toFixed(1)}% match</span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{lawyer.location}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {lawyer.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Specialization</div>
                  <div className="font-medium text-primary-600">
                    {lawyer.matching_factors.specialization}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Location</div>
                  <div className="font-medium text-primary-600">
                    {lawyer.matching_factors.location}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Experience</div>
                  <div className="font-medium text-primary-600">
                    {lawyer.matching_factors.experience}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Availability</div>
                  <div className="font-medium text-primary-600">
                    {lawyer.matching_factors.availability}%
                  </div>
                </div>
              </div>
            </div>

            {onSelect && (
              <button
                onClick={() => onSelect(lawyer.lawyer_id)}
                className="ml-4 btn btn-primary"
              >
                Select Lawyer
              </button>
            )}
          </div>
        </motion.div>
      ))}

      {matchingLawyers.length === 0 && (
        <div className="text-center py-8">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No matching lawyers found</h3>
          <p className="text-gray-500">Try adjusting your bounty requirements</p>
        </div>
      )}
    </div>
  );
};