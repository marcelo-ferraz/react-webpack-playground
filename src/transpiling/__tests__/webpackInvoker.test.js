import { jsInvoke, render } from '../webpackInvoker';
import sumAsDefaultOnlyMock from '../__mocks__/sumAsDefaultOnly.mock';
import sumAsDefaultAndSubtractionMock from '../__mocks__/sumAsDefaultAndSubtraction.mock';
import sumAndSubtractionNoDefaultMock from '../__mocks__/sumAndSubtractionNoDefault';
import sumAndSubtractionFromOtherModulesMock from '../__mocks__/sumAndSubtractionFromOtherModules.mock ';
import sumAsDefaultImportingMultipleLevelsMock from '../__mocks__/sumAsDefaultImportingMultipleLevels.mock';

global.__webpack_require__ = function () {};
global.__webpack_require__.m = [{ './node_modules/react': {} }];

describe('webpackInvoker', () => {
    let left;
    let right;
    let expectedSumResult;
    let expectedSubtractionResult;

    beforeEach(() => {
        left = Math.random();
        right = Math.random();
        expectedSumResult = left + right;
        expectedSubtractionResult = left - right;
    });

    it('should invoke the module with sum function as default', async () => {
        const { exports } = jsInvoke(await render(sumAsDefaultOnlyMock));
        const { default: sum } = exports;

        const result = sum(left, right);

        expect(result).toEqual(expectedSumResult);
    });

    it('should invoke the module with sum function as default and that have a multiple levels of import', async () => {
        const { exports } = jsInvoke(await render(sumAsDefaultImportingMultipleLevelsMock));
        const { default: sum } = exports;

        const result = sum(left, right);

        expect(result).toEqual(expectedSumResult);
    });

    it('should invoke the module with sum function as default and subtract as a member', async () => {
        const { exports } = jsInvoke(await render(sumAsDefaultAndSubtractionMock));
        const { default: sum, subtract } = exports;

        const sumResult = sum(left, right);
        const subtractionResult = subtract(left, right);

        expect(sumResult).toEqual(expectedSumResult);
        expect(subtractionResult).toEqual(expectedSubtractionResult);
    });

    it('should invoke the module with sum and subtract as a members and no default', async () => {
        const { exports } = jsInvoke(await render(sumAndSubtractionNoDefaultMock));
        const { sum, subtract } = exports;

        const sumResult = sum(left, right);
        const subtractionResult = subtract(left, right);

        expect(sumResult).toEqual(expectedSumResult);
        expect(subtractionResult).toEqual(expectedSubtractionResult);
    });

    it('should invoke the module with sum and subtract as a members and they are exported from other modules', async () => {
        const c = jsInvoke(await render(sumAndSubtractionFromOtherModulesMock));
        const { sum, subtract } = c.exports;

        const sumResult = sum(left, right);
        const subtractionResult = subtract(left, right);

        expect(sumResult).toEqual(expectedSumResult);
        expect(subtractionResult).toEqual(expectedSubtractionResult);
    });
});
