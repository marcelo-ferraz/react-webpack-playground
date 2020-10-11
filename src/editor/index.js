import React, { useEffect, useMemo, useState } from 'react';
import CodeEditor from './CodeEditor';
import path from 'path';

export default function Editor({ textEntries, onChange: change }) {
    const [selectedTab, setSelectedTab] = useState();
    const [code, setCode] = useState({});

    useEffect(() => {
        if (!textEntries || textEntries.length) {
            return;
        }
        const [[first]] = textEntries;
        setSelectedTab(first);
    }, []);

    const selectEntry = (entryName, content) => {
        setSelectedTab(entryName);
        setCode({ content, language: path.extname(entryName) });
    };

    const addEntry = () => {
        change('new one', '');
    };

    const tabs = useMemo(
        () =>
            textEntries &&
            textEntries.length &&
            textEntries.map(([name, text]) => {
                return (
                    <button
                        key={name}
                        type="button"
                        className={selectedTab === name ? 'active' : ''}
                        onClick={() => selectEntry(name, text)}
                    >
                        {name}
                    </button>
                );
            }),
        [],
    );

    return (
        <div className="editor">
            <div className="tabs">
                {tabs}
                <button className="newTab" type="button" onClick={addEntry}>
                    +
                </button>
            </div>
            <CodeEditor
                code={code.content}
                mode={code.language}
                onChange={(c) => changeEditor(sample, c, selectedEndpoint)}
            />
        </div>
    );
}
