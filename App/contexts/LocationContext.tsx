import React, { createContext, useState } from 'react';
import { PermissionsAndroid, ToastAndroid } from 'react-native';
import { PERMISSIONS, check, request } from 'react-native-permissions';
import { LocationAccessType, PermissionType } from '../../enums';
import { LocationContextData, locationResultType } from '../../types';
import { useAuth } from '../hooks/useAuth';
import { getLocationPromise } from '../services/utils';

const LocationContext = createContext<LocationContextData>(
    {} as LocationContextData
);

const LocationProvider: React.FC = ({ children }) => {
    const { locationAccess } = useAuth();
    const [locationPermission, setLocationPermission] = useState<any>();
    const [showLocationDialog, setShowLocationDialog] = useState(false);
    const checkLocation = async () => {
        let locationDialogue = false;
        const results = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (
            results == PermissionType.DENIED ||
            results == PermissionType.BLOCKED
        ) {
            locationDialogue = true;
        } else if (results == PermissionType.GRANTED) {
            locationDialogue = false;
        }
        if (locationAccess == LocationAccessType.disable_all)
            locationDialogue = false;
        setLocationPermission(results);
        setShowLocationDialog(locationDialogue);
        return results;
    };

    const allowLocationAccess = async () => {
        let results: locationResultType = {
            access: false,
            location: { latitude: 0, longitude: 0 },
            isMocked: false
        };
        const permission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (locationAccess == LocationAccessType.enable_hard_prompt) {
            if (!permission)
                ToastAndroid.show(
                    'This functionality is supported only with location access',
                    ToastAndroid.SHORT
                );
            else {
                results.access = true;
                const location = await getLocationPromise();
                results.location = location;
                results.isMocked = location?.isMocked;
            }
        } else if (locationAccess == LocationAccessType.enable_soft_prompt) {
            results.access = true;
            if (permission) {
                const location = await getLocationPromise();
                results.location = location;
                results.isMocked = location?.isMocked;
            }
        } else if (locationAccess == LocationAccessType.disable_all) {
            if (permission) {
                results.access = true;
                const location = await getLocationPromise();
                results.location = location;
                results.isMocked = location?.isMocked;
            } else {
                results.access = true;
            }
        } else if (locationAccess == LocationAccessType.enable_all) {
            results.access = true;
            const location = await getLocationPromise();
            results.location = location;
            results.isMocked = location?.isMocked;
        }
        setLocationPermission(results.access);

        return results;
    };
    const requestLocation = async () => {
        return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    };
    const getCurrentPermission = async () => {
        return PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
    };

    return (
        <LocationContext.Provider
            value={{
                checkLocation,
                locationPermission,
                setLocationPermission,
                showLocationDialog,
                setShowLocationDialog,
                requestLocation,
                allowLocationAccess,
                getCurrentPermission
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export { LocationContext, LocationProvider };
