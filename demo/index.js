import React, { StrictMode } from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { render } from 'react-dom';
import Editor from '../src/editor';
import Playground from '../src/Playground';

render(
    <StrictMode>
        <Playground />
    </StrictMode>,
    document.querySelector('#root'),
);
