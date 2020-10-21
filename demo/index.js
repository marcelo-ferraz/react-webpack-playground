import React, { StrictMode } from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { render } from 'react-dom';
import Playground from '../src';
import sampleReactComponent from './sampleReactComponent';

render(
    <StrictMode>
        <Playground initialContext={sampleReactComponent} />
    </StrictMode>,
    document.querySelector('#root'),
);
