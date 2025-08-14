import io from 'socket.io-client';

class DashboardAnalytics {
  private socket: any;
  private isConnected = false;

  constructor(dashboardUrl: string) {
    this.socket = io(dashboardUrl);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('📊 Dashboard analytics connected');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('📊 Dashboard analytics disconnected');
    });
  }

  // Track page views
  trackPageView(page: string, metadata?: any) {
    if (!this.isConnected) return;
    
    this.socket.emit('page_view', {
      page,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...metadata
    });
  }

  // Track user actions
  trackUserAction(action: string, data?: any) {
    if (!this.isConnected) return;
    
    this.socket.emit('user_action', {
      action,
      data,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    });
  }

  // Track errors
  trackError(error: Error, context?: string) {
    if (!this.isConnected) return;
    
    this.socket.emit('error_report', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getCurrentUserId()
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, metadata?: any) {
    if (!this.isConnected) return;
    
    this.socket.emit('performance_metric', {
      metric,
      value,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }

  private getCurrentUserId() {
    // Implement based on your auth system
    return localStorage.getItem('userId') || 
           sessionStorage.getItem('userId') || 
           'anonymous';
  }

  private getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  // Disconnect when done
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default DashboardAnalytics;
