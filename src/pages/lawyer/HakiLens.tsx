import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, AlertCircle, X } from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

const HakiLens: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [courtName, setCourtName] = useState('');
  const [year, setYear] = useState('');
  const [caseUrl, setCaseUrl] = useState('');
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchCases = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Implement case search functionality
      console.log('Searching cases with:', { keywords, caseNumber, courtName, year });
    } catch (err) {
      setError('Failed to search cases. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [keywords, caseNumber, courtName, year]);

  const handleDeepScrapeCase = useCallback(async () => {
    if (!caseUrl.trim()) {
      setUrlError('Please enter a valid case URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setUrlError('');
    
    try {
      // TODO: Implement deep case scraping functionality
      console.log('Deep scraping case:', caseUrl);
    } catch (err) {
      setError('Failed to scrape case. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [caseUrl]);

  return (
    <LawyerDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HakiLens</h1>
            <p className="text-gray-600 mt-2">
              Advanced legal case research and analysis powered by AI
            </p>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-red-800">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-600 hover:text-red-800"
                title="Close error message"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Cases Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Contract dispute, inheritance..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Number
              </label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                placeholder="HCCC No. 123..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Court Name
              </label>
              <input
                type="text"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                placeholder="High Court, Court of Appeal..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2020, 2021..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
            </div>
          </div>

          <button
            onClick={handleSearchCases}
            disabled={isLoading}
            className="bg-[#008080] hover:bg-[#006666] disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search Cases'}
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Comprehensive Case Deep Research */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#008080]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#008080]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Comprehensive Case Deep Research</h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case URL
              </label>
              <input
                type="text"
                value={caseUrl}
                onChange={(e) => {
                  setCaseUrl(e.target.value);
                  if (urlError) setUrlError('');
                }}
                placeholder="https://new.kenyalaw.org/caselaw/..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-[#008080]"
              />
              {urlError && (
                <p className="text-red-600 text-sm mt-1">{urlError}</p>
              )}
            </div>

            <button
              onClick={handleDeepScrapeCase}
              disabled={isLoading}
              className="bg-[#008080] hover:bg-[#006666] disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isLoading ? 'Processing...' : 'Deep Research Case'}</span>
            </button>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};

export default HakiLens;
