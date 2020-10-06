import { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';

import './BabelParser.scss';
import stage from './stage';
import { isItMeaningful } from './helpers';

import { render, jInvoke } from './webpackInvoke';

export default function use4DynamicEsModules(entries, refreshDelay = 300) {
    const [status, setStatus] = useState(stage.none);
    const [error, setError] = useState();
    const [invokedComponent, setInvokedComponent] = useState(null);
    const debouncedRenderer = useRef();

    const render = async (units) => {
        let phase = stage.rendering;
        try {
            setStatus(phase);

            const ctx = await render(units);

            if (!ctx) {
                setStatus(stage.notInvoked | stage.finished);
                return;
            }
            setStatus((phase = stage.invoking));
            const { exports } = jInvoke(ctx);
            setInvokedComponent(exports.default);
            setStatus(stage.invoked | stage.finished);
        } catch (err) {
            setError(err);
            setStatus(phase | stage.error);
        }
    };

    useEffect(() => {
        debouncedRenderer.current = debounce(render, refreshDelay, {
            maxWait: refreshDelay * 1.4,
            trailing: true,
        });

        return () => debouncedRenderer.current.cancel();
    }, [refreshDelay]);

    useEffect(() => {
        if (!!entries && isItMeaningful(entries[defaultEntry]) && !!debouncedRenderCode.current) {
            debouncedRenderer.current(entries);
        }
    }, [entries]);

    const forceRefresh = () => {
        if (!stage.has(stage.rendering, status)) {
            renderCode(entries);
        }
    };

    return {
        canInvoke: stage.has(stage.invoked, status),
        component: invokedComponent,
        forceRefresh,
        status,
        error,
    };
}
