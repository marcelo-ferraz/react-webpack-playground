import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { pathFinder } from './helpers';

import stage from './stage';
import renderMode from './renderMode';
import { renderElsewhere, renderHere, jsInvoke, defaultEntryPath } from './webpackInvoker';
import debounce from 'lodash.debounce';

export default function use4DynamicEsModules(context, defaultEntry, mode = renderMode.parallel) {
    const [status, setStatus] = useState(stage.none);
    const [error, setError] = useState();
    const invokedComponent = useRef();

    const webpackRender = useMemo(
        () => (mode === renderMode.parallel ? renderElsewhere : renderHere),
        [mode],
    );

    const render = useMemo(
        () =>
            debounce(async (project, entryPath = defaultEntryPath) => {
                const finder = pathFinder(project.entries);
                const [, entry] = finder(entryPath);

                if (!entry) {
                    return;
                }

                let phase = stage.rendering;
                try {
                    setError(null);
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
            }, 250),
        [webpackRender],
    );

    useEffect(() => {
        if (context) {
            render(context, defaultEntry);
        }
    }, [context, defaultEntry, render]);

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
