import React from 'react';
import { render as testRender } from '@testing-library/react';
import cases from 'jest-in-case';
import simpleReactComponentMock from '../__mocks__/simpleReactComponent.mock';
import twoReactComponentsMock from '../__mocks__/twoReactComponents.mock';
import twoReactComponentsNJsonMock from '../__mocks__/twoReactComponentsNJson.mock';
import { jsInvoke, render } from '../webpackInvoker';

/* eslint-disable no-undef */
global.__webpack_require__ = function (id) {
    if (id && id.indexOf('react') >= 0) {
        return React;
    }
};
global.__webpack_require__.m = [{ './node_modules/react': {} }];
/* eslint-enable */

cases(
    'webpack invoker happy path for react',
    async ({ entry }) => {
        const { exports } = jsInvoke(await render(entry));

        const Component = exports.default;

        const { container } = testRender(<Component />);

        expect(container).toMatchSnapshot();
    },
    {
        'simple component': { entry: simpleReactComponentMock },
        'two components': { entry: twoReactComponentsMock },
        'two components and json': { entry: twoReactComponentsNJsonMock },
    },
);
