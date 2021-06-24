import React, { Component, forwardRef } from 'react';
import ErrorsExplained from './ErrorsExplained';

const initial_state = {
    error: null,
    info: null,
};

const ErrorsBoundary = (props, ref) => {
    class ErrorBoundariesImpl extends Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };

            if (ref) {
                ref.current = { reset: () => this.reset(), error: this.state.error };
            }
        }

        static getDerivedStateFromError(error) {
            return { error, hasError: true };
        }

        componentDidCatch(error, info) {
            this.setState({ error: error, info: info });
        }

        reset() {
            this.setState(initial_state);
        }

        render() {
            if (this.state.error) {
                return <ErrorsExplained fatal error={this.state.error} />;
            }

            return this.props.children;
        }
    }

    return <ErrorBoundariesImpl {...props} />;
};

export default forwardRef(ErrorsBoundary);
