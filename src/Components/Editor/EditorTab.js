import React, { useEffect, useRef, useState } from 'react';
import { extname } from 'path';
import getKeyWithCount from './getKeywithCount';

const enterKey = 13;
const escapeKey = 27;

export default function EditorTab({ isActive, name, onRename: triggerRename, onClick }) {
    const [isRenaming, setIsRenaming] = useState();
    const [possibleNewName, setPossibleNewName] = useState(name);
    const inputRef = useRef();

    useEffect(() => {
        if (isRenaming) {
            const input = inputRef.current;
            input.focus();
            const key = input.value;
            input.setSelectionRange(2, key.indexOf(extname(key)));
        }
    }, [isRenaming]);

    const showRenameBox = (e, key) => {
        setPossibleNewName(key);
        setIsRenaming(true);
        e.preventDefault();
    };

    const handleChange = (e) => {
        setPossibleNewName(e.target.value);
        e.preventDefault();
    };

    const renameOnBlur = (e) => {
        e.preventDefault();
        setIsRenaming(false);
        triggerRename(possibleNewName);
    };

    const handleKeys = (e) => {
        if (e.keyCode === enterKey) {
            setIsRenaming(false);
            triggerRename(possibleNewName);
        }
        if (e.keyCode === escapeKey) {
            setIsRenaming(false);
            setPossibleNewName(name);
        }
        e.preventDefault();
    };

    const currentCss =
        'tab grow ' + (isActive ? 'active' : '') + ' ' + (isRenaming ? 'renaming' : '');

    return (
        <div onClick={onClick} className={currentCss} onDoubleClick={(e) => showRenameBox(e, name)}>
            {!isRenaming ? (
                <div className="rows align-items center">
                    <div className="grow">{name}</div>
                    {isActive && <button className="closeBtn">x</button>}
                </div>
            ) : (
                <input
                    type="text"
                    ref={inputRef}
                    onKeyUp={handleKeys}
                    onChange={handleChange}
                    onBlur={renameOnBlur}
                    value={possibleNewName}
                />
            )}
        </div>
    );
}
