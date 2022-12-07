import { Platform } from 'react-native';
import {
    PERMISSIONS,
    RESULTS,
    checkMultiple,
    requestMultiple
} from 'react-native-permissions';
export const checkLocationPermissions = async () => {
    try {
        let results: any;
        if (Platform.Version < 29) {
            results = await checkMultiple([
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            ]);
        } else {
            results = await checkMultiple([
                PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
            ]);
        }
        return handlePermissionResult(results);
    } catch {
        return false;
    }
};

export const requestLocationPermissions = async () => {
    try {
        const results = await requestMultiple([
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        ]);
        return handlePermissionResult(results);
    } catch {
        return false;
    }
};

const handlePermissionResult = (results: any) => {
    if (Platform.Version < 29)
        return checkPermissionResult(
            results[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
        );
    else
        return checkPermissionResult(
            results[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION]
        );
};
const checkPermissionResult = (result: string) => {
    switch (result) {
        case RESULTS.GRANTED:
            return true;
        default:
            return false;
    }
};
