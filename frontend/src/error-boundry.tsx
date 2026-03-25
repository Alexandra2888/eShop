import React, { ReactNode } from "react";

interface ErrorBoundryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundryState {
  hasError: boolean;
}

export class ErrorBoundry extends React.Component<ErrorBoundryProps, ErrorBoundryState> {
  state: ErrorBoundryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}