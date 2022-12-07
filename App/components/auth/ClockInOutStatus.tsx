import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ClockImage from '../common/ClockImage';
import { ClockedInOutStatues } from '../../../enums';
import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useClockIn } from '../../hooks/useClockIn';
import { useMixpanel } from '../../contexts/MixpanelContext';
import { EventAction, EventScreens, Events } from '../../constants/Events';

export default function ClockInOutStatus() {
    const { clockInStatus, showClockInBottomSheet } = useClockIn();
    const { logEvent } = useMixpanel();

    const onHandleClick = () => {
        logEvent(Events.clock_in, EventScreens.app_bar, {
            action: EventAction.click
        });
        showClockInBottomSheet();
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onHandleClick}>
            <ClockImage
                type={
                    clockInStatus
                        ? ClockedInOutStatues.clocked_in
                        : ClockedInOutStatues.clocked_out
                }
                size={RFPercentage(4.5)}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: RFPercentage(1)
    }
});
