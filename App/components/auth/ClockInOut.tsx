import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    ToastAndroid,
    View
} from 'react-native';
import {
    getUserClockStatus,
    setUserClockStatus
} from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    ClockedInOutMessages,
    ClockedInOutStatues,
    LocationAccessType,
    PermissionType
} from '../../../enums';
import ClockImage from '../common/ClockImage';
import Layout from '../../constants/Layout';
import { BLUE_DARK, RED2 } from '../../constants/Colors';
import Typography, { TypographyVariants } from '../ui/Typography';
import { useClockIn } from '../../hooks/useClockIn';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useMixpanel } from '../../contexts/MixpanelContext';
import { EventScreens, Events } from '../../constants/Events';

const THEME_COLOR = BLUE_DARK;

export default function ClockInOut() {
    const { authData, locationAccess, setMockLocationEnabled } = useAuth();
    const { requestLocation, allowLocationAccess } = useLocation();
    const { logEvent } = useMixpanel();

    const {
        clockedInTime,
        clockTime,
        clockInStatus,
        setClockInStatus,
        hideClockInBottomSheet,
        updateLoggedInStatus,
        autoClockOut
    } = useClockIn();

    const hideClockInOutComponent = () => {
        setTimeout(() => hideClockInBottomSheet(), 3000);
    };

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        updateLoggedInStatus();
    }, [autoClockOut]);

    const onHandleClick = async (): Promise<void> => {
        logEvent(Events.clock_in, EventScreens.clock_in_sheet, {
            value: clockInStatus
                ? ClockedInOutStatues.clocked_out
                : ClockedInOutStatues.clocked_in
        });
        if (clockInStatus) clockOut();
        else clockIn();
    };

    async function toggleUserClockStatus(): Promise<void> {
        let permission = PermissionType.DENIED;
        if (locationAccess != LocationAccessType.disable_all)
            permission = await requestLocation();
        if (
            permission == PermissionType.GRANTED ||
            locationAccess == LocationAccessType.disable_all
        ) {
            try {
                const locObject = await allowLocationAccess();
                if (locObject.isMocked) {
                    setMockLocationEnabled(true);
                    throw 'Location is mocked';
                }
                const { isMocked, ...loc } = locObject.location;
                const data = await setUserClockStatus(loc, authData);
                setClockInStatus(
                    data?.message === ClockedInOutMessages.clocked_in
                );
                await getUserClockStatus(authData);
                hideClockInOutComponent();
            } catch (e) {
                throw e;
            }
        } else {
            if (locationAccess == LocationAccessType.enable_hard_prompt) {
                ToastAndroid.show(
                    'This functionality is supported only with location access',
                    ToastAndroid.LONG
                );
                throw new Error('Error');
            }
        }
    }

    async function clockIn(): Promise<void> {
        try {
            setLoading(true);
            await toggleUserClockStatus();
            ToastAndroid.show('Clocked in successfully', ToastAndroid.LONG);
        } catch (error) {
            ToastAndroid.show('Error clocking in', ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    }

    async function clockOut(): Promise<void> {
        try {
            setLoading(true);
            await toggleUserClockStatus();
            ToastAndroid.show('Clocked out successfully', ToastAndroid.LONG);
        } catch (error) {
            ToastAndroid.show('Error clocking out', ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.content}>
                <ActivityIndicator color="#000" style={{ height: '100%' }} />
            </View>
        );
    }

    function diffInMinutes(a: Date, b: Date) {
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(
            a.getFullYear(),
            a.getMonth(),
            a.getDate(),
            a.getHours(),
            a.getMinutes(),
            a.getSeconds(),
            a.getMilliseconds()
        );
        const utc2 = Date.UTC(
            b.getFullYear(),
            b.getMonth(),
            b.getDate(),
            b.getHours(),
            b.getMinutes(),
            b.getSeconds(),
            b.getMilliseconds()
        );
        return (Math.abs(utc2 - utc1) / 6e4).toFixed();
    }

    function getDate(timeStr: string) {
        const [date, time] = timeStr.split(' ');
        const d = date.split('-');
        const t = time.split(':');
        const x = new Date(...d, ...t);
        x.setMonth(x.getMonth() - 1); // months are indexes
        return x;
    }

    function timeConvert(num: any) {
        var hours = num / 60;
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return (
            String(rhours).padStart(2, '0') +
            ':' +
            String(rminutes).padStart(2, '0') +
            ' hrs'
        );
    }

    let difference = '0';
    if (clockedInTime) {
        difference = diffInMinutes(getDate(clockedInTime), new Date());
    }

    const timeInMinutes = Number(clockTime) / (1000 * 60) + Number(difference);
    const hours = timeConvert(timeInMinutes);

    let width: any = (timeInMinutes * 100) / (24 * 60);
    if (width > 100) width = 100;
    const widthStyle = { width: `${width}%` };

    let data = (
        <Typography variant={TypographyVariants.title1}>
            Mark your shift by Clocking- In
        </Typography>
    );
    if (clockInStatus) {
        data = (
            <View style={styles.progressFlex}>
                <View style={styles.progressContainer}>
                    <View style={[styles.progress, widthStyle]} />
                </View>
                <Text style={[styles.timeText]}>{hours}</Text>
            </View>
        );
    }

    const ButtonText = clockInStatus ? 'Clock-Out' : 'Clock-In';
    const ButtonColor = clockInStatus ? RED2 : BLUE_DARK;

    return (
        <View style={styles.content}>
            <View style={styles.main}>
                <TouchableOpacity
                    disabled={clockInStatus}
                    onPress={onHandleClick}
                    style={[styles.alignCenter, { marginRight: 2 }]}
                >
                    <ClockImage
                        size={RFPercentage(3.6)}
                        type={ClockedInOutStatues.clocked_in}
                    />
                </TouchableOpacity>
                {data}
            </View>
            <TouchableOpacity
                onPress={onHandleClick}
                style={{
                    backgroundColor: ButtonColor,
                    borderRadius: 4
                }}
            >
                <Text style={styles.buttonStyle}>{ButtonText}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    alignCenter: {
        alignItems: 'center'
    },

    buttonStyle: {
        color: 'white',
        margin: RFPercentage(2),
        marginVertical: RFPercentage(1.2)
    },
    content: {
        alignItems: 'center',
        height: RFPercentage(16),
        padding: RFPercentage(2),
        width: '100%'
    },
    loadingStyle: {
        padding: 35
    },
    main: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        width: '100%'
    },
    progress: {
        backgroundColor: '#5278C7',
        borderRadius: 6,
        height: '100%'
    },
    progressContainer: {
        backgroundColor: '#C4C4C4',
        borderRadius: 6,
        flex: 1,
        maxHeight: 8
    },
    progressFlex: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    timeText: {
        color: THEME_COLOR,
        fontSize: 10,
        fontWeight: 'bold',
        height: Layout.window.height * 0.03,
        marginLeft: 2,
        marginTop: 2
    }
});
