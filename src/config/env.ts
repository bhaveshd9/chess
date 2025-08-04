// Environment configuration
export const config = {
  // OpenAI API Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7
  },
  
  // App Configuration
  app: {
    name: 'Chess Master',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development'
  },
  
  // Feature Flags
  features: {
    aiEnabled: !!import.meta.env.VITE_OPENAI_API_KEY,
    analytics: import.meta.env.MODE === 'production',
    debug: import.meta.env.MODE === 'development'
  }
};

// Validate required environment variables
export const validateEnvironment = () => {
  const errors: string[] = [];
  
  if (!config.openai.apiKey && config.features.aiEnabled) {
    errors.push('OpenAI API key is required for AI features');
  }
  
  if (errors.length > 0) {
    console.warn('Environment validation warnings:', errors);
  }
  
  return errors.length === 0;
}; 