import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import path from 'path';

import CodeEditor from './CodeEditor';
import editorMode from './editorMode';

import './editor.scss';
import EditorTab from './EditorTab';
import getKeyWithCount from './getKeywithCount';
import tabDirection from './tabDirection';

const renameImpl = (context) => (oldName, newName) => {
    if (oldName === newName) {
        return;
    }

    if (!context.entries[newName]) {
        triggerRename(oldName, newName);
        setSelectedEntry(newName);
        return;
    }

    const newKey = getKeyWithCount(context.entries, newName);
    triggerRename(oldName, newKey);
    setSelectedEntry(newKey);
};

export default function Editor({ context = {}, onChange: triggerChange, onRename: triggerRename }) {
    const [selectedEntry, setSelectedEntry] = useState('./app.js');
    const [language, setLanguage] = useState();
    const [code, setCode] = useState();

    useLayoutEffect(() => {
        if (!context.entries) {
            return;
        }

        setCode(context.entries[selectedEntry]);
        setLanguage(path.extname(selectedEntry) || '.js');
    }, [context.entries, selectedEntry]);

    const selectEntry = (entryName, content) => {
        setCode(content);
        setSelectedEntry(entryName);
        setLanguage(editorMode[path.extname(entryName)]);
    };

    const addEntry = () => {
        const newKey = getKeyWithCount(context.entries, './new file', '.js');
        triggerChange(newKey, '');
    };

    const items = useMemo(() => context.entries && Object.entries(context.entries), [
        context.entries,
    ]);

    const [tabs, dropDownItems] = useMemo(() => {
        const rename = renameImpl(context);

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
    }, [items, context, selectedEntry]);

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
        [items, selectedEntry],
    );

    return (
        <div className="editor">
            <div className="rows">
                <div className="tab rows dropdown">
                    &#9660;
                    <div className="dropdown-content">{dropDownItems}</div>
                </div>

                <div className="rows grow tabs">{tabs}</div>
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
