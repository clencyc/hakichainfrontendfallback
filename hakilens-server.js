const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || process.env.HAKILENS_PORT || 8000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://hakilens-v77g.onrender.com',
    'http://localhost:5173',
    'http://localhost:8080',
    'https://f9e4cc818023.ngrok-free.app',
    'https://hakichain.netlify.app',
    'https://hakichain.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'ngrok-skip-browser-warning'
  ]
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Mock AI function for now (you'll replace this with actual AI service)
const generateAIResponse = async (prompt, context = '') => {
  // This is a mock response - replace with actual AI service call
  return `Based on your legal query: "${prompt}", here's my analysis... [This would be replaced with actual AI response]`;
};

const generateAISummary = async (caseData) => {
  // Mock AI summary generation - replace with actual AI service
  return `CASE OVERVIEW: ${caseData.case_title || 'Case Title'}\n\nKEY LEGAL ISSUES:\n1. Main legal issue identified\n2. Secondary considerations\n\nCOURT'S FINDINGS: ${caseData.status || 'Status pending'}\n\nLEGAL SIGNIFICANCE: This case demonstrates important precedent...`;
};

// 1. Comprehensive Case Scraping
app.post('/scrape_case', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required', success: false });
    }

    // Scrape the webpage
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract comprehensive data
    const comprehensiveData = {
      basic_info: {
        cases: [{
          case_number: $('h1').first().text().trim() || 'Not found',
          case_title: $('title').text().trim(),
          court_name: extractCourtName($),
          judge_name: extractJudgeName($),
          hearing_date: extractHearingDate($),
          hearing_time: extractHearingTime($),
          case_type: extractCaseType($),
          status: extractStatus($),
          legal_representation: extractLegalRepresentation($),
          subject_matter: extractSubjectMatter($),
          additional_details: extractAdditionalDetails($)
        }]
      },
      content: {
        title: $('title').text().trim(),
        headings: {
          h1: $('h1').map((i, el) => $(el).text().trim()).get(),
          h2: $('h2').map((i, el) => $(el).text().trim()).get()
        },
        paragraphs: $('p').map((i, el) => $(el).text().trim()).get().filter(p => p.length > 10),
        full_text: $.text().replace(/\s+/g, ' ').trim()
      },
      links: $('a').map((i, el) => ({
        url: $(el).attr('href'),
        text: $(el).text().trim(),
        type: classifyLinkType($(el).attr('href')),
        context: $(el).parent().text().trim().substring(0, 200)
      })).get(),
      images: $('img').map((i, el) => ({
        url: $(el).attr('src'),
        alt: $(el).attr('alt'),
        title: $(el).attr('title'),
        context: $(el).parent().text().trim().substring(0, 200)
      })).get(),
      tables: $('table').map((i, el) => ({
        caption: $(el).find('caption').text().trim(),
        headers: $(el).find('th').map((j, th) => $(th).text().trim()).get(),
        rows: $(el).find('tr').map((j, tr) => 
          $(tr).find('td').map((k, td) => $(td).text().trim()).get()
        ).get()
      })).get(),
      documents: $('a[href*=".pdf"], a[href*=".doc"], a[href*=".docx"]').map((i, el) => ({
        url: $(el).attr('href'),
        text: $(el).text().trim(),
        type: $(el).attr('href').split('.').pop(),
        context: $(el).parent().text().trim().substring(0, 200)
      })).get(),
      metadata: {
        title: $('title').text().trim(),
        description: $('meta[name="description"]').attr('content'),
        keywords: $('meta[name="keywords"]').attr('content'),
        author: $('meta[name="author"]').attr('content'),
        language: $('html').attr('lang') || 'en',
        charset: $('meta[charset]').attr('charset') || 'utf-8'
      },
      scraped_at: new Date().toISOString(),
      source_url: url
    };

    // Generate AI analysis
    const aiAnalysis = {
      structured_case_info: comprehensiveData.basic_info.cases[0],
      content_analysis: {
        document_type: classifyDocumentType(comprehensiveData.content.full_text),
        complexity_score: calculateComplexityScore(comprehensiveData.content.full_text),
        key_topics: extractKeyTopics(comprehensiveData.content.full_text),
        legal_areas: extractLegalAreas(comprehensiveData.content.full_text),
        citation_count: (comprehensiveData.content.full_text.match(/\b\d{4}\b.*?\bKLR\b/g) || []).length
      },
      quality_assessment: {
        completeness: comprehensiveData.content.full_text.length > 1000 ? 'high' : 'medium',
        data_quality: comprehensiveData.basic_info.cases[0].case_number !== 'Not found' ? 'high' : 'low',
        extraction_confidence: Math.floor(Math.random() * 3) + 7 // Mock confidence score
      }
    };

    // Generate AI summary
    const aiSummary = await generateAISummary(comprehensiveData.basic_info.cases[0]);

    // Save to database
    const { data, error } = await supabase
      .from('cases')
      .insert({
        case_number: comprehensiveData.basic_info.cases[0].case_number,
        case_title: comprehensiveData.basic_info.cases[0].case_title,
        court_name: comprehensiveData.basic_info.cases[0].court_name,
        judge_name: comprehensiveData.basic_info.cases[0].judge_name,
        hearing_date: comprehensiveData.basic_info.cases[0].hearing_date,
        hearing_time: comprehensiveData.basic_info.cases[0].hearing_time,
        case_type: comprehensiveData.basic_info.cases[0].case_type,
        status: comprehensiveData.basic_info.cases[0].status,
        legal_representation: comprehensiveData.basic_info.cases[0].legal_representation,
        subject_matter: comprehensiveData.basic_info.cases[0].subject_matter,
        additional_details: comprehensiveData.basic_info.cases[0].additional_details,
        source_url: url,
        full_content: comprehensiveData.content.full_text,
        comprehensive_data: comprehensiveData,
        ai_analysis: aiAnalysis,
        ai_summary: aiSummary
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to save case data', success: false });
    }

    res.json({
      database_id: data.id,
      comprehensive_data: comprehensiveData,
      structured_analysis: aiAnalysis,
      success: true
    });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

// 2. AI Chat Interface
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Generate AI response
    const response = await generateAIResponse(message);

    // Save to chat history
    await supabase
      .from('chat_history')
      .insert({
        user_message: message,
        ai_response: response
      });

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Case-Specific Chat
app.post('/case_chat/:case_id', async (req, res) => {
  try {
    const { case_id } = req.params;
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Get case details for context
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', case_id)
      .single();

    if (caseError) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Generate AI response with case context
    const context = `Case: ${caseData.case_title}\nCourt: ${caseData.court_name}\nSummary: ${caseData.ai_summary}`;
    const response = await generateAIResponse(question, context);

    // Save to case chat history
    await supabase
      .from('case_chats')
      .insert({
        case_id: parseInt(case_id),
        user_question: question,
        ai_response: response
      });

    res.json({ response });
  } catch (error) {
    console.error('Case chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Generate Case Summary
app.get('/generate_summary/:case_id', async (req, res) => {
  try {
    const { case_id } = req.params;

    const { data: caseData, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', case_id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Generate new AI summary if not exists or regenerate
    const summary = await generateAISummary(caseData);

    // Update the case with new summary
    await supabase
      .from('cases')
      .update({ ai_summary: summary })
      .eq('id', case_id);

    res.json({ summary });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Search Cases
app.get('/search_cases', async (req, res) => {
  try {
    const { query, case_number, court_name, year } = req.query;

    let dbQuery = supabase
      .from('cases')
      .select('id, case_number, case_title, court_name, judge_name, hearing_date, case_type, status, ai_summary, created_at, source_url');

    // Apply filters
    if (case_number) {
      dbQuery = dbQuery.ilike('case_number', `%${case_number}%`);
    }
    
    if (court_name) {
      dbQuery = dbQuery.ilike('court_name', `%${court_name}%`);
    }
    
    if (year) {
      dbQuery = dbQuery.ilike('hearing_date', `%${year}%`);
    }
    
    if (query) {
      dbQuery = dbQuery.or(`case_title.ilike.%${query}%,full_content.ilike.%${query}%,subject_matter.ilike.%${query}%`);
    }

    const { data: cases, error } = await dbQuery
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: 'Search failed' });
    }

    res.json({ cases });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5b. API route for HakiLens cases (for frontend dashboard)
app.get('/api/hakilens/cases', async (req, res) => {
  try {
    const { limit = 20, offset = 0, search, court_name, case_type, year } = req.query;

    let dbQuery = supabase
      .from('cases')
      .select('id, case_number, case_title, court_name, judge_name, hearing_date, case_type, status, ai_summary, created_at, source_url');

    // Apply filters
    if (search) {
      dbQuery = dbQuery.or(`case_title.ilike.%${search}%,case_number.ilike.%${search}%,full_content.ilike.%${search}%,subject_matter.ilike.%${search}%`);
    }
    
    if (court_name) {
      dbQuery = dbQuery.ilike('court_name', `%${court_name}%`);
    }
    
    if (case_type) {
      dbQuery = dbQuery.ilike('case_type', `%${case_type}%`);
    }
    
    if (year) {
      dbQuery = dbQuery.ilike('hearing_date', `%${year}%`);
    }

    const { data: cases, error, count } = await dbQuery
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch cases', success: false });
    }

    res.json({ 
      cases: cases || [], 
      total: count || 0,
      limit: parseInt(limit),
      offset: parseInt(offset),
      success: true 
    });
  } catch (error) {
    console.error('API cases error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

// 6. Get Case Details
app.get('/case_details/:case_id', async (req, res) => {
  try {
    const { case_id } = req.params;

    const { data: caseData, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', case_id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json(caseData);
  } catch (error) {
    console.error('Case details error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6b. API route for case details (for frontend dashboard)
app.get('/api/hakilens/cases/:case_id', async (req, res) => {
  try {
    const { case_id } = req.params;

    const { data: caseData, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', case_id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Case not found', success: false });
    }

    res.json({ case: caseData, success: true });
  } catch (error) {
    console.error('API case details error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

// 7. Get Case Chat History
app.get('/case_chat_history/:case_id', async (req, res) => {
  try {
    const { case_id } = req.params;

    const { data: history, error } = await supabase
      .from('case_chats')
      .select('*')
      .eq('case_id', case_id)
      .order('timestamp', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch chat history' });
    }

    res.json({ history });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 8. Get General Chat History
app.get('/chat_history', async (req, res) => {
  try {
    const { data: history, error } = await supabase
      .from('chat_history')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch chat history' });
    }

    res.json({ history });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 9. Download Case Documents
app.get('/download_case_pdf/:case_id', async (req, res) => {
  try {
    const { case_id } = req.params;

    const { data: caseData, error } = await supabase
      .from('cases')
      .select('comprehensive_data')
      .eq('id', case_id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const documents = caseData.comprehensive_data?.documents || [];
    res.json({ documents });
  } catch (error) {
    console.error('Download documents error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 10. Get Case Full Content
app.get('/case_full_content/:case_id', async (req, res) => {
  try {
    const { case_id } = req.params;

    const { data: caseData, error } = await supabase
      .from('cases')
      .select('full_content, source_url, scraped_at')
      .eq('id', case_id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json({
      full_content: caseData.full_content,
      source_url: caseData.source_url,
      scraped_at: caseData.scraped_at
    });
  } catch (error) {
    console.error('Full content error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper functions for data extraction
function extractCourtName($) {
  const text = $.text();
  const courtPattern = /(High Court|Court of Appeal|Supreme Court|Magistrate|Employment|Environment|Commercial)/i;
  const match = text.match(courtPattern);
  return match ? match[0] : 'Not specified';
}

function extractJudgeName($) {
  const text = $.text();
  const judgePattern = /(Hon\.?\s+)?Justice\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i;
  const match = text.match(judgePattern);
  return match ? match[0] : 'Not specified';
}

function extractHearingDate($) {
  const text = $.text();
  const datePattern = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}\b|\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i;
  const match = text.match(datePattern);
  return match ? match[0] : 'Not specified';
}

function extractHearingTime($) {
  const text = $.text();
  const timePattern = /\b\d{1,2}:\d{2}\s*(AM|PM)?\b/i;
  const match = text.match(timePattern);
  return match ? match[0] : 'Not specified';
}

function extractCaseType($) {
  const text = $.text();
  const typePattern = /(Civil|Criminal|Constitutional|Commercial|Employment|Family|Land)/i;
  const match = text.match(typePattern);
  return match ? match[0] : 'Not specified';
}

function extractStatus($) {
  const text = $.text();
  const statusPattern = /(Judgment Reserved|Judgment Delivered|Pending|In Progress|Completed|Dismissed)/i;
  const match = text.match(statusPattern);
  return match ? match[0] : 'Pending';
}

function extractLegalRepresentation($) {
  const text = $.text();
  const advocatePattern = /Advocate\s+[A-Z][a-z]+\s+[A-Z][a-z]+/i;
  const match = text.match(advocatePattern);
  return match ? match[0] : 'Not specified';
}

function extractSubjectMatter($) {
  const text = $.text();
  const subjectPattern = /(contract|dispute|succession|employment|constitutional|land|property|family)/i;
  const match = text.match(subjectPattern);
  return match ? `${match[0]} matter` : 'Legal matter';
}

function extractAdditionalDetails($) {
  return 'Additional case details extracted from source';
}

function classifyLinkType(href) {
  if (!href) return 'unknown';
  if (href.includes('kenyalaw.org')) return 'case_law';
  if (href.includes('legislation')) return 'legislation';
  if (href.includes('.pdf') || href.includes('.doc')) return 'document';
  if (href.startsWith('http')) return 'external';
  return 'internal';
}

function classifyDocumentType(text) {
  if (text.includes('judgment') || text.includes('ruling')) return 'case judgment';
  if (text.includes('cause list') || text.includes('hearing')) return 'causelist';
  if (text.includes('act') || text.includes('bill')) return 'legislation';
  return 'legal document';
}

function calculateComplexityScore(text) {
  const factors = [
    text.length > 5000 ? 3 : text.length > 2000 ? 2 : 1,
    (text.match(/\b(whereas|notwithstanding|pursuant|heretofore)\b/gi) || []).length,
    (text.match(/\b\d{4}\b.*?\bKLR\b/g) || []).length
  ];
  return Math.min(10, factors.reduce((a, b) => a + b, 0));
}

function extractKeyTopics(text) {
  const topics = [];
  const patterns = {
    'contract law': /\b(contract|agreement|breach|consideration|offer|acceptance)\b/gi,
    'constitutional law': /\b(constitution|fundamental|rights|bill of rights)\b/gi,
    'criminal law': /\b(criminal|offence|theft|assault|murder)\b/gi,
    'family law': /\b(marriage|divorce|custody|succession|inheritance)\b/gi,
    'land law': /\b(land|property|title|deed|ownership)\b/gi,
    'employment law': /\b(employment|employer|employee|dismissal|salary)\b/gi
  };
  
  for (const [topic, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      topics.push(topic);
    }
  }
  
  return topics.length > 0 ? topics : ['general legal matter'];
}

function extractLegalAreas(text) {
  return extractKeyTopics(text); // Same logic for now
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'HakiLens API', timestamp: new Date().toISOString() });
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'HakiLens API',
    version: '1.0.0',
    description: 'AI-powered legal case search and analysis platform',
    endpoints: {
      'POST /scrape_case': 'Research and analyze legal cases',
      'POST /chat': 'General AI chat interface',
      'POST /case_chat/:case_id': 'Case-specific chat',
      'GET /generate_summary/:case_id': 'Generate case summary',
      'GET /search_cases': 'Search cases with filters',
      'GET /case_details/:case_id': 'Get detailed case information',
      'GET /case_chat_history/:case_id': 'Get case chat history',
      'GET /chat_history': 'Get general chat history',
      'GET /download_case_pdf/:case_id': 'Get case documents',
      'GET /case_full_content/:case_id': 'Get full case content'
    },
    documentation: 'https://github.com/HakiChain-Main/Hakichain-Site/blob/main/docs/HAKILENS_API.md'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 HakiLens API Server running on http://localhost:${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
