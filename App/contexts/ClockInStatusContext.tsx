import React, { createContext, useEffect, useState } from 'react';
import {
    AuthData,
    ClockInStatusContextData,
    ClockStatusType
} from '../../types';
import {
    getUserClockStatus,
    setUserClockStatus
} from '../services/authService';
import {
    ClockInOutStatus,
    ClockedInOutStatues,
    LocationAccessType
} from '../../enums';
import { useAuth } from '../hooks/useAuth';
import { getStorageData, setStorageData } from '../utils/Storage';
import {
    AUTH_STORAGE_KEY,
    LOCATION_REJECTED_STORAGE_KEY,
    LOCATION_STORAGE_KEY,
    NUDGE_STORAGE_KEY
} from '../constants/Storage';
import { getLocationPromise, getToday } from '../services/utils';
import moment from 'moment';
import { sendLocationCoordinates } from '../services/locationService';
import {
    AppState,
    AppStateStatus,
    PermissionsAndroid,
    ToastAndroid
} from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import RNLocation from 'react-native-location';
import BottomSheet from '@gorhom/bottom-sheet';
import DeviceInfo from 'react-native-device-info';
import * as Sentry from '@sentry/react-native';
import useCommon from '../hooks/useCommon';

const MAX_NUDGES = 2;
const NUDGE_TIMEOUT = 8000;

const LOCATION_TIME_DELAY = 30000;
const LOCATION_BUFFER = 4;
const LOCATION_RETRIES = 4; // 2 mins

// Check clock in status between 10-10:15PM only
const CLOCK_OUT_TIME_24_HRS_HOUR = 22;
const CLOCK_OUT_TIME_24_HRS_MIN = 15;

const LOCATION_TASK_ID = 'location-task';

RNLocation.configure({
    // distanceFilter: 100, // Meters
    desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy'
    },
    // Android only
    androidProvider: 'auto',
    interval: LOCATION_TIME_DELAY, // Milliseconds
    fastestInterval: LOCATION_TIME_DELAY, // Milliseconds
    maxWaitTime: LOCATION_TIME_DELAY // Milliseconds
});

const ClockInStatusContext = createContext<ClockInStatusContextData>(
    {} as ClockInStatusContextData
);

export enum ClockInNudgeInitPage {
    portfolio = 'portfolio',
    visit = 'visit',
    visit_list = 'visit_list',
    create = 'create'
}

enum AppStates {
    active = 'active',
    background = 'background'
}

const ClockInStatusContextProvider: React.FC = ({ children }) => {
    const [clockInStatus, setClockInStatus] = useState<boolean | null>(null);
    const [clockedInTime, setClockedInTime] = useState<string | null>(null);
    const [clockTime, setClockTime] = useState<string | null>(null);
    const bottomSheetRef = React.useRef<BottomSheet>(null);

    const { authData, locationAccess, setMockLocationEnabled } = useAuth();
    const locationPermission = async () => {
        PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
    };
    const { isInternetAvailable } = useCommon();

    const updateLoggedInStatus = async () => {
        if (!authData) return '';
        const data: ClockStatusType = await getUserClockStatus(authData);
        if (data?.status && data?.status in ClockedInOutStatues) {
            setClockInStatus(data.status === ClockedInOutStatues.clocked_in);
            setClockedInTime(data.clock_in_time);
            setClockTime(data.clock_time);
        } else {
            setClockInStatus(false);
        }
        return data?.status ?? '';
    };

    useEffect(() => {
        if (authData && isInternetAvailable) updateLoggedInStatus();
    }, [authData, isInternetAvailable]);

    const [state, setState] = useState<AppStateStatus | null>(null);
    useEffect(() => {
        AppState.addEventListener('change', (_changed) => setState(_changed));
        return () => AppState.removeEventListener('change', () => {});
    }, []);

    const locationForegroundService = async () => {
        let authDataNew: AuthData | null = null;
        try {
            const authDataSerialized = await getStorageData(AUTH_STORAGE_KEY);
            if (authDataSerialized)
                authDataNew = JSON.parse(authDataSerialized);
        } catch {}

        if (!authDataNew) {
            ReactNativeForegroundService.remove_task(LOCATION_TASK_ID);
            ReactNativeForegroundService.stop();
            return;
        }

        const time = moment().format('HH:mm');
        const [_hourTime, _minTime] = time.split(':');
        const hourTime = parseInt(_hourTime);
        const minTime = parseInt(_minTime);
        if (
            hourTime == CLOCK_OUT_TIME_24_HRS_HOUR &&
            minTime <= CLOCK_OUT_TIME_24_HRS_MIN
        ) {
            const data: ClockStatusType = await getUserClockStatus(authDataNew);
            let isClockedInOnBackend = false;
            if (data?.status && data?.status in ClockedInOutStatues) {
                // is clocked in
                isClockedInOnBackend =
                    data?.status === ClockedInOutStatues.clocked_in;
            } else {
                // isn't clocked in
                ReactNativeForegroundService.remove_task(LOCATION_TASK_ID);
                ReactNativeForegroundService.stop();
                return;
            }
        }

        const loc = await RNLocation.getLatestLocation();
        if (loc?.fromMockProvider) {
            setMockLocationEnabled(true);
            return;
        }
        if (loc) {
            let batteryLevelInPercentage = -1;
            try {
                const batteryLevel = await DeviceInfo.getBatteryLevel();
                batteryLevelInPercentage = Math.round(batteryLevel * 100);
            } catch (e) {}

            const timestampinSec = parseInt(String(loc?.timestamp ?? 0 / 1000));
            const newData = {
                company_id: authDataNew?.company_id,
                user_id: authDataNew?.userId,
                created: timestampinSec,
                location: {
                    type: 'Point',
                    coordinates: [loc?.longitude ?? 0, loc?.latitude ?? 0]
                },
                battery_level: batteryLevelInPercentage
            };

            let locData: any = [];
            try {
                const locStorageData = await getStorageData(
                    LOCATION_STORAGE_KEY
                );
                if (locStorageData) locData = JSON.parse(locStorageData) ?? [];
                if (!Array.isArray(locData)) locData = [];
            } catch (error) {}

            locData = [...locData, newData];

            if (locData.length >= LOCATION_BUFFER) {
                try {
                    await sendLocationCoordinates(locData, authDataNew);
                } catch (e) {}
                locData = [];
            }

            try {
                setStorageData(LOCATION_STORAGE_KEY, JSON.stringify(locData));
                setStorageData(LOCATION_REJECTED_STORAGE_KEY, String(0));
            } catch (e) {}
        } else {
            let locRejData: number = 0;
            try {
                const locRejStorageData = await getStorageData(
                    LOCATION_REJECTED_STORAGE_KEY
                );
                if (locRejStorageData) locRejData = parseInt(locRejStorageData);
            } catch (error) {}

            try {
                locRejData += 1;
                if (locRejData >= LOCATION_RETRIES) {
                    await setStorageData(
                        LOCATION_REJECTED_STORAGE_KEY,
                        String(0)
                    );
                    ReactNativeForegroundService.remove_task(LOCATION_TASK_ID);
                    ReactNativeForegroundService.stop();
                } else {
                    await setStorageData(
                        LOCATION_REJECTED_STORAGE_KEY,
                        String(locRejData)
                    );
                }
            } catch (e) {}
        }
    };

    // Location service
    React.useEffect(() => {
        if (
            !authData ||
            !clockInStatus ||
            !locationAccess ||
            locationAccess == LocationAccessType.disable_all
        ) {
            ReactNativeForegroundService.remove_task(LOCATION_TASK_ID);
            ReactNativeForegroundService.stop();
        } else {
            ReactNativeForegroundService.add_task(
                async () => {
                    if (
                        await PermissionsAndroid.check(
                            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                        )
                    ) {
                        await locationForegroundService();
                    }
                    return;
                },
                {
                    delay: LOCATION_TIME_DELAY,
                    onLoop: true,
                    taskId: LOCATION_TASK_ID,
                    onError: (e) => Sentry.captureException(e)
                }
            );

            ReactNativeForegroundService.start({
                id: 122,
                title: 'CG Collect',
                message: 'You are online!'
            });
        }
    }, [authData, clockInStatus, locationAccess, state]);

    const getNudgeData = async () => {
        let nudgeData: any = {};
        try {
            const nudgeStorageData = await getStorageData(NUDGE_STORAGE_KEY);
            if (nudgeStorageData) nudgeData = JSON.parse(nudgeStorageData);
        } catch (error) {}
        return nudgeData;
    };

    const updateNudgeData = async () => {
        const data = await getNudgeData();
        const todaysDataKey = getToday();
        if (Object.keys(data).includes(todaysDataKey)) {
            if (data[todaysDataKey].length <= MAX_NUDGES) {
                const timeStamp = moment().unix();
                data[todaysDataKey] = [...data[todaysDataKey], timeStamp];
                await setStorageData(NUDGE_STORAGE_KEY, JSON.stringify(data));
            }
        } else {
            const newData: any = {};
            const timeStamp = moment().unix();
            newData[todaysDataKey] = [timeStamp];
            await setStorageData(NUDGE_STORAGE_KEY, JSON.stringify(newData));
        }
    };

    const isNudgeNeeded = async () => {
        const data = await getNudgeData();
        const todaysDataKey = getToday();
        if (Object.keys(data).includes(todaysDataKey)) {
            if (data[todaysDataKey].length >= MAX_NUDGES) return false;
        }
        return true;
    };

    const showNudge = () => {
        if (isInternetAvailable) showClockInBottomSheet();
    };

    const showAndHideNudge = () => {
        if (isInternetAvailable) {
            showClockInBottomSheet();
            setTimeout(() => hideClockInBottomSheet(), NUDGE_TIMEOUT);
        }
    };

    const showClockInBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const hideClockInBottomSheet = () => {
        bottomSheetRef.current?.close();
    };

    const checkClockInNudge = async (page: string) => {
        if (clockInStatus) return;
        switch (page) {
            case ClockInNudgeInitPage.portfolio:
                if (isInternetAvailable) {
                    showAndHideNudge();
                }
                break;

            default:
                if ((await isNudgeNeeded()) && isInternetAvailable) {
                    showAndHideNudge();
                    await updateNudgeData();
                }
                break;
        }
    };

    const autoClockOut = async (userData: AuthData) => {
        try {
            const apiResponse = await getUserClockStatus(userData);
            const currentStatus = apiResponse?.status;
            if (currentStatus === ClockInOutStatus.clocked_in) {
                const { isMocked, ...location } = await getLocationPromise();
                await setUserClockStatus(location, userData);
            }
        } catch (e) {
            ToastAndroid.show('Error Clocking out', ToastAndroid.SHORT);
        }
    };

    return (
        <ClockInStatusContext.Provider
            value={{
                clockInStatus,
                setClockInStatus,
                clockTime,
                setClockTime,
                clockedInTime,
                setClockedInTime,
                updateLoggedInStatus,
                checkClockInNudge,
                showNudge,
                showClockInBottomSheet,
                hideClockInBottomSheet,
                bottomSheetRef,
                autoClockOut
            }}
        >
            {children}
        </ClockInStatusContext.Provider>
    );
};

export { ClockInStatusContext, ClockInStatusContextProvider };
