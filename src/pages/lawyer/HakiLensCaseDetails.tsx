import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, FileText, Download, Image as ImageIcon, 
  Calendar, MapPin, Gavel, Users, ExternalLink,
  BookOpen, Send, Bot, Loader2,
  Brain, AlertCircle
} from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';

// Types (matching HakiLens types)
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

interface Document {
  id: number;
  case_id: number;
  file_path: string;
  url?: string;
  content_type?: string;
  created_at: string;
}

interface CaseImage {
  id: number;
  case_id: number;
  file_path: string;
  url?: string;
  alt_text?: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export const HakiLensCaseDetails = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [images, setImages] = useState<CaseImage[]>([]);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI assistant. I can help you analyze this case, answer questions about the legal content, suggest strategies, or help you understand complex legal concepts. What would you like to know about this case?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // API Configuration
  const API_BASE = '/api/hakilens'; // Use local proxy instead of direct ngrok URL

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load case data
  const loadCaseData = useCallback(async () => {
    if (!caseId) return;
    
    setLoading(true);
    try {
      // Load case details
      const caseResponse = await fetch(`${API_BASE}/cases/${caseId}`, {
        headers: { 
          'Content-Type': 'application/json'
        }
      });
      
      if (caseResponse.ok) {
        const data = await caseResponse.json();
        setCaseData(data);
      } else {
        setError('Failed to load case details');
      }

      // Load documents
      try {
        const docsResponse = await fetch(`${API_BASE}/cases/${caseId}/documents`, {
          headers: { 
            'Content-Type': 'application/json'
          }
        });
        if (docsResponse.ok) {
          const docsData = await docsResponse.json();
          setDocuments(docsData || []);
        }
      } catch (err) {
        console.warn('Failed to load documents:', err);
      }

      // Load images
      try {
        const imagesResponse = await fetch(`${API_BASE}/cases/${caseId}/images`, {
          headers: { 
            'Content-Type': 'application/json'
          }
        });
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          setImages(imagesData || []);
        }
      } catch (err) {
        console.warn('Failed to load images:', err);
      }

    } catch (err) {
      setError('Failed to load case data');
      console.error('Error loading case:', err);
    } finally {
      setLoading(false);
    }
  }, [caseId, API_BASE]);

  useEffect(() => {
    if (caseId) {
      loadCaseData();
    }
  }, [caseId, loadCaseData]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAiTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAiTyping(true);

    try {
      // Use the case-specific chat endpoint
      const response = await fetch(`${API_BASE}/ai/chat/${caseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response || data.answer || data.message || 'I apologize, but I could not generate a response at this time.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <LawyerDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Loading case details...</p>
          </div>
        </div>
      </LawyerDashboardLayout>
    );
  }

  if (error) {
    return (
      <LawyerDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/lawyer/hakilens')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Back to HakiLens
            </button>
          </div>
        </div>
      </LawyerDashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <LawyerDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-600 mb-4">Case not found</p>
            <button
              onClick={() => navigate('/lawyer/hakilens')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Back to HakiLens
            </button>
          </div>
        </div>
      </LawyerDashboardLayout>
    );
  }

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20 px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/lawyer/hakilens')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to HakiLens</span>
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Gavel className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {caseData.title || caseData.case_number || `Case #${caseData.id}`}
              </h1>
              <p className="text-gray-600">Case Analysis & AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Case Details */}
          <div className="space-y-6">
            {/* Case Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Case Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Case Number</label>
                  <p className="text-gray-900">{caseData.case_number || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Court</label>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{caseData.court || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{formatDate(caseData.date)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Parties</label>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{caseData.parties || 'N/A'}</p>
                  </div>
                </div>
                
                {caseData.judges && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Judges</label>
                    <p className="text-gray-900">{caseData.judges}</p>
                  </div>
                )}
                
                {caseData.citation && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Citation</label>
                    <p className="text-gray-900">{caseData.citation}</p>
                  </div>
                )}
              </div>
              
              {caseData.url && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={caseData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Original Source</span>
                  </a>
                </div>
              )}
            </motion.div>

            {/* Summary Card */}
            {caseData.summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{caseData.summary}</p>
              </motion.div>
            )}

            {/* Documents & Images */}
            {(documents.length > 0 || images.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h2>
                
                {documents.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700 flex-1">{doc.file_path}</span>
                          {doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {images.slice(0, 4).map((img) => (
                        <div key={img.id} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          {img.url && (
                            <a
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ExternalLink className="w-5 h-5 text-white" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                    {images.length > 4 && (
                      <p className="text-sm text-gray-500 mt-2">
                        +{images.length - 4} more images
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Content Text */}
            {caseData.content_text && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Full Content</h2>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                    {caseData.content_text}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - AI Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-8rem)] sticky top-24"
          >
            {/* Chat Header */}
            <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Legal Assistant</h2>
                <p className="text-sm text-gray-500">Ask questions about this case</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'ai' && (
                        <Bot className="w-4 h-4 mt-0.5 text-purple-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-purple-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about this case..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={isAiTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isAiTyping}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "Analyze the key legal issues",
                  "What's the legal precedent?",
                  "Summarize the court's reasoning",
                  "Identify potential appeals grounds"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputMessage(suggestion)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    disabled={isAiTyping}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </LawyerDashboardLayout>
  );
};
