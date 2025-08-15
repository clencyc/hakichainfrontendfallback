import React, { useState, useEffect, useCallback } from 'react';
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
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
=======
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
            className="bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Search Cases
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
              className="bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Deep Research Case</span>
            </button>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};
