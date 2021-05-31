import React, { StrictMode } from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { render } from 'react-dom';
import Playground from '../src';
import sampleReactProject from './sampleReactProject';

// TODO: try changing the theme here
// import '../src/themes/charcoal.css';

function Comp() {
    return (
        <div>
            <Playground lilProject={sampleReactProject} />
        </div>
    );
}

render(
    <StrictMode>
        <Comp />
    </StrictMode>,
    document.querySelector('#root'),
);
