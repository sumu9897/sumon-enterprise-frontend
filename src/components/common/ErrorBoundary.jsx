import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('Application error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-[#0F1117] px-6 py-24 text-white flex items-center justify-center">
        <div className="max-w-lg text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A84C]">Unexpected error</p>
          <h1 className="mt-4 font-heading text-3xl font-bold">We couldn’t load this page</h1>
          <p className="mt-3 text-white/60">Please refresh the page. If the problem continues, contact our team.</p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="mt-8 rounded-sm bg-[#C9A84C] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A84C]"
          >
            Return home
          </button>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
