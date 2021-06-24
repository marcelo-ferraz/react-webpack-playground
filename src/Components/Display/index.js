import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';

import ErrorBoundary from './ErrorsBoundary';
import stage from '../../transpiling/stage';
import DisplayBody from './DynamicBody';

import './display.scss';

const Display = ({ parser, project, defaultPath }) => {
    const boundariesRef = useRef();

    return (
        <div className="display columns">
            <div className="s-1-12 rows tools">
                <button className="refresh-btn" type="button" onClick={parser.forceRefresh}>
                    <span className={!stage.has(stage.invoked, parser.status) ? 'rotating' : ''}>
                        ⭯
                    </span>
                </button>
                <input type="checkbox" className="regular-checkbox big"></input>
            </div>
            <div className="grow dynamic">
                <ErrorBoundary fatal ref={boundariesRef}>
                    <DisplayBody parser={parser} defaultPath={defaultPath} context={project} />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default forwardRef(Display);
