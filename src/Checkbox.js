// from the excellent https://anuraghazra.github.io/blog/building-a-react-folder-tree-component
import React, { useState } from 'react';
import { AiFillCheckSquare, AiOutlineBorder } from 'react-icons/ai';

export default function CheckBox({ title, checked: initialState = false, onChange }) {
    const [checked, setChecked] = useState(initialState);

    const toggleCheck = () => {
        setChecked(!checked);
        onChange && onChange(!checked);
    };

    return checked ? (
        <AiFillCheckSquare title={title} onClick={toggleCheck} />
    ) : (
        <AiOutlineBorder title={title} onClick={toggleCheck} />
    );
}
