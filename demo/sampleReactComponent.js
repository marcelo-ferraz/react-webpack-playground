export default {
    entries: {
        './app.js': `import React, {useState} from "react";
import NotReallyAMagicalContext from './NotReallyAMagicalContext';
import SomeMagic from './SomeMagic';

export default function App() {
    const [text, setText] = useState('some magic!');

    return (<NotReallyAMagicalContext.Provider value={{text, setText}}>
            <div className="App">
                <h2>Oh, hello there</h2>
                <p>Change here to start seeing {text}</p>
            </div>
            <SomeMagic />
        </NotReallyAMagicalContext.Provider>
    );
}
`,
        './NotReallyAMagicalContext': `import {createContext} from "react"

export default createContext({ 
    text: 'some magic!', 
    setText: () => {},
});

`,
        './SomeMagic.js': `import React, {useContext} from "react";
import NotReallyAMagicalContext from './NotReallyAMagicalContext';

export default function SomeMagic() {
    const {text, setText} = useContext(NotReallyAMagicalContext);

    return (<div style={{ 
        color: '#3c763d',
        backgroundColor: '#dff0d8',
        borderColor: '#d6e9c6',
        padding: '15px',
        marginBottom: '20px',
        border: '1px solid transparent',
        borderRadius: '4px',
     }}>
        <strong>Change here: </strong>
        <input 
            type='text' 
            value={text} 
            onChange={({target}) => setText(target.value)}/>
        </div>
    );
}
`,
    },
    getExternalDependencies: () => ({}),
    beforeRender: (strategy) => { },
    beforeInvoke: (context) => { },
    afterInvoke: (context) => { },
};
