import React from 'react';
import { version } from '../../package.json';

import './SideMenu.scss';

export default function SideMenu() {
    return (
        <div className="side-menu">
            <input type="checkbox" id="toggle"></input>
            <aside className="left-bar">
                <div className="btn-toggle hamburger hamburger--arrowturn is-active">
                    <label htmlFor="toggle" class="hamburger-box">
                        <div htmlFor="toggle" class="hamburger-inner"></div>
                    </label>
                </div>
            </aside>
            <aside className="bottom-bar rows align-items center justify-end">
                <div>v.: {version}</div>
                <div>gh</div>
            </aside>
            <label htmlFor="toggle" className="overlay"></label>
        </div>
    );
}
