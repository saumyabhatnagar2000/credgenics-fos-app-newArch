import * as React from 'react';
import { ANDROID_DEVICE_VERIFICATION_API_KEY } from '../config/ApiKeys';
import DeviceInfo from 'react-native-device-info';

export default function useDeviceVerification() {
    const [isLoading, setLoading] = React.useState(false);
    const [isVerified, setVerified] = React.useState(true);

    // const isJailBroken = JailMonkey.isJailBroken();

    // const isVerifiedAndNotJailBroken = isVerified && !isJailBroken;

    // React.useEffect(() => {
    //     async function init() {
    //         setLoading(true);
         
    //         setVerified(!isEmulator && !isError);
    //         setLoading(false);
    //     }
    //     init();
    // }, []);
    return [isLoading, __DEV__ || true];
}
