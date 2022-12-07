import React from 'react';
import { StyleSheet, View } from 'react-native';
import { keyConverter } from '../../../services/utils';
import DashedLine from 'react-native-dashed-line';
import { DepositFormRowDetailsType } from '../../../../types';
import Typography, { TypographyVariants } from '../../ui/Typography';
import Colors, {
    CAPSULE_BLUE_PRIMARY,
    CAPSULE_BLUE_SECONDARY
} from '../../../constants/Colors';
import { RFPercentage } from 'react-native-responsive-fontsize';
import StatusCapsule from '../StatusCapsule';
import CurrencyTypography from '../../ui/CurrencyTypography';
export const DepositFormRow = ({
    dataDict,
    statusDisabled = false
}: {
    dataDict: DepositFormRowDetailsType;
    statusDisabled: boolean;
}) => {
    const loan_details = dataDict;
    return (
        <View>
            <View style={styles.row}>
                <View>
                    {loan_details.length == 0 ? null : (
                        <DashedLine
                            style={{ marginVertical: RFPercentage(1) }}
                            dashThickness={1.5}
                            dashGap={3}
                            dashColor={Colors.common.blue}
                        />
                    )}
                    <View style={styles.row}>
                        <Typography variant={TypographyVariants.title1}>
                            {`Loan ID : `}
                        </Typography>
                        <Typography variant={TypographyVariants.body1}>
                            {loan_details.loan_id}
                        </Typography>
                    </View>
                </View>
                <CurrencyTypography
                    amount={loan_details.deposit_amount}
                    variant={TypographyVariants.body1}
                />
            </View>
            <View style={styles.row}>
                <Typography variant={TypographyVariants.title1}>
                    {keyConverter('status')}
                </Typography>
                <StatusCapsule
                    primaryColor={
                        statusDisabled
                            ? Colors.common.light0
                            : CAPSULE_BLUE_PRIMARY
                    }
                    secondaryColor={
                        statusDisabled
                            ? Colors.common.dark3
                            : CAPSULE_BLUE_SECONDARY
                    }
                    title={loan_details.agent_marked_status ?? '-'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 2
    }
});
