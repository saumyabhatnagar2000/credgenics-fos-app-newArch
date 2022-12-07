import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK } from '../../constants/Colors';
import Typography, { TypographyVariants } from '../ui/Typography';

export const SummaryCard = ({
    number,
    value,
    notCapitalize
}: {
    number: any;
    value: string;
    notCapitalize?: boolean;
}) => {
    return (
        <View style={styles.wrapper}>
            <Typography
                style={styles.valueText}
                variant={TypographyVariants.title1}
            >
                {number}
            </Typography>
            <Typography
                style={[
                    styles.valueText,
                    notCapitalize && { textTransform: 'none' }
                ]}
                variant={TypographyVariants.caption}
            >
                {value}
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    valueText: {
        marginVertical: RFPercentage(1),
        textAlign: 'center',
        textTransform: 'capitalize'
    },
    wrapper: {
        backgroundColor: '#fff',
        borderColor: BLUE_DARK,
        borderRadius: 8,
        borderWidth: 0.5,
        marginVertical: RFPercentage(1),
        padding: RFPercentage(1),
        width: '45%'
    }
});
