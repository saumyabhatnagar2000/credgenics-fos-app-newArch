import React, { useEffect } from 'react';
import { LocationAccessType } from '../../enums';
import CustomAppBar from '../components/common/AppBar';
import DashboardDetails from '../components/dashboard/DashboardDetails';
import { ClockInNudgeInitPage } from '../contexts/ClockInStatusContext';
import { useAuth } from '../hooks/useAuth';
import { useClockIn } from '../hooks/useClockIn';
import { openLocationDialog } from '../services/utils';
import { useNavigation } from '@react-navigation/native';

export default function HomeTab() {
    const { checkClockInNudge } = useClockIn();
    const { locationAccess } = useAuth();

    const checkLocation = async () => {
        const result = await openLocationDialog();
    };

    useEffect(() => {
        if (locationAccess) {
            if (locationAccess == LocationAccessType.enable_all) {
                checkLocation();
            }
        }
    }, [locationAccess]);
    useEffect(() => {
        checkClockInNudge(ClockInNudgeInitPage.portfolio);
    }, []);

    return (
        <>
            <CustomAppBar
                title="Home"
                search={false}
                options={false}
                notifications={false}
                backButton={false}
                menuButton={true}
                filter={false}
                calendar={false}
                add={false}
                sort={false}
                clockInStatus={true}
                reminders={true}
                inverted={false}
            />
            <DashboardDetails />
        </>
    );
}
