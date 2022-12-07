import React, { useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Typography, { TypographyVariants } from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from '../../constants/Colors';
import { ReminderType } from '../../../types';
import {
    CompanyType,
    ReminderListType,
    TaskTypes,
    VisitPurposeType
} from '../../../enums';
import { VisitFormIcon } from '../common/Icons/VisitForm';
import moment from 'moment';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getVisitDetails } from '../../services/callingService';
import { useAuth } from '../../hooks/useAuth';
import { useClockIn } from '../../hooks/useClockIn';
import { CLOCK_IN_BEFORE_VISIT } from '../../constants/constants';
import useLoanDetails from '../../hooks/useLoanData';

export const ReminderRow = ({
    reminder,
    type
}: {
    reminder: ReminderType;
    type: string;
}) => {
    const navigation = useNavigation();
    const { setSelectedLoanData } = useLoanDetails();
    const { authData, companyType } = useAuth();
    const { clockInStatus, showNudge } = useClockIn();
    const [isFormClicked, setIsFormClicked] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
            if (isFocused) {
                if (clockInStatus && isFormClicked) {
                    setIsFormClicked(false);
                    await onClickForm();
                }
            } else setIsFormClicked(false);
        })();
    }, [clockInStatus, isFormClicked]);

    const onClickForm = async () => {
        if (!clockInStatus) {
            setIsFormClicked(true);
            showNudge();
            ToastAndroid.show(CLOCK_IN_BEFORE_VISIT, ToastAndroid.SHORT);
            return;
        }
        try {
            const apiRepsonse = await getVisitDetails(
                reminder.reminder_id,
                authData
            );
            if (apiRepsonse?.success) {
                let taskType =
                    reminder.visit_purpose == VisitPurposeType.surprise_visit
                        ? TaskTypes.visit
                        : TaskTypes.ptp;
                const tempLoanData: Array<ReminderType> =
                    apiRepsonse?.data ?? [];
                if (tempLoanData?.length == 0) {
                    ToastAndroid.show(
                        apiRepsonse?.message ??
                            'Unable to fetch Visit/PTP details',
                        ToastAndroid.SHORT
                    );
                    return;
                }
                setSelectedLoanData({ ...tempLoanData[0] });
                let navigateScreen =
                    companyType == CompanyType.loan
                        ? 'TaskDetailScreen'
                        : 'CreditTaskDetails';
                navigation.navigate(navigateScreen, {
                    taskType: taskType
                });
            }
        } catch (e) {
            ToastAndroid.show('Error fetching details', ToastAndroid.SHORT);
        }
    };
    return (
        <View style={styles.toDoRowContainer}>
            <View style={{ flex: 1 }}>
                <Typography variant={TypographyVariants.body3}>
                    {reminder.loan_id}
                </Typography>
            </View>
            {type === ReminderListType.pending && (
                <View style={{ marginRight: RFPercentage(3) }}>
                    <Typography variant={TypographyVariants.caption}>
                        {moment(reminder.visit_date).format('DD-MMM-YYYY')}
                    </Typography>
                </View>
            )}

            <TouchableOpacity onPress={onClickForm}>
                <VisitFormIcon />
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    toDoRowContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: RFPercentage(0.2),
        paddingHorizontal: RFPercentage(2.5),
        paddingVertical: RFPercentage(1.2)
    }
});
