import devConfig from '../../config.json';
import prodConfig from '../../config.prod.json';
import packageJson from '../../package.json';

type OSConfig = {
    android: string;
    ios: string;
};

type CodepushConfig = {
    deploymentKey: OSConfig;
};

type ConfigType = {
    BASE_URL: string;
    BASE_URL_IDN?: string;
    VERSION: string;
    CODEPUSH: CodepushConfig;
    AUTH_PUBLIC_KEY: string;
    REFERER: string;
    ENV: string;
};

let config: ConfigType;

if (__DEV__) {
    config = devConfig as any;
    config.VERSION = `${packageJson.version}-dev`;
} else {
    config = { ...devConfig, ...prodConfig } as any;
    config.VERSION = packageJson.version;
}

export default Object.seal(config);
