import React from 'react';
import { StyleSheet, View } from 'react-native';
import { keyConverter } from '../../../services/utils';
import Colors, { DARK_GREY } from '../../../constants/Colors';
import Typography, { TypographyVariants } from '../../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useAuth } from '../../../hooks/useAuth';

const maskableKeys: Array<String> = [
    'applicant_contact_number',
    'co_applicant_contact_number'
];

const StringifiedJSONKeys: Array<String> = ['amount_recovered_breakdown'];

const AmountKeys = [
    'amount_recovered',
    'late_fee',
    'balance_claim_amount',
    'client_recovered_amount',
    'emi_amount',
    'overdue_emi',
    'principal_outstanding_amount',
    'recovered_amount',
    'settlement_amount',
    'total_loan_amount',
    'total_claim_amount',
    'expected_emi_principal_amount',
    'expected_emi_interest_amount',
    'other_penalty',
    'applicant_monthly_income'
];

function Row({
    data,
    itemKey: key,
    index,
    color
}: {
    data: string;
    itemKey: string;
    index: number;
    color?: boolean;
}) {
    const { getCurrencyString } = useAuth();

    const getValue = (key, data) => {
        if (maskableKeys.includes(key.toLowerCase())) {
            return data;
        }

        if (AmountKeys.includes(key)) {
            return getCurrencyString(data);
        }

        return data ?? '......';
    };

    return (
        <View
            key={key}
            style={[
                styles.row,
                {
                    backgroundColor:
                        index % 2 == 0 ? Colors.table.grey : Colors.table.white
                }
            ]}
        >
            <Typography variant={TypographyVariants.body3} style={[styles.key]}>
                {keyConverter(key)}
            </Typography>
            <Typography
                variant={TypographyVariants.body3}
                style={[styles.key, { flex: 0.3 }]}
            >
                :
            </Typography>
            <Typography
                variant={TypographyVariants.body2}
                style={[styles.value]}
            >
                {getValue(key, data)}
            </Typography>
        </View>
    );
}

export const TableRow = ({
    dataDict,
    color
}: {
    dataDict: any;
    color?: boolean;
}) => {
    if (Object.keys(dataDict).length == 0) return null;

    return (
        <View style={styles.table}>
            {Object.keys(dataDict).map((key, index) => {
                try {
                    if (StringifiedJSONKeys.includes(key)) {
                        const newData = JSON.parse(dataDict[key]);
                        return Object.keys(newData).map((key2, index2) => {
                            return (
                                <Row
                                    key={key2}
                                    itemKey={key2}
                                    data={newData[key2]}
                                    index={index2}
                                    color={color}
                                />
                            );
                        });
                    }
                } catch (e) {
                    //
                }

                return (
                    <Row
                        key={key}
                        itemKey={key}
                        data={dataDict[key]}
                        index={index}
                        color={color}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    key: {
        color: DARK_GREY,
        flex: 2.9,
        textTransform: 'capitalize'
    },
    row: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: RFPercentage(2.4),
        paddingVertical: RFPercentage(1.2)
    },
    table: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    value: {
        alignSelf: 'flex-start',
        color: DARK_GREY,
        flex: 2.7
    }
});
