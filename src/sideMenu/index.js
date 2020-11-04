import React from 'react';

import './SideMenu.scss';

export default function SideMenu() {
    return (
        <div className="side-menu">
            <input type="checkbox" id="toggle"></input>
            <aside className="left-bar">
                <label
                    htmlFor="toggle"
                    className="btn-toggle hamburger hamburger--arrowturn is-active"
                >
                    <div class="hamburger-box">
                        <div class="hamburger-inner"></div>
                    </div>
                </label>
            </aside>
            <aside className="bottom-bar"></aside>
            <label htmlFor="toggle" className="overlay"></label>
        </div>
    );
}
