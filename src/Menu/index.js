import React, { useMemo } from 'react';
import { version } from '../../package.json';

import './Menu.scss';

import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

import ProjectStructure from './ProjectStructure';

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

export default function Menu({ currentProject }) {
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
                    <div className="menu icons s-1-6">
                        <div className="rows align-items center start">
                            <AccountTreeOutlinedIcon fontSize="large" />
                            <GitHubIcon fontSize="large" />
                            <LinkedInIcon fontSize="large" />
                        </div>
                    </div>
                    <div className="menu body s-5-6">
                        <Accordion disabled>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Projects</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                                    eget.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Current project</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <ProjectStructure />
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion disabled>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3a-content"
                                id="panel3a-header"
                            >
                                <Typography>Disabled Accordion</Typography>
                            </AccordionSummary>
                        </Accordion>
                    </div>
                </div>
            </aside>
            <aside className="bottom-bar rows align-items center justify-end">
                <div>v.: {version}</div>
                <div>
                    <GitHubIcon />
                    <LinkedInIcon />
                </div>
            </aside>
            <label htmlFor="toggle" className="overlay"></label>
        </div>
    );
}
