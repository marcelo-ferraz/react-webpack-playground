import React, { forwardRef, useImperativeHandle } from 'react';
import use4DynamicEsModules from '../../transpiling/use4DynamicEsModules';
import ErrorsExplained from './ErrorsExplained';
import ErrorBoundary from './ErrorsBoundary';
import stage from '../../transpiling/stage';

const DisplayBody = ({ context, defaultEntry }, ref) => {
    const invokation = use4DynamicEsModules(context, defaultEntry);

    useImperativeHandle(ref, () => invokation);

    switch (true) {
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
        case stage.has(invokation.status, stage.invoked | stage.finished) &&
            !!invokation.component: {
            const Component = invokation.component;
            return (
                <ErrorBoundary>
                    <Component />
                </ErrorBoundary>
            );
        }
        case (!invokation.component && invokation.status === stage.none) ||
            stage.has(invokation.status, stage.finished):
        default:
            return <div>&lt; YOUR COMPONENT HERE /&gt;</div>;
    }
};

export default forwardRef(DisplayBody);
