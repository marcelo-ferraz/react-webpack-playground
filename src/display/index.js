import React, { useState, forwardRef, useImperativeHandle, useEffect, useMemo } from 'react';
import use4DynamicEsModules from '../parser/use4DynamicEsModules';

import ErrorBoundary from './ErrorsBoundary';
import ErrorsExplained from './ErrorsExplained';
import stage from '../parser/stage';

import './display.scss';

const Display = forwardRef(({ entries }, ref) => {
    const invokation = use4DynamicEsModules(entries);

    const [error, setError] = useState();

    useImperativeHandle(ref, () => ({ forceRefresh: invokation.forceRefresh }));

    const Body = useMemo(() => {
        debugger;
        switch (true) {
            case error:
                return <ErrorsExplained error={error} />;
            case invokation.status === stage.rendering:
                return <div>Rendering the code</div>;
            case invokation.status === stage.invoking:
                return <div>Invoking the code</div>;
            case stage.has(invokation.status, stage.error | stage.rendering):
                return (
                    <ErrorsExplained
                        title="There was a problem during the rendering"
                        error={invokation.error}
                    />
                );
            case stage.has(invokation.status, stage.error | stage.invoking):
                return (
                    <ErrorsExplained
                        title="There was a problem during the invoking of the module"
                        error={invokation.error}
                    />
                );
            case stage.has(invokation.status, stage.error):
                return <ErrorsExplained title="There was a problem" error={invokation.error} />;
            case stage.has(invokation.status, stage.invoked | stage.finished):
                return <ErrorBoundary>{invokation.component}</ErrorBoundary>;
            case (!invokation.component && invokation.status === stage.none) ||
                stage.has(invokation.status, stage.finished):
            default:
                return <div>&lt; YOUR COMPONENT HERE /&gt;</div>;
        }
    }, [error, invokation.status]);

    let comp = null;
    try {
        comp = (
            <div className="display columns">
                <div>
                    <button className="refresh" type="button" onClick={invokation.forceRefresh}>
                        <span
                            className={
                                !stage.has(stage.invoked, invokation.status) ? 'rotating' : ''
                            }
                        >
                            ⭯
                        </span>
                    </button>
                </div>
                <div className="grow dynamic">{Body}</div>
            </div>
        );
    } catch (err) {
        setError(err);
    }

    return comp;
});

export default Display;
