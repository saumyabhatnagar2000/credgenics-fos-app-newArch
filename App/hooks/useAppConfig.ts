import * as React from 'react';
import { fetchAppConfig } from '../services/appConfigService';
import packageJson from '../../package.json';
import { AppConfig } from '../../types';
import compareVersions from 'compare-versions';
import useCommon from './useCommon';

const APP_VERSION = packageJson.version;

export default function useAppConfig() {
    const { isInternetAvailable } = useCommon();
    const [updateRequired, setUpdateRequired] = React.useState(false);

    React.useEffect(() => {
        async function init() {
            if (isInternetAvailable) {
                const response = await fetchAppConfig();
                const config: AppConfig = response?.data;
                if (config?.app_version) {
                    const result = compareVersions(
                        APP_VERSION,
                        config.app_version
                    );
                    if (result === -1) {
                        //update required
                        setUpdateRequired(true);
                    }
                }
            }
        }

        init();
    }, [isInternetAvailable]);

    return false;
}
