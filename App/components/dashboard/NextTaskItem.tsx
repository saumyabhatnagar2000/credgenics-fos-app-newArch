import React, { useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Typography, { TypographyVariants } from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors, { BLUE_DARK } from '../../constants/Colors';
import { ReminderType } from '../../../types';
import { CompanyType, TaskTypes, VisitPurposeType } from '../../../enums';
import { VisitFormIcon } from '../common/Icons/VisitForm';
import moment from 'moment';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getVisitDetails } from '../../services/callingService';
import { useClockIn } from '../../hooks/useClockIn';
import { CLOCK_IN_BEFORE_VISIT } from '../../constants/constants';
import { useAuth } from '../../hooks/useAuth';
import useLoanDetails from '../../hooks/useLoanData';

export default function NextTaskItem({ reminder }: { reminder: ReminderType }) {
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
    }, [clockInStatus]);

    const onClickForm = async () => {
        if (!clockInStatus) {
            setIsFormClicked(true);
            ToastAndroid.show(CLOCK_IN_BEFORE_VISIT, ToastAndroid.SHORT);
            showNudge();
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
                    taskType: taskType,
                    allocation_month: reminder.allocation_month
                });
            }
        } catch (e) {
            ToastAndroid.show('Error fetching details', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.toDoRowContainer}>
            <Typography
                style={styles.heading}
                variant={TypographyVariants.body3}
            >
                {reminder.loan_id}
            </Typography>
            <View style={{ alignItems: 'center' }}>
                <Typography variant={TypographyVariants.title1}>
                    {moment(
                        reminder.reminder_date.split(' ')[1],
                        'HH:mm:ss'
                    ).format('h:mm A')}
                </Typography>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onClickForm}
                >
                    <Typography
                        variant={TypographyVariants.body5}
                        style={{ marginRight: 4 }}
                    >
                        Visit
                    </Typography>
                    <VisitFormIcon size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    actionButton: {
        alignItems: 'center',
        backgroundColor: '#E5F0FF',
        borderColor: BLUE_DARK,
        borderRadius: 6,
        borderStyle: 'solid',
        borderWidth: 1,
        flexDirection: 'row',
        marginTop: 4,
        padding: RFPercentage(0.8),
        paddingHorizontal: RFPercentage(1.2)
    },
    heading: {
        alignSelf: 'flex-start',
        margin: 10
    },
    toDoRowContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        borderRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: RFPercentage(0.2),
        padding: RFPercentage(1),
        paddingVertical: RFPercentage(1.4)
    }
});
