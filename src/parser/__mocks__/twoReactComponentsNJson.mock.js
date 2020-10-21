export default {
    entries: {
        './app.js': `
import React from "react";
import Component2 from "./component-2";
import data from "./someData.json";

export default function App() {
    return (
        <div className="App">
            <h1>Hello CodeSandbox</h1>
            <h2>Start editing to see some magic happen!</h2>
            <Component2 />
            <div>
                some json: {JSON.stringify(data)}
            </div>
        </div>
    );
}`,
        './component-2.js': `
import React from "react";
import data from "./someData.json";

export default function Component2() {
    return (<>
        <div>
            here, some more magic,
        </div>
        <div>
            and here some more of the same json: {JSON.stringify(data)}
        </div>
        </>
    );
}
    `,
        './someData.json': `{
    "id": 42,
    "hash": "82d06ce0-e19d-4942-853a-4c74d4ae883e"
}`,
    },
};
