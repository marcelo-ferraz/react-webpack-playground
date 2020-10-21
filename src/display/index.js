import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';

import ErrorBoundary from './ErrorsBoundary';
import stage from '../parser/stage';
import DisplayBody from './DynamicBody';

import './display.scss';

export default forwardRef(({ context, defaultPath }, ref) => {
    const invokationRef = useRef();
    const boundariesRef = useRef();

    useImperativeHandle(ref, () => ({
        forceRefresh: invokationRef.current ? invokationRef.current.forceRefresh : () => {},
    }));

    useEffect(() => {
        if (boundariesRef.current.error) {
            boundariesRef.current.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invokationRef.current]);

    return (
        <div className="display columns">
            <div className="s-1-12">
                <button
                    className="refresh"
                    type="button"
                    onClick={invokationRef.current && invokationRef.current.forceRefresh}
                >
                    <span
                        className={
                            invokationRef.current &&
                            !stage.has(stage.invoked, invokationRef.current.status)
                                ? 'rotating'
                                : ''
                        }
                    >
                        ⭯
                    </span>
                </button>
            </div>
            <div className="grow dynamic">
                <ErrorBoundary fatal ref={boundariesRef}>
                    <DisplayBody ref={invokationRef} context={context} defaultPath={defaultPath} />
                </ErrorBoundary>
            </div>
        </div>
    );
});
