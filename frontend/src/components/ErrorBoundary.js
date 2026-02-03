import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Not sure where to go? Perfect</h2>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              I'm flexible
            </button>
            <details className="error-details">
              <summary>Error Details</summary>
              <p>{this.state.error?.message}</p>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;