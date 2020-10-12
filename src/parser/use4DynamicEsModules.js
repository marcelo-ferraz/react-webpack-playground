import { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';

import stage from './stage';
import { isItMeaningful } from './helpers';

import { render as webpackRender, jsInvoke, defaultEntryPath } from '../parser/webpackInvoker';

export default function use4DynamicEsModules(entries, defaultEntry = defaultEntryPath) {
    const [status, setStatus] = useState(stage.none);
    const [error, setError] = useState();
    const [invokedComponent, setInvokedComponent] = useState(null);

    const render = async (units) => {
        let phase = stage.rendering;
        try {
            setStatus(phase);
            console.log('rendering component!');
            const ctx = await webpackRender(units);

            if (!ctx) {
                setStatus(stage.notInvoked | stage.finished);
                return;
            }
            setStatus((phase = stage.invoking));
            const { exports } = jsInvoke(ctx);
            setInvokedComponent(exports.default);
            setStatus(stage.invoked | stage.finished);
        } catch (err) {
            setError(err);
            setStatus(phase | stage.error);
        }
    };

    useEffect(() => {
        if (!!entries && isItMeaningful(entries[defaultEntry])) {
            render(entries);
        }
    }, [entries]);

    const forceRefresh = () => {
        if (!stage.has(stage.rendering, status)) {
            render(entries);
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
