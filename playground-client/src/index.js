import Playground from './Components/Playground';
import contextReducer from './contextReducer';
import Editor from './Components/Editor';
import Display from './Components/Display';
import prj from '../demo/sampleReactProject';

import './simple-grid.scss';

export default Playground;

export { contextReducer, Editor, Display };

const rust = import('../rs-parser');

rust.then(({ JsParser }) => {
    const parser = JsParser.new();
    let rr = parser.parse(prj.entries, './App');
    debugger;
}).catch(console.error);
