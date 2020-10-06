module.exports = {
    roots: ['./src'],
    verbose: true,
    transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
    moduleNameMapper: {
        '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
    },
    globals: {
        NODE_ENV: 'test',
    },
    moduleFileExtensions: ['js', 'jsx'],
    moduleDirectories: ['node_modules'],
};
