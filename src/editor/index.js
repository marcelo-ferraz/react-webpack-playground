import React, { useEffect, useMemo, useState } from 'react';
import CodeEditor from './CodeEditor';
import path from 'path';

export default function Editor({ entries, onChange: triggerChange }) {
    const [selectedEntry, setSelectedEntry] = useState();
    const [language, setLanguage] = useState();
    const [code, setCode] = useState();

    useEffect(() => {
        if (!entries || selectedEntry) {
            return;
        }
        selectEntry('./app.js', entries['./app.js']);
    }, [entries]);

    const selectEntry = (entryName, content) => {
        setCode(content);
        setSelectedEntry(entryName);
        setLanguage(path.extname(entryName) || '.js');
    };

    const addEntry = () => {
        triggerChange('new one', '');
    };

    const tabs = useMemo(() => {
        return (
            entries &&
            Object.entries(entries).map(([name, text]) => {
                return (
                    <button
                        key={name}
                        type="button"
                        className={selectedEntry === name ? 'active' : ''}
                        onClick={() => selectEntry(name, text)}
                    >
                        {name}
                    </button>
                );
            })
        );
    }, []);

    return (
        <div className="editor">
            <div className="tabs">
                {tabs}
                <button className="newTab" type="button" onClick={addEntry}>
                    +
                </button>
            </div>
            <CodeEditor
                code={code}
                mode={language}
                onChange={(c) => triggerChange(selectedEntry, c)}
            />
        </div>
    );
}
