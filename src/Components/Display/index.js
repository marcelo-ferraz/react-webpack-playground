import React, { useEffect, useRef } from 'react';

import ErrorBoundary from './ErrorsBoundary';
import stage from '../../transpiling/stage';
import DisplayBody from './DynamicBody';

import './display.scss';

const Display = ({ onForceRefresh, status, error, component }) => {
    const boundariesRef = useRef();

    useEffect(() => {
        if (stage.has(stage.rendering, status) || stage.has(stage.invoking, status)) {
            debugger;
            boundariesRef.current?.reset();
        }
    }, [status]);

    return (
        <div className="display columns">
            <div className="s-1-12 rows tools">
                <button className="refresh-btn" type="button" onClick={onForceRefresh}>
                    <span className={!stage.has(stage.rendering, status) ? 'rotating' : ''}>⭯</span>
                </button>
                <input type="checkbox" className="regular-checkbox big"></input>
            </div>
            <div className="grow dynamic">
                <ErrorBoundary fatal ref={boundariesRef}>
                    <DisplayBody status={status} component={component} error={error} />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default Display;
