import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Typography, { TypographyVariants } from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors, { BLUE_DARK, GREY_2 } from '../../constants/Colors';
import { CallingReminderType } from '../../../types';
import moment from 'moment';
import { ResolveIcon } from '../common/Icons/ResolveIcon';
import { PhoneSvg } from '../IconSvg';
import { NumberTypography } from '../ui/NumberTypography';
import PhoneImage from '../common/PhoneImage';

export const NextTaskCallingItem = ({
    reminder,
    onClickResolve,
    onClickCall,
    onCall,
    detailsMap
}: {
    reminder: CallingReminderType;
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    onClickResolve: Function;
    onClickCall: Function;
    contactNumbers: string;
    onCall: Function;
    detailsMap: any;
}) => {
    const reminderDateTime = reminder?.reminder_date?.split(' ');
    const [numbersVisible, setNumbersVisible] = useState(false);
    const contactNumber = detailsMap[reminder.loan_id]?.contact_number ?? '';
    const contactNumberArray = contactNumber?.split(',') ?? [];

    return (
        <View style={styles.container}>
            <View style={styles.toDoRowContainer}>
                <Typography
                    style={styles.heading}
                    variant={TypographyVariants.body3}
                >
                    {reminder.loan_id}
                </Typography>
                <View style={{ alignItems: 'flex-end' }}>
                    <Typography variant={TypographyVariants.title1}>
                        {moment(reminderDateTime[1], 'HH:mm:ss').format(
                            'h:mm A'
                        )}
                    </Typography>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={{ paddingHorizontal: 10 }}
                            onPress={() => {
                                onClickResolve();
                            }}
                        >
                            <ResolveIcon />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                setNumbersVisible(!numbersVisible);
                                onClickCall(reminder);
                            }}
                        >
                            <Typography
                                variant={TypographyVariants.body5}
                                style={{
                                    marginRight: 4
                                }}
                            >
                                Call
                            </Typography>
                            <PhoneSvg size={18} color="#06C270" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {numbersVisible && (
                <View>
                    {contactNumberArray &&
                    contactNumberArray?.length > 0 &&
                    contactNumber ? (
                        contactNumberArray.map((number) => (
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
                            style={styles.noDataFound}
                            variant={TypographyVariants.caption}
                        >
                            No data found!
                        </Typography>
                    )}
                </View>
            )}
        </View>
    );
};
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
    container: {
        backgroundColor: Colors.light.background,
        borderRadius: 4,
        elevation: 2,
        justifyContent: 'space-between',
        margin: RFPercentage(0.2),
        padding: RFPercentage(1),
        paddingVertical: RFPercentage(1.4)
    },
    heading: {
        alignSelf: 'flex-start',
        margin: 10
    },
    numberContainer: {
        alignItems: 'center',
        borderColor: '#eee',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        padding: RFPercentage(1),
        paddingBottom: 0
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    toDoRowContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    noDataFound: {
        textAlign: 'center',
        paddingVertical: RFPercentage(0.5),
        color: GREY_2
    }
});
