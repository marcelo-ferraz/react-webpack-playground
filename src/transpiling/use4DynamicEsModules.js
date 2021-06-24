import { useState, useEffect, useRef } from 'react';
import { pathFinder } from './helpers';

import stage from './stage';
import { renderElsewhere as webpackRender, jsInvoke, defaultEntryPath } from './webpackInvoker';

export default function use4DynamicEsModules(context, defaultEntry) {
    const [status, setStatus] = useState(stage.none);
    const [error, setError] = useState();
    const invokedComponent = useRef();

    const render = async (project, entryPath = defaultEntryPath) => {
        const finder = pathFinder(project.entries);
        const [, entry] = finder(entryPath);

        if (!entry) {
            return;
        }

        let phase = stage.rendering;
        try {
            setStatus(phase);
            const ctx = await webpackRender(project, entryPath, finder);
            if (!ctx) {
                setStatus(stage.notInvoked | stage.finished);
                invokedComponent.current = null;
                return;
            }
            setStatus((phase = stage.invoking));

            const { exports } = jsInvoke(ctx);

            invokedComponent.current = exports.default;
            setStatus(stage.invoked | stage.finished);
        } catch (err) {
            setError(err);
            setStatus(phase | stage.error);
        }
    };

    useEffect(() => {
        if (context) {
            render(context, defaultEntry);
        }
    }, [context, defaultEntry]);

    const forceRefresh = () => {
        if (!stage.has(stage.rendering, status)) {
            render(context, defaultEntry);
        }
    };

    return {
        canInvoke: stage.has(stage.invoked, status),
        component: invokedComponent.current || null,
        forceRefresh,
        status,
        error,
    };
}
