import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Typography, { TypographyVariants } from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors, { GREY_2 } from '../../constants/Colors';
import { CallingReminderType } from '../../../types';
import moment from 'moment';
import { ResolveIcon } from '../common/Icons/ResolveIcon';
import { PhoneSvg } from '../IconSvg';
import { NumberTypography } from '../ui/NumberTypography';
import PhoneImage from '../common/PhoneImage';

export const CallingRow = ({
    reminder,
    onClickResolve,
    onClickCall,
    onCall,
    detailsMap,
    hideDate = false
}: {
    reminder: CallingReminderType;
    onClickResolve: Function;
    onClickCall: Function;
    onCall: Function;
    detailsMap: any;
    hideDate?: boolean;
}) => {
    const reminderDateTime = reminder?.reminder_date?.split(' ');
    const [numbersVisible, setNumbersVisible] = useState(false);
    const contactNumber = detailsMap[reminder.loan_id]?.contact_number ?? '';
    const contactNumberArray = contactNumber?.split(',') ?? [];
    return (
        <>
            <View style={styles.toDoRowContainer}>
                <View style={{ flex: 1 }}>
                    <Typography variant={TypographyVariants.body4}>
                        ID: {reminder.loan_id}
                    </Typography>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {hideDate || (
                        <Typography variant={TypographyVariants.caption}>
                            {reminderDateTime[0]}
                        </Typography>
                    )}
                    <Typography
                        style={{ color: '#8899A8', textAlign: 'center' }}
                        variant={TypographyVariants.caption1}
                    >
                        {moment(reminderDateTime[1], 'HH:mm:ss').format(
                            'h:mm A'
                        )}
                    </Typography>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        flex: 1
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setNumbersVisible(!numbersVisible);
                            onClickCall(reminder);
                        }}
                        style={{ marginHorizontal: RFPercentage(3) }}
                    >
                        <PhoneSvg color="#06C270" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            onClickResolve();
                        }}
                    >
                        <ResolveIcon />
                    </TouchableOpacity>
                </View>
            </View>
            {numbersVisible && (
                <View>
                    {contactNumberArray &&
                    contactNumberArray?.length &&
                    contactNumber ? (
                        contactNumberArray.map((number: string) => (
                            <TouchableOpacity
                                onPress={() =>
                                    onCall(number, reminder.allocation_month)
                                }
                                style={styles.numberContainer}
                            >
                                <NumberTypography
                                    variant={TypographyVariants.body2}
                                    style={{
                                        color: 'grey'
                                    }}
                                    number={number}
                                />
                                <PhoneImage size={22} />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Typography
                            variant={TypographyVariants.caption}
                            style={styles.noDataFound}
                        >
                            No data found!
                        </Typography>
                    )}
                </View>
            )}
        </>
    );
};
const styles = StyleSheet.create({
    numberContainer: {
        alignItems: 'center',
        borderColor: '#eee',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: RFPercentage(2),
        paddingVertical: RFPercentage(1)
    },
    toDoRowContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        flexDirection: 'row',
        flex: 3,
        justifyContent: 'space-evenly',
        marginVertical: RFPercentage(0.2),
        paddingHorizontal: RFPercentage(2),
        paddingVertical: RFPercentage(1.2),
        borderTopWidth: 1,
        borderColor: '#eee'
    },
    noDataFound: {
        textAlign: 'center',
        paddingVertical: RFPercentage(0.5),
        color: GREY_2
    }
});
