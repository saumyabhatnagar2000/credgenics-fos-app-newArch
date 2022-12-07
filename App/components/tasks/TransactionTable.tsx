import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TransactionListType } from '../../../types';
import Typography, { TypographyVariants } from '../ui/Typography';
import { BLUE_DARK, GREY_4 } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';

export const TransactionTable = ({
    amount,
    transactionData,
    transactionFormData,
    setTransactionData,
    setTransactionFormData
}: {
    amount: number;
    transactionFormData: Object;
    setTransactionFormData: any;
    setTransactionData: any;
    transactionData: Array<TransactionListType> | undefined;
}) => {
    let tempAmt = amount;

    const { getCurrencyString } = useAuth();
    const TransactionRow = ({
        data,
        index
    }: {
        data: TransactionListType;
        index: number;
    }) => {
        let collectedAmt = 0;
        if (transactionData) {
            if (data?.defaults?.balance_claim_amount < tempAmt) {
                if (index == transactionData?.length - 1) {
                    collectedAmt = tempAmt;
                } else collectedAmt = data?.defaults?.balance_claim_amount;
                tempAmt -= data?.defaults?.balance_claim_amount;
            } else if (tempAmt > 0) {
                collectedAmt = tempAmt;
                tempAmt -= collectedAmt;
            }
        }

        return (
            <View style={styles.row}>
                <Typography
                    style={{
                        flex: 2
                    }}
                    variant={TypographyVariants.body3}
                >
                    {data?.transaction_id}
                </Typography>
                <View style={[styles.inputStyle, styles.textView]}>
                    <Typography
                        style={styles.textCont}
                        variant={TypographyVariants.body2}
                    >
                        {getCurrencyString(
                            data?.defaults?.balance_claim_amount
                        )}
                    </Typography>
                </View>
                <View style={[styles.inputStyle, styles.textView]}>
                    <Typography
                        style={styles.textCont}
                        variant={TypographyVariants.body2}
                    >
                        {getCurrencyString(collectedAmt)}
                    </Typography>
                </View>
            </View>
        );
    };
    useEffect(() => {
        setTransactionFormData({});
        let tempAmount = amount;
        if (transactionData) {
            for (let i = 0; i < transactionData?.length; i++) {
                let balance_claim_amount =
                    transactionData[i].defaults.balance_claim_amount;
                if (balance_claim_amount < tempAmount) {
                    if (i == transactionData?.length - 1) {
                        let temptemp = tempAmount;
                        setTransactionFormData((formData: any) => ({
                            ...formData,
                            [transactionData[i].transaction_id]: temptemp
                        }));
                    } else {
                        setTransactionFormData((formData: any) => ({
                            ...formData,
                            [transactionData[i].transaction_id]:
                                balance_claim_amount
                        }));
                    }
                    tempAmount -= balance_claim_amount;
                } else if (tempAmount > 0) {
                    let temptemp = tempAmount;
                    setTransactionFormData((formData: any) => ({
                        ...formData,
                        [transactionData[i].transaction_id]: temptemp
                    }));
                    tempAmount = 0;
                }
            }
        }
    }, [amount, transactionData]);

    return (
        <View
            style={{
                paddingHorizontal: RFPercentage(2),
                marginVertical: RFPercentage(1)
            }}
        >
            <View style={styles.innerContainer}>
                <View style={[styles.row, { marginVertical: 4 }]}>
                    <Typography
                        style={{ flex: 2 }}
                        variant={TypographyVariants.caption3}
                    >
                        Transaction Id
                    </Typography>
                    <Typography
                        style={{ flex: 1.5, textAlign: 'center' }}
                        variant={TypographyVariants.caption3}
                    >
                        Due Amt.
                    </Typography>
                    <Typography
                        style={{ flex: 1.5, textAlign: 'center' }}
                        variant={TypographyVariants.caption3}
                    >
                        Collected Amt.
                    </Typography>
                </View>
                <View>
                    {transactionData?.map((item, index) => {
                        return <TransactionRow data={item} index={index} />;
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        justifyContent: 'space-around',
        marginHorizontal: 5
    },
    inputStyle: {
        backgroundColor: 'transparent',
        borderColor: BLUE_DARK,
        borderRadius: 6,
        borderStyle: 'solid',
        borderWidth: 1,
        color: BLUE_DARK,
        flex: 1.3,
        fontSize: RFPercentage(2),
        margin: 2,
        padding: 0,
        paddingVertical: RFPercentage(0.6),
        textAlign: 'center'
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    textCont: {
        alignSelf: 'center',
        color: GREY_4,
        marginVertical: 6
    },
    textView: {
        backgroundColor: '#fff',
        borderColor: '#043E90',
        borderWidth: 1,
        flex: 1.2,
        justifyContent: 'center',
        marginRight: 4
    }
});
