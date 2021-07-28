import React, { useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import path from 'path';
import CodeEditor from './CodeEditor';
import editorMode from './editorMode';
import EditorTab from './EditorTab';
import getKeyWithCount from './getKeywithCount';
import tabDirection from './tabDirection';

import './editor.scss';
import PlaygroundContext from '../../PlaygroundContext';

export default function Editor({ project = {}, onChange: triggerChange, onRename: triggerRename }) {
    const { selectedEntry, setSelectedEntry } = useContext(PlaygroundContext);
    const [language, setLanguage] = useState();
    const [code, setCode] = useState();

    useLayoutEffect(() => {
        if (!project.entries) {
            return;
        }

        setCode(project.entries[selectedEntry]);
        setLanguage(selectedEntry ? path.extname(selectedEntry) : '.js');
    }, [project.entries, selectedEntry]);

    const selectEntry = (entryName, content) => {
        setCode(content);
        setSelectedEntry(entryName);
        setLanguage(editorMode[path.extname(entryName)]);
    };

    const addEntry = () => {
        const newKey = getKeyWithCount(project.entries, './new file', '.js');
        triggerChange(newKey, '');
    };

    const items = useMemo(
        () => project.entries && Object.entries(project.entries),
        [project.entries],
    );

    const [tabs, dropDownItems] = useMemo(() => {
        const rename = (oldName, newName) => {
            if (oldName === newName) {
                return;
            }

            if (!project.entries[newName]) {
                triggerRename(oldName, newName);
                setSelectedEntry(newName);
                return;
            }

            const newKey = getKeyWithCount(project.entries, newName);
            triggerRename(oldName, newKey);
            setSelectedEntry(newKey);
        };

        return [
            items.map(([name, text]) => (
                <EditorTab
                    key={`${name}-tab`}
                    name={name}
                    onRename={(newName) => rename(name, newName)}
                    onClick={() => selectEntry(name, text)}
                    isActive={selectedEntry === name}
                />
            )),
            items.map(([name, text]) => (
                <div
                    key={`${name}-dropdown-item`}
                    onClick={() => selectEntry(name, text)}
                    className={selectedEntry === name ? 'active' : ''}
                >
                    {name}
                </div>
            )),
        ];
        // ignore the references to those two functions, as if they arent cached, will make an inifinte loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, project.entries, triggerRename, selectedEntry /*, setSelectedEntry, selectEntry */]);

    const moveSelectedTab = useCallback(
        (direction) => {
            if (items.length <= 1) {
                return;
            }

            const currentTab = selectedEntry;

            let selectedIndex = items.findIndex(([key]) => key === currentTab);

            let newSelected;
            if (direction === tabDirection.next) {
                newSelected = items[selectedIndex + 1] || items[0];
            }
            if (direction === tabDirection.previous) {
                newSelected = items[selectedIndex - 1] || items[items.length - 1];
            }

            setSelectedEntry(newSelected[0]);
        },
        // The use of that function here can cause an infinite loop if not cached
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [items, selectedEntry /*, setSelectedEntry*/],
    );

    return (
        <div className="editor">
            <div className="rows">
                <div className="tab rows dropdown">
                    &#9660;
                    <div className="dropdown-content">{dropDownItems}</div>
                </div>

                <div className="grow tabs">
                    <div className="rows">{tabs}</div>
                </div>
                <button className="newTab" type="button" onClick={addEntry}>
                    +
                </button>
            </div>
            <CodeEditor
                code={code}
                mode={language}
                onChangeTab={(direction) => moveSelectedTab(direction)}
                onChange={(c) => triggerChange(selectedEntry, c)}
            />
        </div>
    );
}
