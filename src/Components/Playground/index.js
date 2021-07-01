import React, { useMemo, useEffect, useReducer, useRef } from 'react';
import debounce from 'lodash/debounce';
import Editor from '../Editor';
import Display from '../Display';
import contextReducer from '../../contextReducer';

import { defaultEntryPath as transpilersDefaultEntryPath } from '../../transpiling/webpackInvoker';
import Menu from '../Menu';
import PlaygroundContext from '../../PlaygroundContext';

import './Playground.scss';
import use4DynamicEsModules from '../../transpiling/use4DynamicEsModules';

const defaultEntryPath = `${transpilersDefaultEntryPath}.js`;

const defaultState = {
    entries: {
        [defaultEntryPath]: '',
    },
};

const useForPlayground = (entryPath) => {
    const [lilProj, dispatch] = useReducer(contextReducer, defaultState);
    const parser = use4DynamicEsModules(lilProj, entryPath);

    const actions = useMemo(
        () => ({
            saveEntry: (key, value) => {
                dispatch({ type: 'save-entry', payload: { [key]: value } });
            },
            renameEntry: (oldKey, newKey) => {
                dispatch({ type: 'rename-entry', payload: { oldKey, newKey } });
            },
            setSelectedEntry: (entry) => {
                dispatch({ type: 'set-selected-entry', payload: { entry } });
            },
            saveProject: (project) => {
                dispatch({ type: 'save-project', payload: project });
            },
        }),
        [],
    );

    return [actions, lilProj, parser];
};

export default function Playground({ lilProject, entryPath = defaultEntryPath }) {
    const [actions, lilProj, parser] = useForPlayground(entryPath);

    useEffect(() => {
        if (lilProject) {
            actions.saveProject(lilProject);
            actions.setSelectedEntry(entryPath);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entryPath, lilProject]);

    return (
        <div className="playground rows">
            <PlaygroundContext.Provider
                value={{
                    currentProject: lilProj,
                    selectedEntry: lilProj.selectedEntry,
                    setSelectedEntry: actions.setSelectedEntry,
                }}
            >
                <div className="side-menu-container">
                    <Menu />
                </div>
                <div className="display-container">
                    <Display
                        status={parser.status}
                        component={parser.component}
                        error={parser.error}
                        onForceRefresh={parser.forceRefresh}
                    />
                </div>
                <div className="s-1 s-sm-1-2">
                    <Editor
                        project={lilProj}
                        onRename={actions.renameEntry}
                        onChange={actions.saveEntry}
                    />
                </div>
            </PlaygroundContext.Provider>
        </div>
    );
}
