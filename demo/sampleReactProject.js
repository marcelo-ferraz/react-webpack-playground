export default {
    entries: {
        './App.js': `import React, {useState} from "react";
import NotReallyAMagicalContext from './NotReallyAMagicalContext';
import SomeMagic from './SomeMagic';
import someData from './some_data.json';

export default function App() {
    const [text, setText] = useState('some magic!');

    return (<>
        <NotReallyAMagicalContext.Provider value={{text, setText}}>
            <div className="App">
                <h2>Oh, hello there</h2>
                <p>Change here to start seeing {text}</p>
            </div>
            <SomeMagic />
        </NotReallyAMagicalContext.Provider>
        { JSON.stringify(someData) }
    </>);
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

    return (<div 
        style={{ 
            border: '1px solid transparent',
            backgroundColor: '#2196F3',
            borderColor: '#144B76',
            marginBottom: '20px',
            borderRadius: '4px',
            color: '#E6E6E6',
            padding: '15px',
        }}>
        <strong>Change here: </strong>
        <input 
            type='text' 
            value={text} 
            onChange={({target}) => setText(target.value)}/>
        </div>
    );
}`,
        './some_data.json': '{ "type": "dog", "nature": "lovely" }',
    },
    getExraDependencies: () => ({}),
    beforeRender: (strategy) => {},
    beforeInvoke: (context) => {},
    afterInvoke: (context) => {},
};
