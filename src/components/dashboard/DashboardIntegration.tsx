// Hakichain Client Website Integration Components
// Copy these components to your Next.js Hakichain client website

import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface FeedbackData {
  name: string;
  email: string;
  type: 'bug' | 'suggestion' | 'experience' | 'general';
  description: string;
  rating: number;
}

interface FeedbackWidgetProps {
  socketUrl?: string;
  apiUrl?: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  socketUrl = 'wss://your-dashboard-api.vercel.app',
  apiUrl = 'https://your-dashboard-api.vercel.app/api'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData>({
    name: '',
    email: '',
    type: 'general',
    description: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  React.useEffect(() => {
    // Initialize socket connection with error handling
    try {
      const socketConnection = io(socketUrl, {
        timeout: 5000,
        reconnection: false, // Don't auto-reconnect to avoid spam
        forceNew: true
      });
      
      socketConnection.on('connect_error', (error) => {
        console.warn('Dashboard service not available:', error.message);
        // Silently fail - dashboard service is optional
      });
      
      socketConnection.on('connect', () => {
        console.log('Dashboard service connected');
        setSocket(socketConnection);
      });

      return () => {
        socketConnection.disconnect();
      };
    } catch (error) {
      console.warn('Dashboard service not available:', error);
      // Continue without dashboard service
    }
  }, [socketUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send via Socket.IO for real-time updates
      if (socket) {
        socket.emit('new_feedback', feedback);
      }

      // Also send via REST API for persistence
      const response = await fetch(`${apiUrl}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        setFeedback({
          name: '',
          email: '',
          type: 'general',
          description: '',
          rating: 5
        });
        setIsOpen(false);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="feedback-toggle"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: '#3498DB',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '15px 20px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        💬 Feedback
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#2A3F54' }}>Share Your Feedback</h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2A3F54' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={feedback.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2A3F54' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={feedback.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2A3F54' }}>
                  Feedback Type *
                </label>
                <select
                  name="type"
                  value={feedback.type}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                >
                  <option value="general">General</option>
                  <option value="bug">Bug Report</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="experience">User Experience</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2A3F54' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={feedback.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Please describe your feedback..."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2A3F54' }}>
                  Rating (1-5) *
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} style={{ cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={feedback.rating === star}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <span style={{ 
                        fontSize: '24px', 
                        color: star <= feedback.rating ? '#F39C12' : '#E0E0E0' 
                      }}>
                        ⭐
                      </span>
                    </label>
                  ))}
                  <span style={{ marginLeft: '10px', color: '#666' }}>
                    {feedback.rating}/5
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    color: '#666',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    backgroundColor: '#3498DB',
                    color: 'white',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Support Widget Component
interface SupportData {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface SupportWidgetProps {
  socketUrl?: string;
  apiUrl?: string;
}

export const SupportWidget: React.FC<SupportWidgetProps> = ({
  socketUrl = 'wss://your-dashboard-api.vercel.app',
  apiUrl = 'https://your-dashboard-api.vercel.app/api'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [support, setSupport] = useState<SupportData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  React.useEffect(() => {
    const socketConnection = io(socketUrl);
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [socketUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send via Socket.IO for real-time updates
      if (socket) {
        socket.emit('new_support_ticket', support);
      }

      // Also send via REST API for persistence
      const response = await fetch(`${apiUrl}/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(support),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Support ticket created! Ticket ID: ${result.data.id}`);
        setSupport({
          name: '',
          email: '',
          subject: '',
          message: '',
          priority: 'medium'
        });
        setIsOpen(false);
      } else {
        throw new Error('Failed to create support ticket');
      }
    } catch (error) {
      console.error('Error creating support ticket:', error);
      alert('Failed to create support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSupport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      {/* Floating Support Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '80px', // Position above feedback button
          right: '20px',
          zIndex: 1000,
          backgroundColor: '#27AE60',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '15px 20px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        🎧 Support
      </button>

      {/* Support Modal - Similar structure to Feedback Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#2A3F54' }}>Get Support</h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Form fields similar to feedback form */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2A3F54' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={support.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2A3F54' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={support.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2A3F54' }}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={support.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2A3F54' }}>
                  Priority
                </label>
                <select
                  name="priority"
                  value={support.priority}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2A3F54' }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={support.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your issue or question..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #D1D3E2',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    color: '#666',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    backgroundColor: '#27AE60',
                    color: 'white',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Feature tracking utility
export const trackFeatureClick = (featureName: string, socketUrl?: string): void => {
  const socket = io(socketUrl || 'wss://your-dashboard-api.vercel.app');
  
  socket.emit('feature_click', {
    feature: featureName,
    timestamp: new Date().toISOString(),
    source: 'hakichain_client',
    url: window.location.href,
    userAgent: navigator.userAgent
  });

  // Disconnect after sending
  setTimeout(() => {
    socket.disconnect();
  }, 1000);
};

// Usage example for Next.js pages:
/*
// pages/_app.tsx or layout.tsx
import { FeedbackWidget, SupportWidget } from './components/DashboardIntegration';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <FeedbackWidget 
        socketUrl="wss://your-dashboard-api.vercel.app"
        apiUrl="https://your-dashboard-api.vercel.app/api"
      />
      <SupportWidget 
        socketUrl="wss://your-dashboard-api.vercel.app"
        apiUrl="https://your-dashboard-api.vercel.app/api"
      />
    </>
  );
}

// pages/cases.tsx (example usage of feature tracking)
import { trackFeatureClick } from './components/DashboardIntegration';

export default function CasesPage() {
  const handleCaseSearch = () => {
    trackFeatureClick('case_search');
    // Your search logic here
  };

  const handleDocumentUpload = () => {
    trackFeatureClick('document_upload');
    // Your upload logic here
  };

  return (
    <div>
      <button onClick={handleCaseSearch}>Search Cases</button>
      <button onClick={handleDocumentUpload}>Upload Document</button>
    </div>
  );
}
*/
