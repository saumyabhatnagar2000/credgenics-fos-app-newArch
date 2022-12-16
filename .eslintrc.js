module.exports = {
    root: true,
    extends: ['@react-native-community', 'airbnb-typescript', 'prettier'],
    parserOptions: {
        project: ['./tsconfig.json']
    },
    rules: {
        'react-hooks/exhaustive-deps': 'error',
        'react-native/no-unused-styles': 2,
        'react-native/split-platform-components': 2,
        'react-native/sort-styles': [
            'error',
            'asc',
            {
                ignoreClassNames: false,
                ignoreStyleProperties: false
            }
        ],
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_'
            }
        ],
        'sort-imports': [
            'error',
            {
                ignoreDeclarationSort: true
            }
        ]
    },
    plugins: [
        'react',
        'react-hooks',
        'react-native',
        '@typescript-eslint',
        'unused-imports'
    ]
};
