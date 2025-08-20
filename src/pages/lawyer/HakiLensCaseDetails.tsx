import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Loader2, Brain, MessageSquare, Send, AlertCircle, CheckCircle, X, Gavel, Users, Calendar, BookOpen, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

// Types
interface Case {
  id: number;
  url: string;
  court?: string;
  case_number?: string;
  parties?: string;
  judges?: string;
  date?: string;
  citation?: string;
  title?: string;
  summary?: string;
  content_text?: string;
  created_at: string;
  updated_at: string;
}

interface AIChatMessage {
  id: number;
  question: string;
  answer?: string;
  error?: string;
  isLoading: boolean;
}

const API_BASE = 'https://hakilens.onrender.com';

export const HakiLensCaseDetails = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Utility functions
  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 5000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Load case data
  const loadCaseData = useCallback(async (caseId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/cases/${caseId}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const rawText = await response.text();
        console.error('Non-JSON response:', rawText);
        throw new Error('Invalid response format: Expected JSON');
      }
      const data: Case = await response.json();
      setCaseData(data);
      showSuccess('Case details loaded successfully');
    } catch (err) {
      console.error('Failed to load case data:', err);
      showError(`Failed to load case: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setCaseData(null);
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  // Handle AI chat submission
  const handleAskAI = useCallback(async () => {
    if (!chatInput.trim()) {
      showError('Please enter a question');
      return;
    }
    if (!caseId) {
      showError('Case ID not found.');
      return;
    }

    const newMessage: AIChatMessage = {
      id: Date.now(),
      question: chatInput,
      isLoading: true,
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Use the documented /ai/chat/{case_id} endpoint
      const response = await fetch(`https://hakilens.onrender.com/ai/chat/${caseId}?model=gpt-4o-mini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: chatInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, answer: data.answer || 'No answer provided', isLoading: false }
            : msg
        )
      );
    } catch (err) {
      console.error('Failed to get AI response:', err);
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, error: 'Failed to get AI response', isLoading: false }
            : msg
        )
      );
      showError('Failed to get AI response');
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, caseId, showError]);

  // Load case data on mount
  useEffect(() => {
    if (caseId) {
      loadCaseData(parseInt(caseId));
    }
  }, [caseId, loadCaseData]);

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
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
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
            >
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-green-800">{success}</span>
              <button
                onClick={() => setSuccess('')}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Split Layout: Case Details (Left) and AI Chat (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case Details Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Case Details
            </h1>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : caseData ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {caseData.title || `Case #${caseData.case_number || caseData.id}`}
                  </h2>
                </div>
                {caseData.court && (
                  <div className="flex items-center gap-2">
                    <Gavel size={16} className="text-gray-600" />
                    <span>Court: {caseData.court}</span>
                  </div>
                )}
                {caseData.parties && (
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-600" />
                    <span>Parties: {caseData.parties}</span>
                  </div>
                )}
                {caseData.date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-600" />
                    <span>Date: {caseData.date}</span>
                  </div>
                )}
                {caseData.citation && (
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-gray-600" />
                    <span>Citation: {caseData.citation}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-600" />
                  <span>Created: {formatDate(caseData.created_at)}</span>
                </div>
                {caseData.summary && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900">Summary</h3>
                    <p className="text-gray-600">{caseData.summary}</p>
                  </div>
                )}
                {caseData.content_text && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900">Full Text</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{caseData.content_text}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">No case data available.</div>
            )}
          </div>

          {/* AI Chat Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={24} className="text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">AI Case Assistant</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Ask questions about this case. The AI will provide answers based on the case details.
            </p>
            <div className="flex flex-col h-[500px]">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                <AnimatePresence>
                  {chatMessages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-gray-500 text-center"
                    >
                      Start a conversation about this case...
                    </motion.div>
                  )}
                  {chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4"
                    >
                      {/* User Question */}
                      <div className="flex items-start gap-2">
                        <MessageSquare size={16} className="text-blue-600" />
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <p className="text-blue-900">{message.question}</p>
                        </div>
                      </div>
                      {/* AI Response or Loading/Error */}
                      {message.isLoading ? (
                        <div className="flex items-center gap-2 mt-2 ml-6">
                          <Loader2 size={16} className="animate-spin text-purple-600" />
                          <span className="text-gray-600">Thinking...</span>
                        </div>
                      ) : message.error ? (
                        <div className="flex items-center gap-2 mt-2 ml-6">
                          <AlertCircle size={16} className="text-red-600" />
                          <span className="text-red-600">{message.error}</span>
                        </div>
                      ) : (
                        message.answer && (
                          <div className="flex items-start gap-2 mt-2 ml-6">
                            <Brain size={16} className="text-purple-600" />
                            <div className="bg-purple-100 p-3 rounded-lg">
                              <p className="text-purple-900 whitespace-pre-wrap">{message.answer}</p>
                            </div>
                          </div>
                        )
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {/* Chat Input */}
              <div className="flex gap-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question about this case..."
                  rows={2}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  disabled={chatLoading}
                />
                <button
                  onClick={handleAskAI}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {chatLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};

export default HakiLensCaseDetails;
