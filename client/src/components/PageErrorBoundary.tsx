import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  errorMsg: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  pageName?: string;
  onRetry?: () => void;
}

/**
 * PageErrorBoundary — wraps every dashboard page tab.
 * Catches ALL unhandled JS / render errors and shows a clean
 * recovery UI instead of a blank white/dark screen.
 * The "Retry" button resets state so the page re-mounts fresh.
 */
export class PageErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMsg: error?.message || "Unknown error" };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Silent — don't surface stack traces to end user
    console.error("[PageErrorBoundary]", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMsg: "" });
    this.props.onRetry?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-16 animate-in fade-in duration-300">
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 mb-6 shadow-sm">
          <AlertTriangle className="h-10 w-10 text-rose-500 dark:text-rose-400" />
        </div>

        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
          {this.props.pageName
            ? `${this.props.pageName} failed to load`
            : "Page failed to load"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-1">
          Something went wrong while rendering this page.
        </p>
        <p className="text-xs font-mono text-rose-400 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/20 mb-6 max-w-sm truncate">
          {this.state.errorMsg}
        </p>

        <button
          onClick={this.handleRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Page
        </button>
      </div>
    );
  }
}
