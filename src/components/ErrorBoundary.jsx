import { Component } from "react";
import { AlertCircle } from "lucide-react";
import logger from "@/utils/logger";

const isDevelopment = import.meta.env.MODE === "development";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Reported in every environment, not just development: a crash that takes
    // out the whole render tree is the one thing worth knowing about in
    // production, and logger.error is the only path that reaches the tracker.
    logger.error("Error Boundary caught a render error", error);
    logger.warn("Error Boundary component stack", {
      componentStack: errorInfo?.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  // A full reload rather than just clearing the flag. This boundary sits
  // outside <Provider> (see main.jsx), so it cannot reset the store: if the
  // crash came from bad persisted state, re-rendering the same tree over the
  // same state crashes again immediately and "Try Again" does nothing visible.
  // Reloading re-runs rehydration and the session check, which is what
  // actually recovers.
  handleReset = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="text-destructive" size={48} />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                We're sorry, but something unexpected happened. Please try
                refreshing the page.
              </p>

              {isDevelopment && this.state.error && (
                <details className="mt-6 text-left bg-muted p-4 rounded-lg mb-6">
                  <summary className="cursor-pointer font-semibold text-sm">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto bg-background p-2 rounded text-destructive">
                    {this.state.error.toString()}
                    {"\n\n"}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/90 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
