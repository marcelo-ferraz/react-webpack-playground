// from the excellent https://anuraghazra.github.io/blog/building-a-react-folder-tree-component
import React, { useContext, useMemo, useState } from 'react';
import { VscJson, VscChevronDown, VscChevronRight } from 'react-icons/vsc';
import {
    AiOutlineFile,
    AiOutlineFolder,
    AiOutlineFolderOpen,
    AiFillCheckSquare,
} from 'react-icons/ai';
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact } from 'react-icons/di';
import { GoPencil } from 'react-icons/go';

import { extname } from 'path';

import './ProjStructure.scss';
import PlaygroundContext from '../PlaygroundContext';
import { FaChevronRight } from 'react-icons/fa';

const getFileIcon = (filename) => {
    const ext = extname(filename);
    if (!ext || ext === '.js') {
        return <DiJavascript1 />;
    }
    if (ext === '.css') {
        return <DiCss3Full />;
    }
    if (ext === '.html') {
        return <DiHtml5 />;
    }
    if (ext === '.jsx') {
        return <DiReact />;
    }
    if (ext === '.json') {
        return <VscJson />;
    }
    return <AiOutlineFile />;
};

function TreeItem({ name, entries }) {
    const { selectedEntry, setSelectedEntry } = useContext(PlaygroundContext);
    const [isOpen, setOpen] = useState(true);
    const items = useMemo(
        () =>
            entries &&
            Object.entries(entries).map(([itemKey, value]) => {
                if (typeof value === 'string') {
                    return (
                        <li key={`fl-${itemKey}`}>
                            <div onClick={() => setSelectedEntry(itemKey)}>
                                {getFileIcon(itemKey)}
                                {selectedEntry === itemKey ? (
                                    <>
                                        <b>{itemKey}</b>
                                        <FaChevronRight className="selected" />
                                    </>
                                ) : (
                                    <span>{itemKey}</span>
                                )}
                            </div>
                        </li>
                    );
                }
                return <TreeItem key={`dir-${itemKey}`} name={itemKey} entries={value} />;
            }),
        [entries, selectedEntry, setSelectedEntry],
    );

    return (
        <ul>
            <li>
                <div onClick={() => setOpen(!isOpen)}>
                    {isOpen ? (
                        <>
                            <VscChevronDown />
                            <AiOutlineFolderOpen />
                        </>
                    ) : (
                        <>
                            <VscChevronRight />
                            <AiOutlineFolder />
                        </>
                    )}
                    <span>{name}</span>
                </div>
                <ul className={!isOpen ? 'closed' : ''}>{items}</ul>
            </li>
        </ul>
    );
}

export default function ProjStructure({ project }) {
    return (
        <div className="proj-structure">
            <h2>
                <AiFillCheckSquare />
                {project.name || 'project'}
            </h2>
            <TreeItem name={'src'} entries={project.entries} />
        </div>
    );
}
