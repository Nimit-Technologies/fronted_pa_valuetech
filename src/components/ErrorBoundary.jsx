import { Component } from "react";
import { AlertCircle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error Boundary caught:", error, errorInfo);
    }

    // You can also log the error to an external error reporting service here
    // Example: logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
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

              {process.env.NODE_ENV === "development" && this.state.error && (
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
