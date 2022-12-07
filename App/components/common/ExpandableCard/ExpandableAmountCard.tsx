import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TransactionDetailsType } from '../../../../types';
import { BLUE_DARK, GREY_TEXT, GREY_VALUE } from '../../../constants/Colors';
import { useAuth } from '../../../hooks/useAuth';
import { getTransactionDetailsFromVisit } from '../../../services/depositService';
import CurrencyTypography from '../../ui/CurrencyTypography';
import Typography, { TypographyVariants } from '../../ui/Typography';
import { ChevronDown } from '../Icons/ChevronDown';
import { ChevronUp } from '../Icons/ChevronUp';
import { Loading } from '../Loading';
export default function ExpandableAmountCard(config: any) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { authData } = useAuth();
    const [transactionDataMap, setTransactionDataMap] = useState(null);
    const [loading, setLoading] = useState(false);

    const getTransactionData = async () => {
        if (isExpanded || transactionDataMap != null) {
            toggleExpand();
            return;
        }

        if (transactionDataMap == null) {
            try {
                setLoading(true);
                const apiResponse = await getTransactionDetailsFromVisit(
                    config?.dataList?.id,
                    authData
                );
                if (apiResponse) {
                    setTransactionDataMap(apiResponse?.data);
                    toggleExpand();
                }
            } catch (e) {
            } finally {
                setLoading(false);
            }
        }
    };

    const toggleExpand = () => {
        if (Platform.OS == 'android') {
            LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
            );
            setIsExpanded(!isExpanded);
        }
    };

    const convertData = () => {
        return (
            <View style={styles.expandableView}>
                {transactionDataMap && transactionDataMap?.length > 0 ? (
                    <View style={styles.rowContainer}>
                        <View style={styles.columnContainer}>
                            <View style={styles.column}>
                                <Typography
                                    color={GREY_TEXT}
                                    style={styles.loanDetailsHeading}
                                    variant={TypographyVariants.caption3}
                                >
                                    Transaction IDs
                                </Typography>
                                {transactionDataMap?.map(
                                    (details: TransactionDetailsType) => (
                                        <Typography
                                            color={GREY_TEXT}
                                            variant={
                                                TypographyVariants.caption3
                                            }
                                            style={styles.loanDetailsHeading}
                                        >
                                            {details?.transaction_id}
                                        </Typography>
                                    )
                                )}
                            </View>
                        </View>
                        <View style={styles.columnContainer}>
                            <View style={styles.column}>
                                <Typography
                                    color={GREY_TEXT}
                                    style={styles.amountHeading}
                                    variant={TypographyVariants.caption3}
                                >
                                    Amount
                                </Typography>
                                {transactionDataMap?.map(
                                    (details: TransactionDetailsType) => (
                                        <CurrencyTypography
                                            color={GREY_VALUE}
                                            variant={
                                                TypographyVariants.caption3
                                            }
                                            amount={details?.amount_recovered}
                                            style={styles.amountHeading}
                                        />
                                    )
                                )}
                            </View>
                        </View>
                    </View>
                ) : (
                    <Typography
                        color={GREY_VALUE}
                        variant={TypographyVariants.caption3}
                        style={styles.noRecordFound}
                    >
                        No records found
                    </Typography>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography
                    variant={TypographyVariants.body3}
                    style={[
                        styles.headerText,
                        { flex: 12, paddingHorizontal: '1%' }
                    ]}
                >
                    {config?.headerLabel}
                </Typography>
                <Typography
                    variant={TypographyVariants.body3}
                    style={[
                        styles.separatorColon,
                        { flex: 1, paddingHorizontal: RFPercentage(1) }
                    ]}
                >
                    {':'}
                </Typography>
                <View style={styles.rightView}>
                    <CurrencyTypography
                        amount={config?.headerValue}
                        variant={TypographyVariants.body4}
                    />

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={getTransactionData}
                        style={styles.chevron}
                    >
                        {isExpanded ? (
                            <ChevronUp color={BLUE_DARK} />
                        ) : (
                            <ChevronDown color={BLUE_DARK} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            {isExpanded && convertData()}
            {loading && (
                <View style={styles.loading}>
                    <Loading />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    amountHeading: {
        marginVertical: RFPercentage(0.4)
    },
    chevron: {
        padding: 3
    },
    column: {
        justifyContent: 'center'
    },
    columnContainer: {
        alignItems: 'center',
        flex: 1
    },
    container: {
        backgroundColor: '#F2F3F6',
        borderRadius: 3,
        elevation: 1,
        marginHorizontal: RFPercentage(1.1),
        marginTop: RFPercentage(1.1)
    },
    expandableView: {
        paddingVertical: RFPercentage(1)
    },
    header: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#0000000D',
        flexDirection: 'row',
        paddingHorizontal: RFPercentage(2),
        paddingVertical: RFPercentage(1.1)
    },
    headerText: {
        color: BLUE_DARK,
        flex: 1
    },
    loading: {
        padding: RFPercentage(1)
    },
    loanDetailsHeading: {
        marginVertical: RFPercentage(0.4),
        paddingLeft: RFPercentage(2)
    },
    noRecordFound: {
        textAlign: 'center'
    },
    rightView: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 10,
        justifyContent: 'space-between',
        paddingHorizontal: '1%'
    },
    rowContainer: {
        flexDirection: 'row'
    },
    separatorColon: {
        color: BLUE_DARK
    }
});
