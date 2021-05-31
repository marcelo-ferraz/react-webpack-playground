export default {
    name: 'sample-project',
    entries: {
        './App.js': `import React, {useState} from "react";
import JustAnOrdinaryContext from './JustAnOrdinaryContext';
import ThisOneUsesStylesAndContext from './ThisOneUsesStylesAndContext';
import someData from './some_data.json';

export default function App() {
    const [text, setText] = useState('Johnny');

    return (<>
        <JustAnOrdinaryContext.Provider value={{text, setText}}>
            <ThisOneUsesStylesAndContext />
            <div className="App">
                <h2>Oh, hello there</h2>
                <p>And heere is {text}</p>
            </div>            
        </JustAnOrdinaryContext.Provider>

        <img src="https://media3.giphy.com/media/8Ja3gouJQSg1i/giphy.gif?cid=ecf05e47xd038ul10h88izmtwn8uybju1t519uk9fd0pk3dy&rid=giphy.gif&ct=g" />
            
        <p>And from the json, this gif is from { someData.adverb } <b>{ someData.name }</b>.</p>
        <p>This one still is {someData.opinion}...</p>
    </>);
}        
`,
        './JustAnOrdinaryContext': `import {createContext} from "react"

export default createContext({ 
    text: 'Johnny', 
    setText: () => {},
});

`,
        './ThisOneUsesStylesAndContext.js': `import React, {useContext} from "react";
import JustAnOrdinaryContext from './JustAnOrdinaryContext';

export default function ThisOneUsesStylesAndContext() {
    const {text, setText} = useContext(JustAnOrdinaryContext);

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
        './some_data.json': `{ 
    "adverb": "the mostly excellent", 
    "name": "Johnny Castaway", 
    "opinion": "my favorite screensaver" 
}`,
    },
    getExraDependencies: () => ({}),
    beforeRender: (strategy) => {},
    beforeInvoke: (context) => {},
    afterInvoke: (context) => {},
};
