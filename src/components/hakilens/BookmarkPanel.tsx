import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  Search, 
  X, 
  Calendar, 
  Gavel, 
  Download, 
  Share2, 
  Tag,
  Filter,
  Eye
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

interface BookmarkPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedCases: JudgmentCase[];
  onViewCase: (caseItem: JudgmentCase) => void;
  onToggleBookmark: (caseId: string) => void;
  onExportCase: (caseItem: JudgmentCase, format: 'pdf' | 'word' | 'csv') => void;
}

export const BookmarkPanel = ({
  isOpen,
  onClose,
  bookmarkedCases,
  onViewCase,
  onToggleBookmark,
  onExportCase
}: BookmarkPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const allTags = Array.from(
    new Set(bookmarkedCases.flatMap(c => c.tags))
  );

  const filteredCases = bookmarkedCases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'all' || caseItem.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed right-0 top-0 h-full bg-white shadow-2xl z-50",
              "w-full sm:w-96 lg:w-[500px]",
              "flex flex-col"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bookmarks</h3>
                  <p className="text-sm text-gray-500">{bookmarkedCases.length} cases saved</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>

              {/* Tag Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Export All Button */}
              <button className="w-full btn btn-outline text-sm flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export All Bookmarks</span>
              </button>
            </div>

            {/* Bookmarked Cases List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredCases.length > 0 ? (
                <div className="space-y-4">
                  {filteredCases.map((caseItem) => (
                    <motion.div
                      key={caseItem.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      {/* Case Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {caseItem.title}
                          </h4>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Gavel className="w-3 h-3 mr-1" />
                              {caseItem.court}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(caseItem.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onToggleBookmark(caseItem.id)}
                          className="p-1 text-yellow-600 hover:text-yellow-700"
                        >
                          <Bookmark className="w-4 h-4" fill="currentColor" />
                        </button>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {caseItem.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {caseItem.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                            +{caseItem.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Summary Preview */}
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {caseItem.summary.outcome}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => onViewCase(caseItem)}
                          className="text-primary-600 hover:text-primary-700 text-xs font-medium flex items-center"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onExportCase(caseItem, 'pdf')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Export as PDF"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Share case"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No bookmarks found</h4>
                  <p className="text-gray-500 text-sm">
                    {searchQuery || selectedTag !== 'all' 
                      ? 'Try adjusting your search criteria'
                      : 'Start bookmarking cases to build your research collection'
                    }
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
