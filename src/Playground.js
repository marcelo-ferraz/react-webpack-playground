import React, { useEffect, useRef, useState } from 'react';
import Editor from './editor';
import Display from './display';
import simpleReactComponentMock from './parser/__mocks__/simpleReactComponent.mock';

import './simple-grid.scss';

export default function Playground() {
    const [entries, setEntries] = useState(simpleReactComponentMock);
    const parser = useRef();

    const handleChange = (c, cs) => {
        const t = entries;
        debugger;
    };

    return (
        <div className="playground rows">
            <div className="s-1 s-sm-1-2">
                <Editor entries={entries} onChange={handleChange} />
            </div>
            <div className="s-1 s-sm-1-2">
                <Display ref={parser} entries={entries} />
            </div>
        </div>
    );
}
