import React, { useState } from 'react';
import { CheckBox, Icon } from '@rneui/base';
import { StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { PortfolioRowType } from '../../../types';
import {
    StringCompare,
    getOnlyDistance,
    startCall
} from '../../services/utils';
import { RFPercentage } from 'react-native-responsive-fontsize';
import StatusCapsule from '../common/StatusCapsule';
import PhoneImage from '../common/PhoneImage';
import {
    BLUE_2,
    BLUE_DARK,
    CAPSULE_BLUE_PRIMARY,
    CAPSULE_BLUE_SECONDARY,
    GREY,
    GREY_2
} from '../../constants/Colors';
import Typography, { TypographyVariants } from '../ui/Typography';
import { useAuth } from '../../hooks/useAuth';
import { CallingModeTypes, CompanyType, LoanStatusType } from '../../../enums';
import { callUser } from '../../services/communicationService';
import ConnectingClickToCallModal from '../modals/ConnectingClickToCallModal';
import CallTypeListModal from '../modals/CallTypeListModal';
import CurrencyTypography from '../ui/CurrencyTypography';
import { NumberTypography } from '../ui/NumberTypography';
import { useNavigation } from '@react-navigation/native';
import { LOAN_IS_CLOSED, Overall } from '../../constants/constants';
export default function PortfolioRow({
    rowData,
    onCheckboxClicked,
    onItemClicked,
    onCallClicked,
    checked,
    details
}: PortfolioRowType): JSX.Element {
    const { callingModes, authData, allocationMonth, companyType } = useAuth();
    const { navigate } = useNavigation();
    const [isConnectingVisible, setIsConnectingVisible] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState('');
    const [numbersVisible, setNumbersVisible] = useState(false);

    const phoneIconClicked = () => {
        if (numbersVisible) {
            setNumbersVisible(false);
            return;
        }
        if (!details) onCallClicked();
        setNumbersVisible(true);
    };

    const showConnecting = () => {
        setIsConnectingVisible(true);
        setInterval(() => {
            setIsConnectingVisible(false);
        }, 5000);
    };

    const onCall = (number: string) => {
        if (StringCompare(allocationMonth, Overall)) {
            ToastAndroid.show(
                `Call cannot be placed at ‘Overall’ allocation month, please select an individual month.`,
                ToastAndroid.LONG
            );
            return;
        }
        const isC2CAvailable = callingModes.includes(
            CallingModeTypes.click_to_call
        );
        const isManualAvailable = callingModes.includes(
            CallingModeTypes.manual
        );

        if (isC2CAvailable && isManualAvailable) setSelectedNumber(number);
        else if (isManualAvailable) startCall(number);
        else if (isC2CAvailable) c2c(number);
    };

    const handleCallTypeSelect = (type: CallingModeTypes) => {
        const number = selectedNumber;
        setSelectedNumber('');
        if (type === CallingModeTypes.manual) startCall(number);
        if (type === CallingModeTypes.click_to_call) c2c(number);
    };

    const c2c = async (number: string) => {
        const data = {
            To: number,
            From: authData?.mobile,
            applicant_type: rowData.applicant_type,
            status: 'call_attempted'
        };
        try {
            const apiRepsonse = await callUser(
                rowData.loan_id,
                allocationMonth,
                data.To,
                data.From,
                data.applicant_type,
                data.status,
                authData
            );
            showConnecting();
            if (StringCompare(rowData?.final_status, LoanStatusType.closed)) {
                ToastAndroid.show(LOAN_IS_CLOSED, ToastAndroid.LONG);
                return;
            }
            navigate('DispositionFormScreen', {
                shootId: apiRepsonse?.data?.shoot_id ?? '',
                phoneNumber: data.To,
                allocation_month: allocationMonth
            });
        } catch (e: any) {}
    };

    const customerNumbers = details?.contact_number?.split(',') ?? [];

    return (
        <View style={styles.container}>
            <ConnectingClickToCallModal visible={isConnectingVisible} />
            <CallTypeListModal
                visible={!!selectedNumber}
                hide={() => setSelectedNumber('')}
                onTypeSelect={handleCallTypeSelect}
            />
            <View style={styles.rowCenter}>
                {!StringCompare(allocationMonth, Overall) ? (
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <CheckBox
                            uncheckedColor="#90919588"
                            checkedColor={BLUE_2}
                            size={RFPercentage(4)}
                            iconType="material"
                            checkedIcon="check-box"
                            uncheckedIcon="check-box-outline-blank"
                            checked={checked}
                            onPress={() => onCheckboxClicked()}
                        />
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                    onPress={() => onItemClicked()}
                    style={
                        !StringCompare(allocationMonth, Overall)
                            ? styles.dataContainer
                            : styles.dataContainerOverall
                    }
                >
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginBottom: RFPercentage(1) }}>
                                <View
                                    style={{
                                        flexDirection: 'row'
                                    }}
                                >
                                    <Typography
                                        variant={TypographyVariants.title1}
                                        style={[styles.heading, { flex: 1 }]}
                                    >
                                        {rowData.applicant_name ?? 'NA'}
                                    </Typography>
                                    <TouchableOpacity
                                        style={{
                                            marginLeft: RFPercentage(2),
                                            marginRight: RFPercentage(1)
                                        }}
                                        onPress={phoneIconClicked}
                                    >
                                        <PhoneImage size={20} />
                                    </TouchableOpacity>
                                </View>
                                {companyType == CompanyType.credit_line ? (
                                    <Typography
                                        style={[
                                            styles.textSecondary,
                                            {
                                                color: '#043E90',
                                                marginVertical:
                                                    RFPercentage(0.3)
                                            }
                                        ]}
                                        variant={TypographyVariants.caption1}
                                    >
                                        {`Transactions: ${
                                            rowData?.number_of_transactions ??
                                            'NA'
                                        }`}
                                    </Typography>
                                ) : null}
                                <Typography
                                    style={styles.textSecondary}
                                    variant={TypographyVariants.caption1}
                                >
                                    {`ID: ${rowData.loan_id ?? 'NA'}  |  DPD: ${
                                        rowData?.dpd ?? '-'
                                    }`}
                                </Typography>
                            </View>
                        </View>
                        <CurrencyTypography
                            variant={TypographyVariants.title1}
                            amount={rowData?.total_claim_amount}
                        />
                    </View>

                    <View
                        style={[
                            styles.rowCenter,
                            { justifyContent: 'space-between' }
                        ]}
                    >
                        <View
                            style={[
                                styles.rowCenter,
                                { marginVertical: RFPercentage(0.5) }
                            ]}
                        >
                            <Icon
                                style={{ marginRight: 8 }}
                                size={RFPercentage(1.8)}
                                name="map-marker-alt"
                                type="fontisto"
                                color={GREY_2}
                            />
                            <Typography variant={TypographyVariants.caption}>
                                {`${getOnlyDistance(rowData.distance_in_km)}`}
                            </Typography>
                        </View>
                        <StatusCapsule
                            primaryColor={CAPSULE_BLUE_PRIMARY}
                            secondaryColor={CAPSULE_BLUE_SECONDARY}
                            title={rowData.final_status ?? '--'}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            {numbersVisible && (
                <View>
                    {customerNumbers &&
                    customerNumbers?.length &&
                    details?.contact_number ? (
                        customerNumbers.map((number) => (
                            <TouchableOpacity
                                onPress={() => onCall(number)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: RFPercentage(2),
                                    paddingVertical: RFPercentage(1),
                                    borderTopWidth: 1,
                                    borderColor: '#eee'
                                }}
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
        </View>
    );
}

const styles = StyleSheet.create({
    amount: {
        color: BLUE_DARK,
        fontSize: RFPercentage(2.2),
        fontWeight: 'bold',
        paddingVertical: 2
    },
    container: {
        backgroundColor: 'white',
        borderRadius: RFPercentage(0.5),
        marginHorizontal: RFPercentage(1),
        marginVertical: RFPercentage(0.6)
    },
    dataContainer: {
        flex: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingRight: RFPercentage(1),
        paddingVertical: RFPercentage(0.8)
    },
    dataContainerOverall: {
        flex: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: RFPercentage(2),
        paddingVertical: RFPercentage(0.8)
    },
    heading: {
        paddingVertical: 2
    },
    rowCenter: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    textSecondary: {
        color: GREY,
        marginTop: RFPercentage(0.4)
    },
    noDataFound: {
        textAlign: 'center',
        paddingVertical: RFPercentage(0.5),
        color: GREY_2
    }
});
