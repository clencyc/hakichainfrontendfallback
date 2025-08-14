# AI Fallback Setup Guide

## Overview

The AI Document Generator now includes a robust fallback system that uses OpenAI as a backup when Google's Gemini API is overloaded or unavailable.

## Setup Instructions

### 1. Install OpenAI Dependency

```bash
npm install openai@^4.28.0
```

### 2. Set Environment Variables

Add the following to your `.env` file:

```env
# Primary AI Service (Google Gemini)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Fallback AI Service (OpenAI)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Get API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to your `.env` file

## How the Fallback System Works

### 1. Primary Attempt (Gemini)
- First tries to generate content using Google's Gemini API
- Uses `gemini-1.5-flash` model for optimal performance

### 2. Retry Logic
- If Gemini returns a 503 "overloaded" error, retries up to 3 times
- Uses exponential backoff (2s, 4s, 6s delays)

### 3. OpenAI Fallback
- If all Gemini attempts fail, automatically switches to OpenAI
- Uses `gpt-3.5-turbo` model for cost-effective fallback
- Maintains streaming response for consistent user experience

### 4. Final Fallback
- If both AI services fail, provides a professional template
- Includes all user inputs and maintains document structure
- Clearly marked as fallback content

## Benefits

✅ **Reliability**: Never fails due to API overload  
✅ **Cost-Effective**: Uses cheaper OpenAI model as fallback  
✅ **Seamless**: User experience remains consistent  
✅ **Professional**: Always provides usable legal document templates  

## Usage

The fallback system works automatically - no user intervention required:

1. **Normal Operation**: Uses Gemini for high-quality AI generation
2. **API Overload**: Automatically retries, then switches to OpenAI
3. **Complete Failure**: Provides professional template with user data

## Monitoring

Check the browser console for detailed logs:
- `Attempt 1/3: Generating content...`
- `Model overloaded, waiting 2 seconds before retry...`
- `Using OpenAI as fallback...`
- `OpenAI streaming chunk: [content]`

## Troubleshooting

### No OpenAI Fallback
- Ensure `VITE_OPENAI_API_KEY` is set in your `.env` file
- Check that the OpenAI API key is valid and has credits

### Both Services Failing
- Check network connectivity
- Verify API keys are correct
- Ensure you have sufficient credits on both platforms

### Performance Issues
- The system will automatically use the fastest available service
- Fallback templates are generated instantly for immediate use

## Cost Optimization

- **Primary**: Gemini API (typically more cost-effective)
- **Fallback**: OpenAI GPT-3.5-turbo (cheaper than GPT-4)
- **Final**: Local template generation (no API costs)

This ensures optimal performance while maintaining cost efficiency.
