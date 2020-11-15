import React, { useEffect, useReducer, useRef } from 'react';
import Editor from './editor';
import Display from './display';
import contextReducer from './contextReducer';

import './Playground.scss';
import { defaultEntryPath } from './parser/webpackInvoker';
import Menu from './Menu';
import PlaygroundContext from './PlaygroundContext';

const defaultState = {
    entries: {
        [defaultEntryPath]: '',
    },
};

export default function Playground({ lilProject, defaultPath = defaultEntryPath }) {
    const [lilProj, dispatch] = useReducer(contextReducer, defaultState);
    const parser = useRef();

    const setSelectedEntry = (entry) => {
        dispatch({ type: 'set-selected-entry', payload: { entry } });
    };

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
            setSelectedEntry(defaultPath);
        }
    }, [defaultPath, lilProject]);

    return (
        <div className="playground rows">
            <PlaygroundContext.Provider
                value={{
                    currentProject: lilProj,
                    selectedEntry: lilProj.selectedEntry,
                    setSelectedEntry,
                }}
            >
                <div className="side-menu-container">
                    <Menu />
                </div>
                <div className="display-container">
                    <Display project={lilProj} ref={parser} defaultPath={defaultPath} />
                </div>
                <div className="s-1 s-sm-1-2">
                    <Editor project={lilProj} onRename={renameEntry} onChange={saveEntry} />
                </div>
            </PlaygroundContext.Provider>
        </div>
    );
}
