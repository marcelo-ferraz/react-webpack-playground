import React, { useReducer, useRef } from 'react';
import Editor from './editor';
import Display from './display';
import contextReducer from './contextReducer';

import './Playground.scss';

const defaultState = {
    entries: {
        './app.js': '',
    },
};

export default function Playground({ initialContext }) {
    const [dynamicContext, dispatch] = useReducer(contextReducer, initialContext || defaultState);

    const saveEntry = (key, value) => {
        dispatch({ type: 'save-entry', payload: { [key]: value } });
    };

    const renameEntry = (oldKey, newKey) => {
        dispatch({ type: 'rename-entry', payload: { oldKey, newKey } });
    };

    const parser = useRef();

    return (
        <div className="playground rows">
            <div className="s-1 s-sm-1-2">
                <Editor context={dynamicContext} onRename={renameEntry} onChange={saveEntry} />
            </div>
            <div className="s-1 s-sm-1-2">
                <Display context={dynamicContext} ref={parser} />
            </div>
        </div>
    );
}
