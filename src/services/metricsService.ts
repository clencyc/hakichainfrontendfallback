/**
 * HakiChain Metrics Service
 * Tracks and manages all platform metrics for dashboard analytics
 */

import { supabase } from '../lib/supabase';

// Metric Types
export type MetricType = 'usage' | 'engagement' | 'outcome';

// Service Categories
export type ServiceCategory = 
  | 'haki_draft' 
  | 'haki_reviews' 
  | 'haki_lens' 
  | 'haki_reminder' 
  | 'haki_bot';

// Base Metric Interface
interface BaseMetric {
  id?: string;
  user_id: string;
  service: ServiceCategory;
  metric_type: MetricType;
  metric_name: string;
  value: number;
  metadata?: Record<string, any>;
  timestamp: Date;
}

// Specific Metric Interfaces
export interface HakiDraftMetrics {
  // Usage Metrics
  documentsGenerated: number;
  caseApprovalsInitiated: number;
  approvedCaseDownloads: number;
  
  // Engagement Metrics
  avgTimeToGenerate: number; // in minutes
  avgTimeToApproval: number; // in hours
  approvalStageReachRate: number; // percentage
  
  // Outcome Metrics
  approvalCompletionRate: number; // percentage
  userSatisfactionScore: number; // 1-5 scale
}

export interface HakiReviewsMetrics {
  // Usage Metrics
  casesUploaded: number;
  caseEdits: number;
  storedCasesAfterReview: number;
  
  // Engagement Metrics
  avgEditsPerCase: number;
  avgReviewTime: number; // in minutes
  chatsPerReviewSession: number;
  
  // Outcome Metrics
  casesApprovedAfterReview: number; // percentage
  qualityRating: number; // 1-5 scale
}

export interface HakiLensMetrics {
  // Usage Metrics
  pdfSummariesDownloaded: number;
  researchRequestsSubmitted: number;
  researchSessionsCreated: number;
  
  // Engagement Metrics
  avgQuestionsPerSession: number;
  sessionLength: number; // in minutes
  repeatSessionsPerUser: number;
  
  // Outcome Metrics
  requestsFulfilledWithinSLA: number; // percentage
  lawyerSatisfactionScore: number; // 1-5 scale
}

export interface HakiReminderMetrics {
  // Usage Metrics
  remindersCreated: number;
  emailNotificationsSent: number;
  smsNotificationsSent: number;
  
  // Engagement Metrics
  remindersAcknowledged: number; // percentage
  avgReminderLeadTime: number; // in hours
  
  // Outcome Metrics
  reminderSuccessRate: number; // percentage
  missedDeadlineReduction: number; // percentage
}

export interface HakiBotMetrics {
  // Usage Metrics
  botQueriesMade: number;
  uniqueUsersInteracting: number;
  
  // Engagement Metrics
  avgQueriesPerUserSession: number;
  avgSessionDuration: number; // in minutes
  
  // Outcome Metrics
  queryResolutionRate: number; // percentage
  userRatingBotResponses: number; // 1-5 scale
}

class MetricsService {
  /**
   * Track a metric event
   */
  async trackMetric(metric: BaseMetric): Promise<void> {
    try {
      const { error } = await supabase
        .from('metrics')
        .insert([{
          ...metric,
          timestamp: metric.timestamp.toISOString()
        }]);

      if (error) throw error;

      console.log(`✅ Metric tracked: ${metric.service}.${metric.metric_name}`, metric.value);
    } catch (error) {
      console.error('❌ Failed to track metric:', error);
    }
  }

  // HAKI DRAFT TRACKING METHODS
  async trackDocumentGenerated(userId: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_draft',
      metric_type: 'usage',
      metric_name: 'documents_generated',
      value: 1,
      metadata,
      timestamp: new Date()
    });
  }

  async trackCaseApprovalInitiated(userId: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_draft',
      metric_type: 'usage',
      metric_name: 'case_approvals_initiated',
      value: 1,
      metadata,
      timestamp: new Date()
    });
  }

  async trackApprovedCaseDownload(userId: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_draft',
      metric_type: 'usage',
      metric_name: 'approved_case_downloads',
      value: 1,
      metadata,
      timestamp: new Date()
    });
  }

  async trackDocumentGenerationTime(userId: string, timeInMinutes: number): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_draft',
      metric_type: 'engagement',
      metric_name: 'document_generation_time',
      value: timeInMinutes,
      timestamp: new Date()
    });
  }

  async trackUserSatisfaction(userId: string, service: ServiceCategory, rating: number): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service,
      metric_type: 'outcome',
      metric_name: 'user_satisfaction_score',
      value: rating,
      timestamp: new Date()
    });
  }

  // HAKI REVIEWS TRACKING METHODS
  async trackCaseUploaded(userId: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_reviews',
      metric_type: 'usage',
      metric_name: 'cases_uploaded',
      value: 1,
      metadata,
      timestamp: new Date()
    });
  }

  async trackCaseEdit(userId: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_reviews',
      metric_type: 'usage',
      metric_name: 'case_edits',
      value: 1,
      metadata,
      timestamp: new Date()
    });
  }

  async trackReviewTime(userId: string, timeInMinutes: number): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_reviews',
      metric_type: 'engagement',
      metric_name: 'review_time',
      value: timeInMinutes,
      timestamp: new Date()
    });
  }

  // HAKI LENS TRACKING METHODS
  async trackPdfSummaryDownload(userId: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_lens',
      metric_type: 'usage',
      metric_name: 'pdf_summaries_downloaded',
      value: 1,
      metadata,
      timestamp: new Date()
    });
  }

  async trackResearchRequest(userId: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_lens',
      metric_type: 'usage',
      metric_name: 'research_requests_submitted',
      value: 1,
      metadata,
      timestamp: new Date()
    });
  }

  async trackResearchSession(userId: string, sessionLengthMinutes: number, questionsAsked: number): Promise<void> {
    // Track session creation
    await this.trackMetric({
      user_id: userId,
      service: 'haki_lens',
      metric_type: 'usage',
      metric_name: 'research_sessions_created',
      value: 1,
      timestamp: new Date()
    });

    // Track session length
    await this.trackMetric({
      user_id: userId,
      service: 'haki_lens',
      metric_type: 'engagement',
      metric_name: 'session_length',
      value: sessionLengthMinutes,
      timestamp: new Date()
    });

    // Track questions asked
    await this.trackMetric({
      user_id: userId,
      service: 'haki_lens',
      metric_type: 'engagement',
      metric_name: 'questions_per_session',
      value: questionsAsked,
      timestamp: new Date()
    });
  }

  // HAKI REMINDER TRACKING METHODS
  async trackReminderCreated(userId: string, notificationType: 'email' | 'sms', metadata?: Record<string, any>): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_reminder',
      metric_type: 'usage',
      metric_name: 'reminders_created',
      value: 1,
      metadata: { ...metadata, notification_type: notificationType },
      timestamp: new Date()
    });

    // Track notification type
    await this.trackMetric({
      user_id: userId,
      service: 'haki_reminder',
      metric_type: 'usage',
      metric_name: `${notificationType}_notifications_sent`,
      value: 1,
      metadata,
      timestamp: new Date()
    });
  }

  async trackReminderAcknowledged(userId: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_reminder',
      metric_type: 'engagement',
      metric_name: 'reminders_acknowledged',
      value: 1,
      metadata,
      timestamp: new Date()
    });
  }

  async trackReminderSuccess(userId: string, successful: boolean): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_reminder',
      metric_type: 'outcome',
      metric_name: 'reminder_success',
      value: successful ? 1 : 0,
      timestamp: new Date()
    });
  }

  // HAKI BOT TRACKING METHODS
  async trackBotQuery(userId: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_bot',
      metric_type: 'usage',
      metric_name: 'bot_queries_made',
      value: 1,
      metadata,
      timestamp: new Date()
    });
  }

  async trackBotSession(userId: string, sessionDurationMinutes: number, queriesInSession: number): Promise<void> {
    // Track session duration
    await this.trackMetric({
      user_id: userId,
      service: 'haki_bot',
      metric_type: 'engagement',
      metric_name: 'session_duration',
      value: sessionDurationMinutes,
      timestamp: new Date()
    });

    // Track queries per session
    await this.trackMetric({
      user_id: userId,
      service: 'haki_bot',
      metric_type: 'engagement',
      metric_name: 'queries_per_session',
      value: queriesInSession,
      timestamp: new Date()
    });
  }

  async trackBotQueryResolution(userId: string, resolved: boolean): Promise<void> {
    await this.trackMetric({
      user_id: userId,
      service: 'haki_bot',
      metric_type: 'outcome',
      metric_name: 'query_resolution',
      value: resolved ? 1 : 0,
      timestamp: new Date()
    });
  }

  // DASHBOARD DATA RETRIEVAL METHODS
  async getDashboardMetrics(
    service?: ServiceCategory,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    try {
      let query = supabase
        .from('metrics')
        .select('*');

      if (service) {
        query = query.eq('service', service);
      }

      if (startDate) {
        query = query.gte('timestamp', startDate.toISOString());
      }

      if (endDate) {
        query = query.lte('timestamp', endDate.toISOString());
      }

      const { data, error } = await query
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return this.aggregateMetrics(data || []);
    } catch (error) {
      console.error('❌ Failed to retrieve dashboard metrics:', error);
      return null;
    }
  }

  private aggregateMetrics(rawMetrics: any[]): any {
    const aggregated: Record<string, any> = {};

    // Group metrics by service
    const serviceGroups = rawMetrics.reduce((groups, metric) => {
      if (!groups[metric.service]) {
        groups[metric.service] = [];
      }
      groups[metric.service].push(metric);
      return groups;
    }, {});

    // Aggregate each service's metrics
    Object.keys(serviceGroups).forEach(service => {
      const serviceMetrics = serviceGroups[service];
      aggregated[service] = this.aggregateServiceMetrics(serviceMetrics);
    });

    return aggregated;
  }

  private aggregateServiceMetrics(metrics: any[]): any {
    const aggregated: Record<string, any> = {
      usage: {},
      engagement: {},
      outcome: {}
    };

    metrics.forEach(metric => {
      const { metric_type, metric_name, value } = metric;
      
      if (!aggregated[metric_type][metric_name]) {
        aggregated[metric_type][metric_name] = {
          total: 0,
          count: 0,
          average: 0,
          values: []
        };
      }

      aggregated[metric_type][metric_name].total += value;
      aggregated[metric_type][metric_name].count += 1;
      aggregated[metric_type][metric_name].values.push(value);
      aggregated[metric_type][metric_name].average = 
        aggregated[metric_type][metric_name].total / aggregated[metric_type][metric_name].count;
    });

    return aggregated;
  }

  async getServiceMetricsSummary(service: ServiceCategory): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    return await this.getDashboardMetrics(service, startDate, endDate);
  }
}

export const metricsService = new MetricsService();
