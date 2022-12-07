import * as React from 'react';
// import JailMonkey from 'jail-monkey';
// import RNGoogleSafetyNet from 'react-native-google-safetynet';
import { ANDROID_DEVICE_VERIFICATION_API_KEY } from '../config/ApiKeys';
import DeviceInfo from 'react-native-device-info';

export default function useDeviceVerification() {
    const [isLoading, setLoading] = React.useState(false);
    const [isVerified, setVerified] = React.useState(true);

    // const isJailBroken = JailMonkey.isJailBroken();

    // const isVerifiedAndNotJailBroken = isVerified && !isJailBroken;

    React.useEffect(() => {
        async function init() {
            // setLoading(true);
            // const nonce = await RNGoogleSafetyNet.generateNonce(12);
            // const isError = await RNGoogleSafetyNet.sendAndVerifyAttestation(
            //     nonce,
            //     ANDROID_DEVICE_VERIFICATION_API_KEY
            // );
            // const isEmulator = await DeviceInfo.isEmulator();
            // setVerified(!isEmulator && !isError);
            // setLoading(false);
        }
        init();
    }, []);
    return [isLoading, __DEV__ || true];
}
