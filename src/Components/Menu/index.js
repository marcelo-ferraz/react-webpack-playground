import React, { useContext } from 'react';
import pkg from '../../../package.json';

import './Menu.scss';

import { GoMarkGithub } from 'react-icons/go';
import { VscFiles, VscRefresh } from 'react-icons/vsc';
import { FaCubes } from 'react-icons/fa';
// I will implement the toggle for async | parallel processing
// eslint-disable-next-line no-unused-vars
import { AiFillCheckSquare, AiFillLinkedin } from 'react-icons/ai';

import ProjStructure from './ProjStructure';
import PlaygroundContext from '../../PlaygroundContext';
import CheckBox from '../Checkbox';

export default function Menu() {
    const { currentProject } = useContext(PlaygroundContext);
    return (
        <div className="side-menu">
            <input type="checkbox" id="toggle"></input>
            <aside className="left-bar">
                <div className="rows">
                    <div className="menu top s-1">
                        <div className="btn-toggle hamburger hamburger--arrowturn is-active">
                            <label htmlFor="toggle" className="hamburger-box">
                                <div htmlFor="toggle" className="hamburger-inner"></div>
                            </label>
                        </div>
                    </div>
                    <div className="menu icons s-1-6 columns">
                        <div className="rows align-items center start">
                            <FaCubes />
                            <label className="active" htmlFor="toggle">
                                <VscFiles />
                            </label>
                        </div>
                        <div className="grow" />
                        <div className="rows align-items center start">
                            <VscRefresh />
                            <CheckBox title="Live refresh" />
                        </div>
                    </div>
                    <div className="menu body active s-5-6 columns">
                        <div className="grow">
                            <ProjStructure project={currentProject} />
                        </div>
                        <div className="bottom rows align-items center">
                            <div className="menu-version grow">v.: {pkg.version}</div>
                            <GoMarkGithub
                                className="menu-icon"
                                title="Click here to check the Playground's repository"
                                onClick={() => {
                                    window.open(
                                        'https://github.com/marcelo-ferraz/react-webpack-playground',
                                    );
                                }}
                            />
                            <AiFillLinkedin
                                className="menu-icon"
                                title="Click here to check my linkedIn profile"
                                onClick={() => {
                                    window.open('https://www.linkedin.com/in/marceloferraz/');
                                }}
                            />
                        </div>
                    </div>
                </div>
            </aside>
            <label htmlFor="toggle" className="overlay"></label>
        </div>
    );
}
