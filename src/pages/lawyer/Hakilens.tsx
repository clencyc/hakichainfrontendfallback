import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Upload, 
  FileText, 
  Bookmark, 
  Download, 
  Calendar, 
  Gavel, 
  Eye, 
  BookOpen,
  MoreVertical,
  Share2,
  Brain
} from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { BookmarkPanel } from '../../components/hakilens/BookmarkPanel';
import { UploadModal } from '../../components/hakilens/UploadModal';
import { CaseDetailModal } from '../../components/hakilens/CaseDetailModal';
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

const mockCases: JudgmentCase[] = [
  {
    id: '1',
    title: 'Republic v. John Doe - Contract Breach Case',
    court: 'High Court of Kenya',
    date: '2024-03-15',
    category: 'Contract Law',
    tags: ['breach of contract', 'damages', 'commercial law'],
    summary: {
      outcome: 'Judgment for plaintiff with damages awarded',
      keyArguments: [
        'Material breach of contract terms established',
        'Plaintiff suffered quantifiable damages',
        'Defendant failed to provide adequate justification',
        'Force majeure clause did not apply to circumstances'
      ],
      citations: [
        { text: 'Section 73 of Indian Contract Act', url: '#' },
        { text: 'Hadley v. Baxendale (1854)', url: '#' },
        { text: 'Article 159 of Constitution of Kenya', url: '#' }
      ],
      timeline: [
        { date: '2023-01-15', event: 'Contract Signed', description: 'Initial agreement between parties' },
        { date: '2023-06-20', event: 'First Breach Alleged', description: 'Plaintiff claims non-performance' },
        { date: '2023-09-10', event: 'Legal Notice Served', description: 'Formal demand for compliance' },
        { date: '2023-11-05', event: 'Case Filed', description: 'Suit instituted in High Court' },
        { date: '2024-03-15', event: 'Judgment Delivered', description: 'Court ruled in favor of plaintiff' }
      ]
    },
    isBookmarked: true,
    uploadedAt: '2024-07-15',
    fileName: 'contract_breach_judgment.pdf',
    fileSize: '2.4 MB',
    aiConfidence: 94
  },
  {
    id: '2',
    title: 'Jane Smith v. City Council - Land Rights Dispute',
    court: 'Environment and Land Court',
    date: '2024-02-28',
    category: 'Property Law',
    tags: ['land rights', 'compulsory acquisition', 'compensation'],
    summary: {
      outcome: 'Petition allowed, compensation increased',
      keyArguments: [
        'Inadequate compensation for compulsory acquisition',
        'Violation of constitutional property rights',
        'Procedural irregularities in acquisition process',
        'Market value assessment was significantly undervalued'
      ],
      citations: [
        { text: 'Article 40 of Constitution of Kenya', url: '#' },
        { text: 'Land Acquisition Act, Section 25', url: '#' },
        { text: 'Mwangi v. Government of Kenya (2018)', url: '#' }
      ],
      timeline: [
        { date: '2022-05-10', event: 'Acquisition Notice', description: 'Government issued acquisition notice' },
        { date: '2022-08-15', event: 'Compensation Offered', description: 'Initial compensation proposed' },
        { date: '2022-12-01', event: 'Petition Filed', description: 'Challenge to compensation amount' },
        { date: '2024-02-28', event: 'Judgment Delivered', description: 'Court increased compensation by 300%' }
      ]
    },
    isBookmarked: false,
    uploadedAt: '2024-07-10',
    fileName: 'land_rights_judgment.pdf',
    fileSize: '3.1 MB',
    aiConfidence: 89
  },
  {
    id: '3',
    title: 'Domestic Violence Protection Order - Mary Wanjiku',
    court: 'Magistrate Court - Nairobi',
    date: '2024-04-10',
    category: 'Family Law',
    tags: ['domestic violence', 'protection order', 'family disputes'],
    summary: {
      outcome: 'Protection order granted for 2 years',
      keyArguments: [
        'Clear evidence of physical and emotional abuse',
        'Imminent threat to applicant\'s safety',
        'Pattern of escalating violence established',
        'Children\'s welfare considerations paramount'
      ],
      citations: [
        { text: 'Protection Against Domestic Violence Act, 2015', url: '#' },
        { text: 'Article 29 of Constitution of Kenya', url: '#' },
        { text: 'Children Act, Section 4', url: '#' }
      ],
      timeline: [
        { date: '2024-02-15', event: 'First Incident Reported', description: 'Police report filed' },
        { date: '2024-03-01', event: 'Application Filed', description: 'Sought protection order' },
        { date: '2024-03-20', event: 'Hearing Conducted', description: 'Evidence presented in court' },
        { date: '2024-04-10', event: 'Order Granted', description: 'Two-year protection order issued' }
      ]
    },
    isBookmarked: true,
    uploadedAt: '2024-07-12',
    fileName: 'domestic_violence_order.pdf',
    fileSize: '1.8 MB',
    aiConfidence: 96
  }
];

export const Hakilens = () => {
  const [cases, setCases] = useState<JudgmentCase[]>(mockCases);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourt, setSelectedCourt] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<JudgmentCase | null>(null);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const categories = ['all', 'Contract Law', 'Property Law', 'Family Law', 'Criminal Law', 'Constitutional Law'];
  const courts = ['all', 'High Court of Kenya', 'Court of Appeal', 'Supreme Court', 'Environment and Land Court', 'Magistrate Court'];

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         caseItem.court.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || caseItem.category === selectedCategory;
    const matchesCourt = selectedCourt === 'all' || caseItem.court === selectedCourt;
    
    return matchesSearch && matchesCategory && matchesCourt;
  });

  const bookmarkedCases = cases.filter(c => c.isBookmarked);

  const toggleBookmark = (caseId: string) => {
    setCases(prev => prev.map(c => 
      c.id === caseId ? { ...c, isBookmarked: !c.isBookmarked } : c
    ));
  };

  const handleUpload = async (files: FileList, tags: string[]) => {
    if (!files || files.length === 0) return;
    
    // Mock upload and AI processing
    const newCase: JudgmentCase = {
      id: Date.now().toString(),
      title: files[0].name.replace('.pdf', ''),
      court: 'High Court of Kenya',
      date: new Date().toISOString().split('T')[0],
      category: 'Contract Law',
      tags: tags.length > 0 ? tags : ['contract law', 'breach'],
      summary: {
        outcome: 'AI analysis completed successfully',
        keyArguments: ['Analysis generated from document content'],
        citations: [{ text: 'Relevant legal citations extracted', url: '#' }],
        timeline: [
          { date: new Date().toISOString().split('T')[0], event: 'Document Uploaded', description: 'AI analysis initiated' }
        ]
      },
      isBookmarked: false,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileName: files[0].name,
      fileSize: `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`,
      aiConfidence: 87
    };
    
    setTimeout(() => {
      setCases(prev => [newCase, ...prev]);
    }, 2000);
  };

  const exportCase = (caseItem: JudgmentCase, format: 'pdf' | 'word' | 'csv') => {
    // Mock export functionality
    console.log(`Exporting ${caseItem.title} as ${format}`);
  };

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Hakilens</h1>
              <p className="text-lg text-gray-600">AI-Powered Judgment Catalog & Case Law Research</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Judgment</span>
            </button>
            
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={cn(
                "btn flex items-center space-x-2",
                showBookmarks ? "btn-primary" : "btn-outline"
              )}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarks ({cases.filter(c => c.isBookmarked).length})</span>
            </button>

            <button className="btn btn-outline flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Collection</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by case title, court, or legal issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Court Filter */}
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {courts.map(court => (
                <option key={court} value={court}>
                  {court === 'all' ? 'All Courts' : court}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-600">Quick filters:</span>
            {['Recent Cases', 'High Court', 'Contract Disputes', 'Land Matters'].map(filter => (
              <button
                key={filter}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {filteredCases.map((caseItem) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Case Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {caseItem.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleBookmark(caseItem.id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          caseItem.isBookmarked 
                            ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100" 
                            : "text-gray-400 hover:text-yellow-600 hover:bg-yellow-50"
                        )}
                      >
                        <Bookmark className="w-5 h-5" fill={caseItem.isBookmarked ? "currentColor" : "none"} />
                      </button>
                      
                      <div className="relative group">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <div className="py-1 w-48">
                            <button onClick={() => exportCase(caseItem, 'pdf')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center">
                              <Download className="w-4 h-4 mr-2" />
                              Export as PDF
                            </button>
                            <button onClick={() => exportCase(caseItem, 'word')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              Export as Word
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Case
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseItem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Summary Preview */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">AI Summary</h4>
                    <p className="text-sm text-gray-700 mb-3">{caseItem.summary.outcome}</p>
                    
                    {/* Key Arguments Preview */}
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium text-gray-800">Key Arguments:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {caseItem.summary.keyArguments.slice(0, 2).map((argument, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {argument}
                          </li>
                        ))}
                        {caseItem.summary.keyArguments.length > 2 && (
                          <li className="text-primary-600 cursor-pointer" onClick={() => setSelectedCase(caseItem)}>
                            +{caseItem.summary.keyArguments.length - 2} more arguments...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedCase(caseItem)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Full Analysis
                    </button>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>Uploaded {new Date(caseItem.uploadedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{caseItem.fileSize}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredCases.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or upload a new judgment.</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn btn-primary"
                >
                  Upload First Judgment
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cases</span>
                  <span className="font-medium">{cases.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bookmarked</span>
                  <span className="font-medium">{cases.filter(c => c.isBookmarked).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories</span>
                  <span className="font-medium">{new Set(cases.map(c => c.category)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
              <div className="space-y-3">
                {cases.slice(0, 3).map((caseItem) => (
                  <div key={caseItem.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {caseItem.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(caseItem.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['contract law', 'property disputes', 'damages', 'constitutional law', 'family law'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />

        {/* Case Detail Modal */}
        <CaseDetailModal
          isOpen={!!selectedCase}
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onToggleBookmark={toggleBookmark}
          onExportCase={exportCase}
        />

        {/* Bookmark Panel */}
        <BookmarkPanel
          isOpen={showBookmarks}
          onClose={() => setShowBookmarks(false)}
          bookmarkedCases={bookmarkedCases}
          onViewCase={setSelectedCase}
          onToggleBookmark={toggleBookmark}
          onExportCase={exportCase}
        />
      </div>
    </LawyerDashboardLayout>
  );
};
