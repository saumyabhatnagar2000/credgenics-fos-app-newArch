var path = require('path');

module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    env: {
        production: {
            plugins: ['react-native-paper/babel'],
            plugins: ['transform-remove-console']
        }
    },
    plugins: [
        [
            'module-resolver',
            {
                root: ['.'],
                resolvePath(sourcePath, currentFile, opts) {
                    if (
                        sourcePath === 'react-native' &&
                        !(
                            (
                                currentFile.includes(
                                    'node_modules/react-native/'
                                ) || // macos/linux paths
                                currentFile.includes(
                                    'node_modules\\react-native\\'
                                )
                            ) // windows path
                        ) &&
                        !(
                            currentFile.includes('resolver/react-native/') ||
                            currentFile.includes('resolver\\react-native\\')
                        )
                    ) {
                        return path.resolve(__dirname, 'resolver/react-native');
                    }
                    return undefined;
                }
            }
        ],
        'react-native-reanimated/plugin'
    ]
};
