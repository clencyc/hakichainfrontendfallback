import { Clock, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Milestone } from '../../types';
import { motion } from 'framer-motion';

interface MilestonesListProps {
  milestones: Milestone[];
  isLawyer?: boolean;
  onMilestoneAction?: (milestoneId: string, action: 'submit' | 'verify') => void;
}

export const MilestonesList = ({ 
  milestones, 
  isLawyer = false,
  onMilestoneAction 
}: MilestonesListProps) => {
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Milestones</h3>
      
      <div className="space-y-4">
        {sortedMilestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 border rounded-lg ${
              milestone.status === 'completed'
                ? 'border-success-300 bg-success-50'
                : milestone.status === 'in-review'
                ? 'border-warning-300 bg-warning-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                {milestone.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-success-500" />
                ) : milestone.status === 'in-review' ? (
                  <AlertCircle className="w-6 h-6 text-warning-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium mb-1">{milestone.title}</h4>
                  <span className="font-medium text-accent-600">${milestone.amount}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <strong>Required:</strong> {milestone.proofRequired}
                </div>
                
                {milestone.proofSubmitted && (
                  <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                    <div className="text-sm">
                      <strong>Submitted:</strong> {new Date(milestone.proofSubmitted.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm truncate">
                      <strong>Hash:</strong> {milestone.proofSubmitted.documentHash}
                    </div>
                  </div>
                )}
                
                {isLawyer && milestone.status === 'pending' && onMilestoneAction && (
                  <button
                    onClick={() => onMilestoneAction(milestone.id, 'submit')}
                    className="mt-3 btn btn-primary text-sm py-1.5"
                  >
                    Submit Proof
                  </button>
                )}
                
                {!isLawyer && milestone.status === 'in-review' && onMilestoneAction && (
                  <button
                    onClick={() => onMilestoneAction(milestone.id, 'verify')}
                    className="mt-3 btn btn-success text-sm py-1.5"
                  >
                    Verify & Release Payment
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};