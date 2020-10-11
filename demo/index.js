import React, { StrictMode } from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { render } from 'react-dom';
import Editor from '../src/editor';

render(
    <StrictMode>
        <Editor />
    </StrictMode>,
    document.querySelector('#root'),
);
