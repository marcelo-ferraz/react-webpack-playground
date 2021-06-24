import React, { forwardRef, useImperativeHandle } from 'react';
import use4DynamicEsModules from '../../transpiling/use4DynamicEsModules';
import ErrorsExplained from './ErrorsExplained';
import ErrorBoundary from './ErrorsBoundary';
import stage from '../../transpiling/stage';

const DisplayBody = ({ parser }) => {
    debugger;
    switch (true) {
        case parser.status === stage.rendering:
            return <div>Rendering the code</div>;
        case parser.status === stage.invoking:
            return <div>Invoking the code</div>;
        case stage.has(parser.status, stage.error | stage.rendering):
            return (
                <ErrorsExplained
                    title="There was a problem during the rendering"
                    error={parser.error}
                />
            );
        case stage.has(parser.status, stage.error | stage.invoking):
            return (
                <ErrorsExplained
                    title="There was a problem during the invoking of the module"
                    error={parser.error}
                />
            );
        case stage.has(parser.status, stage.error):
            return <ErrorsExplained title="There was a problem" error={parser.error} />;
        case stage.has(parser.status, stage.invoked | stage.finished) && !!parser.component: {
            const Component = parser.component;
            return (
                <ErrorBoundary>
                    <Component />
                </ErrorBoundary>
            );
        }
        case (!parser.component && parser.status === stage.none) ||
            stage.has(parser.status, stage.finished):
        default:
            return <div>&lt; YOUR COMPONENT HERE /&gt;</div>;
    }
};

export default forwardRef(DisplayBody);
