import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeApp } from './utils/init.ts';

// Import test runner for development
import { testRunner } from './testRunner.ts';

try {
  console.log('🚀 Starting Chess App...');
  initializeApp();
  
  // Make test functions available in development
  if (import.meta.env.DEV) {
    (window as any).runChessTests = () => testRunner.runAllTests();
    console.log('🧪 Test functions available:');
    console.log('  - runChessTests() - Full test suite');
  }
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  console.log('✅ Chess App started successfully');
} catch (error) {
  console.error('❌ Failed to start Chess App:', error);
}
