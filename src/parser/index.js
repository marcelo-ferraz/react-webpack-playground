import React, { useState, forwardRef, useImperativeHandle, useEffect, useMemo } from 'react';
import ErrorBoundaryForInvoker from './ErrorBoundaryForInvoker';
import ErrorExplained from './ErrorsExplained';
import { isItMeaningful } from './helpers';
import use4DynamicEsModules from './use4DynamicEsModules';

import './BabelParser.scss';
import stage from './stage';

const BabelParser = forwardRef(({ code }, ref) => {
    const invokation = use4DynamicEsModules(code);

    const [error, setError] = useState();

    useImperativeHandle(ref, () => ({ forceRefresh: invokation.forceRefresh }));

    const Body = useMemo(() => {
        switch (true) {
            case error:
                return <ErrorExplained error={error} />;
            case invokation.state === stage.rendering:
                return <div>Rendering the code</div>;
            case invokation.state === stage.invoking:
                return <div>Invoking the code</div>;
            case stage.has(invokation.state, stage.error | stage.rendering):
                return (
                    <ErrorExplained
                        title="There was a problem during the rendering"
                        error={invokation.error}
                    />
                );
            case stage.has(invokation.state, stage.error | stage.invoking):
                return (
                    <ErrorExplained
                        title="There was a problem during the invoking of the module"
                        error={invokation.error}
                    />
                );
            case stage.has(invokation.state, stage.error):
                return <ErrorExplained title="There was a problem" error={invokation.error} />;
            case stage.has(invokation.state, stage.invoked | stage.finished):
                return <ErrorBoundaryForInvoker>{invokation.component}</ErrorBoundaryForInvoker>;
            case (!invokation.component && invokation.state === stage.none) ||
                stage.has(invokation.state, stage.finished):
            default:
                return <div>&lt; YOUR COMPONENT HERE /&gt;</div>;
        }
    }, []);

    let comp = null;
    try {
        comp = (
            <div className="babel-parser columns">
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

export default BabelParser;
