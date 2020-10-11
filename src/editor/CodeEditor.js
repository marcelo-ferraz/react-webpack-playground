import React, { useRef } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/webpack-resolver';

export default function CodeEditor({ code, mode = 'javascript', onChange: codeChange }) {
    const aceEditor = useRef();

    return (
        <AceEditor
            ref={aceEditor}
            placeholder="Have fun!"
            mode={mode}
            theme="twilight"
            name="codeEditor"
            onChange={codeChange}
            fontSize={14}
            width="100%"
            height="100vh"
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
