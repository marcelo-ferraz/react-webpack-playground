import React, { useEffect, useReducer, useRef } from 'react';
import Editor from './editor';
import Display from './display';
import contextReducer from './contextReducer';

import './Playground.scss';
import { defaultEntryPath } from './parser/webpackInvoker';

const defaultState = {
    entries: {
        [defaultEntryPath]: '',
    },
};

export default function Playground({ lilProject, defaultPath = defaultEntryPath }) {
    const [littleProject, dispatch] = useReducer(contextReducer, defaultState);
    const parser = useRef();

    const saveEntry = (key, value) => {
        dispatch({ type: 'save-entry', payload: { [key]: value } });
        parser.current && parser.current.forceRefresh();
    };

    const renameEntry = (oldKey, newKey) => {
        dispatch({ type: 'rename-entry', payload: { oldKey, newKey } });
    };

    useEffect(() => {
        if (lilProject) {
            dispatch({ type: 'save-project', payload: lilProject });
        }
    }, [lilProject]);

    return (
        <div className="playground rows">
            <div className="s-1 s-sm-1-2">
                <Display context={littleProject} ref={parser} defaultPath={defaultPath} />
            </div>
            <div className="s-1 s-sm-1-2">
                <Editor
                    project={littleProject}
                    defaultPath={defaultPath}
                    onRename={renameEntry}
                    onChange={saveEntry}
                />
            </div>
        </div>
    );
}
