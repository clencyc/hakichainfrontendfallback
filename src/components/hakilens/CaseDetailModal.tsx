import { motion } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  Brain, 
  Bookmark, 
  Download, 
  Share2, 
  ExternalLink, 
  Calendar,
  Gavel,
  Hash,
  Clock
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface JudgmentCase {
  id: string;
  title: string;
  court: string;
  date: string;
  category: string;
  tags: string[];
  summary: {
    outcome: string;
    keyArguments: string[];
    citations: Array<{ text: string; url?: string }>;
    timeline: Array<{ date: string; event: string; description?: string }>;
  };
  isBookmarked: boolean;
  uploadedAt: string;
  fileName: string;
  fileSize: string;
  aiConfidence: number;
}

interface CaseDetailModalProps {
  isOpen: boolean;
  caseItem: JudgmentCase | null;
  onClose: () => void;
  onToggleBookmark: (caseId: string) => void;
  onExportCase: (caseItem: JudgmentCase, format: 'pdf' | 'word' | 'csv') => void;
}

export const CaseDetailModal = ({
  isOpen,
  caseItem,
  onClose,
  onToggleBookmark,
  onExportCase
}: CaseDetailModalProps) => {
  if (!isOpen || !caseItem) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {caseItem.title}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Gavel className="w-4 h-4 mr-1" />
                  {caseItem.court}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(caseItem.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-1 text-primary-500" />
                  {caseItem.aiConfidence}% AI Confidence
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {caseItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Case Outcome */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Case Outcome</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-green-800">{caseItem.summary.outcome}</p>
                    </div>
                  </div>
                </div>

                {/* Key Arguments */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Legal Arguments</h4>
                  <div className="space-y-3">
                    {caseItem.summary.keyArguments.map((argument, index) => (
                      <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-800 text-sm sm:text-base">{argument}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal Citations */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Legal Citations</h4>
                  <div className="space-y-2">
                    {caseItem.summary.citations.map((citation, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Hash className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-800 flex-1 text-sm sm:text-base">{citation.text}</span>
                        {citation.url && (
                          <button className="ml-2 p-1 text-primary-600 hover:text-primary-700">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Case Timeline */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Case Timeline</h4>
                  <div className="space-y-4">
                    {caseItem.summary.timeline.map((event, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-start">
                          <div className="w-3 h-3 bg-primary-500 rounded-full mt-2 mr-3 relative z-10 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">{event.event}</h5>
                              <span className="text-xs text-gray-500 flex items-center mt-1 sm:mt-0">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-sm text-gray-600">{event.description}</p>
                            )}
                          </div>
                        </div>
                        {index < caseItem.summary.timeline.length - 1 && (
                          <div className="absolute left-1.5 top-6 w-0.5 h-8 bg-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Brain className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">AI Analysis</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-800">Confidence Score</span>
                      <span className="font-medium text-blue-900">{caseItem.aiConfidence}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${caseItem.aiConfidence}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-700">
                      High confidence analysis based on document structure and legal patterns
                    </p>
                  </div>
                </div>

                {/* File Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">File Information</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Filename</span>
                      <span className="font-medium text-gray-900 truncate ml-2">{caseItem.fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size</span>
                      <span className="font-medium text-gray-900">{caseItem.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uploaded</span>
                      <span className="font-medium text-gray-900">
                        {new Date(caseItem.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onToggleBookmark(caseItem.id)}
              className={cn(
                "flex-1 btn flex items-center justify-center space-x-2",
                caseItem.isBookmarked ? "btn-primary" : "btn-outline"
              )}
            >
              <Bookmark className="w-4 h-4" />
              <span>{caseItem.isBookmarked ? 'Bookmarked' : 'Add Bookmark'}</span>
            </button>
            
            <button 
              onClick={() => onExportCase(caseItem, 'pdf')}
              className="flex-1 btn btn-outline flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            
            <button className="flex-1 btn btn-outline flex items-center justify-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
