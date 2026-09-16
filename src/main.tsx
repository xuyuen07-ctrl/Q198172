import React, { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against unhandled rejections or cross-frame script errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Suppress benign audio autoplay or frame detachment rejections
    if (
      event.reason &&
      (String(event.reason).includes('AudioContext') ||
        String(event.reason).includes('gesture') ||
        String(event.reason).includes('user') ||
        String(event.reason).includes('Script error'))
    ) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    // Handle benign resize observer loop errors
    if (event.message && event.message.includes('ResizeObserver loop')) {
      event.stopImmediatePropagation();
    }
  });
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App runtime error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 text-center select-none">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            <h2 className="text-lg font-black text-rose-400 mb-2">畫面載入中發生異常</h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              系統已自動捕捉運行狀態，請點擊下方按鈕重新載入競技場。
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              重新載入競技場
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
