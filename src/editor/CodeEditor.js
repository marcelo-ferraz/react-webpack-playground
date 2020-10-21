import React, { useCallback, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-jsx';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/snippets/jsx';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/webpack-resolver';

import 'ace-builds/src-min-noconflict/ext-beautify';
import tabDirection from './tabDirection';

export default function CodeEditor({
    code,
    mode = 'jsx',
    onChangeTab,
    onChange: triggerCodeChange,
}) {
    const aceEditor = useRef();

    useEffect(() => {
        const commands = aceEditor.current.editor.commands;
        commands.addCommands([
            {
                name: 'next-tab',
                bindKey: { win: 'Alt-`', mac: 'Command-Tab' },
                exec: () => {
                    onChangeTab && onChangeTab(tabDirection.next);
                },
                readOnly: true,
            },
            {
                name: 'previous-tab',
                bindKey: { win: 'Alt-Shift-`', mac: 'Command-Shift-Tab' },
                exec: () => {
                    onChangeTab && onChangeTab(tabDirection.previous);
                },
                readOnly: true,
            },
        ]);
    }, [code, onChangeTab]);

    return (
        <AceEditor
            ref={aceEditor}
            placeholder="Have fun!"
            mode={mode}
            theme="twilight"
            name="codeEditor"
            onChange={triggerCodeChange}
            fontSize={14}
            width="100%"
            style={{
                boxSizing: 'border-box',
                height: 'calc(100vh - 34px)',
            }}
            showPrintMargin
            showGutter
            highlightActiveLine
            enableBasicAutocompletion
            enableLiveAutocompletion
            enableSnippets
            setOptions={{
                showLineNumbers: true,
                tabSize: 4,
            }}
            value={code}
        />
    );
}
