import React from 'react';

import './ErrorsExplained.scss';

const maxLength = 1024;

export default function ErrorsExplained({ error = {} }) {
    return (
        <div className="errors-explained">
            {error.name && <h1 className="error-title">Error: &#34;{error.name}&#34;</h1>}
            <span>
                There was an error trying to parse the code
                {error.loc && (
                    <span>
                        &nbsp;(ln {error.loc.line} col {error.loc.column})
                    </span>
                )}
                .
            </span>
            {error.code && (
                <>
                    <br />
                    <span> Error Code: {error.code}</span>
                </>
            )}
            {error.message && (
                <>
                    <br />
                    <span className="error-sub-title">Message: </span>
                    <p>&#34;{error.message}&#34;</p>
                </>
            )}
            {error.stack && (
                <div className="error-stack">
                    <span className="error-sub-title">Stack:</span>
                    {error.stack.length > maxLength ? (
                        <pre>{error.stack.substring(0, maxLength)} ...</pre>
                    ) : (
                        <pre>{error.stack}</pre>
                    )}
                </div>
            )}
        </div>
    );
}
