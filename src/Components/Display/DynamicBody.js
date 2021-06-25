import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import ErrorsExplained from './ErrorsExplained';
import ErrorBoundary from './ErrorsBoundary';
import stage from '../../transpiling/stage';

const DisplayBody = ({ status, error, component: Component }) => {
    const errorsBoundaryRef = useRef();

    const statusMessage = useMemo(() => {
        let className = '';
        let message = '';

        if (stage.has(stage.error, status)) {
            className = 'code-error';
            message = 'There was an error!';
        } else if (stage.has(stage.rendering, status)) {
            className = 'code-rendering';
            message = 'Rendering the code ...';
        } else if (stage.has(stage.invoking, status)) {
            className = 'code-invoking';
            message = 'Invoking the code ...';
        }

        return <div className={`message ${className}`}>{message}</div>;
    }, [status]);

    const boundComponent = useMemo(() => {
        if (!Component) {
            return <div className="empty-component">&lt; YOUR COMPONENT HERE /&gt;</div>;
        }

        return (
            <ErrorBoundary ref={errorsBoundaryRef}>
                <Component />
            </ErrorBoundary>
        );
    }, [Component]);

    const errors = useMemo(() => {
        if (!stage.has(stage.error, status)) {
            return null;
        }

        const title = stage.has(stage.rendering, status)
            ? 'There was a problem during the rendering'
            : stage.has(stage.invoking, status)
            ? 'There was a problem during the invoking of the module'
            : 'There was a problem';

        return (
            <div className="parsing-error">
                <ErrorsExplained title={title} error={error} />
            </div>
        );
    }, [error, status]);

    useEffect(() => {
        if (stage.has(stage.rendering, status) || stage.has(stage.invoking, status)) {
            errorsBoundaryRef.current?.reset();
        }
    }, [status]);

    return (
        <>
            {errors}
            {boundComponent}
            {statusMessage}
        </>
    );
};

export default DisplayBody;
