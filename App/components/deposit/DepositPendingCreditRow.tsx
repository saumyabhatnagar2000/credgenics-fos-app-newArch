import React, { useState } from 'react';
import { Icon } from '@rneui/base';
import { LayoutAnimation, Platform, StyleSheet, View } from 'react-native';
import { PendingDepositRowCreditType } from '../../../types';
import { getOnlyDate } from '../../services/utils';
import { DepositTypes } from '../../../enums';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, { TypographyVariants } from '../ui/Typography';
import { GREY } from '../../constants/Colors';
import CurrencyTypography from '../ui/CurrencyTypography';
import { ChevronDown } from '../common/Icons/ChevronDown';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '../../hooks/useAuth';
import DashedLine from 'react-native-dashed-line';
import { ChevronUp } from '../common/Icons/ChevronUp';

export const DepositPendingCreditRow = ({
    rowData,
    isOnline,
    onClickDetails,
    transactionDataMap
}: PendingDepositRowCreditType): JSX.Element => {
    const { authData, getCurrencyString } = useAuth();
    const icon =
        rowData.payment_method === DepositTypes.cheque
            ? rowData.checked
                ? 'radio-button-checked'
                : 'radio-button-off'
            : rowData.checked
            ? 'check-box'
            : 'check-box-outline-blank';
    const [isExpanded, setIsExpanded] = useState(false);
    const transactionData = transactionDataMap[rowData.visit_id];

    const toggleExpand = async () => {
        onClickDetails(rowData);
        if (Platform.OS == 'android') {
            LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
            );
            setIsExpanded(!isExpanded);
        }
    };
    return (
        <>
            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                {!isOnline && (
                    <Icon
                        name={icon}
                        type="material"
                        color={rowData.checked ? '#2C68B2' : 'gray'}
                        style={{ margin: 10, marginLeft: 0 }}
                    />
                )}
                <View style={styles.container}>
                    <View style={styles.toprow}>
                        <View style={{ flex: 3 }}>
                            <Typography
                                variant={TypographyVariants.title1}
                                style={styles.heading}
                            >
                                {rowData.applicant_name ?? 'NA'}
                            </Typography>

                            <Typography
                                style={styles.textSecondary}
                                variant={TypographyVariants.caption1}
                            >
                                Visit ID :{' '}
                                {rowData.visit_id ? rowData.visit_id : 'NA'}
                            </Typography>
                            <Typography
                                style={{ marginTop: RFPercentage(0.5) }}
                                variant={TypographyVariants.caption1}
                            >
                                {`${getOnlyDate(rowData.created)}  |  ${
                                    rowData.loan_id
                                }`}
                            </Typography>
                        </View>
                        <View style={{ justifyContent: 'space-evenly' }}>
                            <CurrencyTypography
                                amount={rowData.amount_recovered}
                                variant={TypographyVariants.title1}
                            />
                        </View>
                    </View>

                    {isExpanded && (
                        <>
                            <DashedLine
                                dashColor="rgba(0,0,0,0.1)"
                                style={{
                                    marginVertical: RFPercentage(1.5)
                                }}
                                dashThickness={0.9}
                            />
                            <View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography
                                        style={{ flex: 1.5, color: '#5D5D5F' }}
                                        variant={TypographyVariants.caption3}
                                    >
                                        Transaction Id
                                    </Typography>
                                    <Typography
                                        style={{ flex: 1, color: '#5D5D5F' }}
                                        variant={TypographyVariants.caption3}
                                    >
                                        Amount
                                    </Typography>
                                </View>

                                {transactionData &&
                                    transactionData.map((item: any) => {
                                        return (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Typography
                                                    style={{
                                                        flex: 1.5,
                                                        color: '#8899A8'
                                                    }}
                                                    variant={
                                                        TypographyVariants.caption1
                                                    }
                                                >
                                                    {item?.transaction_id ?? ''}
                                                </Typography>
                                                <Typography
                                                    style={{
                                                        flex: 1,
                                                        color: '#8899A8'
                                                    }}
                                                    variant={
                                                        TypographyVariants.caption1
                                                    }
                                                >
                                                    {getCurrencyString(
                                                        item?.amount_recovered
                                                    ) ?? ''}
                                                </Typography>
                                            </View>
                                        );
                                    })}
                            </View>
                        </>
                    )}
                </View>
            </View>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }}
                onPress={toggleExpand}
            >
                <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onStartShouldSetResponder={(event) => true}
                    onTouchEnd={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <Typography
                        style={{ marginRight: RFPercentage(0.5) }}
                        variant={TypographyVariants.caption1}
                    >
                        Details
                    </Typography>
                    {!isExpanded ? (
                        <ChevronDown height={8} width={8} />
                    ) : (
                        <ChevronUp height={8} width={8} />
                    )}
                </View>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingRight: RFPercentage(1)
    },
    heading: {
        paddingVertical: 2
    },
    textSecondary: {
        color: GREY,
        marginTop: RFPercentage(0.4)
    },
    toprow: {
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    }
});
