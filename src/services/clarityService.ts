/**
 * Microsoft Clarity Analytics Service
 * Handles initialization and tracking for user behavior analytics
 */

import Clarity from '@microsoft/clarity';

// Clarity Configuration
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || 'suba8btife';

interface ClarityConfig {
  projectId: string;
}

class ClarityService {
  private initialized = false;

  /**
   * Initialize Microsoft Clarity with configuration
   */
  init(config?: Partial<ClarityConfig>): void {
    if (this.initialized) {
      console.warn('Clarity is already initialized');
      return;
    }

    try {
      const finalConfig: ClarityConfig = {
        projectId: CLARITY_PROJECT_ID,
        ...config
      };

      Clarity.init(finalConfig.projectId);
      this.initialized = true;
      
      console.log('✅ Microsoft Clarity initialized successfully with project ID:', finalConfig.projectId);
    } catch (error) {
      console.error('❌ Failed to initialize Microsoft Clarity:', error);
    }
  }

  /**
   * Set custom user ID for better tracking
   */
  identify(userId: string, customSessionId?: string, customPageId?: string, friendlyName?: string): void {
    if (!this.initialized) {
      console.warn('Clarity not initialized. Call init() first.');
      return;
    }

    try {
      Clarity.identify(userId, customSessionId, customPageId, friendlyName);
    } catch (error) {
      console.error('Failed to identify user in Clarity:', error);
    }
  }

  /**
   * Track custom events
   */
  trackEvent(eventName: string): void {
    if (!this.initialized) {
      console.warn('Clarity not initialized. Call init() first.');
      return;
    }

    try {
      Clarity.event(eventName);
    } catch (error) {
      console.error('Failed to track Clarity event:', error);
    }
  }

  /**
   * Set custom tags for session categorization
   */
  setTag(key: string, value: string | string[]): void {
    if (!this.initialized) {
      console.warn('Clarity not initialized. Call init() first.');
      return;
    }

    try {
      Clarity.setTag(key, value);
    } catch (error) {
      console.error('Failed to set Clarity tag:', error);
    }
  }

  /**
   * Enable or disable consent for tracking
   */
  consent(consent = true): void {
    if (!this.initialized) {
      console.warn('Clarity not initialized. Call init() first.');
      return;
    }

    try {
      Clarity.consent(consent);
      console.log(consent ? 'Clarity tracking consent granted' : 'Clarity tracking consent revoked');
    } catch (error) {
      console.error('Failed to set Clarity consent:', error);
    }
  }

  /**
   * Upgrade session for special tracking
   */
  upgrade(reason: string): void {
    if (!this.initialized) {
      console.warn('Clarity not initialized. Call init() first.');
      return;
    }

    try {
      Clarity.upgrade(reason);
      console.log('Clarity session upgraded:', reason);
    } catch (error) {
      console.error('Failed to upgrade Clarity session:', error);
    }
  }

  /**
   * Check if Clarity is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Track page view (custom helper method)
   */
  trackPageView(pageName: string, additionalTags?: Record<string, string>): void {
    this.trackEvent(`page_view_${pageName}`);
    
    if (additionalTags) {
      Object.entries(additionalTags).forEach(([key, value]) => {
        this.setTag(key, value);
      });
    }
  }

  /**
   * Track user action (custom helper method)
   */
  trackUserAction(action: string, context?: string): void {
    const eventName = context ? `${context}_${action}` : action;
    this.trackEvent(eventName);
  }
}

// Export singleton instance
export const clarityService = new ClarityService();
export default clarityService;
