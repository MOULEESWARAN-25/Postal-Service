"use client";
import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-5 border border-red-200 bg-red-50/50 rounded-xl max-w-xl mx-auto my-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-red-900">Component Render Failed</h3>
              <p className="text-xs text-red-700 leading-relaxed">
                An unexpected error occurred while loading this section of the decision support interface.
              </p>
              {this.state.error?.message && (
                <pre className="mt-2 p-2 bg-red-100/50 rounded text-xs font-mono text-red-800 break-all whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              )}
            </div>
          </div>
          <div className="flex justify-end border-t border-red-200/50 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleReset}
              className="border-red-200 text-red-800 hover:bg-red-50 hover:text-red-900 gap-1.5 h-8 font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Section
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
