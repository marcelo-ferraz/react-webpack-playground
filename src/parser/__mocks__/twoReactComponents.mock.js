export default {
    entries: {
        './app.js': `
import React from "react";
import Component2 from "./component-2";

export default function App() {
    return (
        <div className="App">
            <h1>Hello CodeSandbox</h1>
            <h2>Start editing to see some magic happen!</h2>
            <Component2 />
        </div>
    );
}`,
        './component-2.js': `
import React from "react";

export default function Component2() {
    return <div>here, some more magic</div>;
}`,
    },
};
