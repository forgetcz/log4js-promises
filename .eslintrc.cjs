module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'], // This is where you define plugins to use
    parserOptions: {
        ecmaVersion: '2017', // https://eslint.org/docs/latest/use/configure/language-options#specifying-environments
    },
    ignorePatterns: [
        '/dist/*',
        'node_modules',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*__mocks__*',
        '**/*__tests__*',
        '**/*__debug__*',
        '**/*.debug.ts',
    ],
    extends: [
        'eslint:recommended', // is ESLint's inbuilt "recommended" config - it turns on a small, sensible set of rules which lint for well-known best-practices.
        'plugin:@typescript-eslint/recommended', // is our "recommended" config - it's similar to eslint:recommended, except it turns on TypeScript-specific rules from our plugin.
        'plugin:@typescript-eslint/eslint-recommended',
        'prettier/prettier',
    ],
    rules: {
        // Rules: 0 - OFF,warn - 1, error - 2
        'no-console': 'off',
        'no-var': 'error',
        'no-fallthrough': 'warn',
        'no-extra-semi': 'warn',
        'no-empty': 'error',
        'no-whitespace-before-property': 'error',
        // Note: you must disable the base rule as it can report incorrect errors
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': [
            'error',
            {
                args: 'none',
                vars: 'all',
                varsIgnorePattern: '^_',
                argsIgnorePattern: '^_',
            },
        ],
        curly: 'error',
        eqeqeq: ['error', 'always'],
        'prefer-const': 'error',
        'spaced-comment': ['error', 'always'],
        'nonblock-statement-body-position': ['error', 'below'],
        // "quotes": ["error", "single"],
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/naming-convention': [
            'error', // Enforce that all variables, functions and properties follow are camelCase
            {
                selector: 'variableLike',
                leadingUnderscore: 'allow',
                trailingUnderscore: 'allow',
                format: ['camelCase', 'UPPER_CASE'],
            },
        ],
        'no-use-before-define': ['warn'],
    },
    env: {
        node: true, // allow node app
        jest: true, // allow jest frame work
    },
};
