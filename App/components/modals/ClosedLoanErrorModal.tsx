import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ModalButtonType } from '../../../types';
import { BLUE_DARK } from '../../constants/Colors';
import { LOAN_IS_CLOSED } from '../../constants/constants';
import { StringCompare } from '../../services/utils';
import _ from 'lodash';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { CustomModal } from './ReusableModal';

const ClosedLoanErrorModal = ({
    visible,
    navigation
}: {
    visible: boolean;
    navigation: any;
}) => {
    const ClosedLoanHeaderComponent = () => (
        <View>
            <Typography
                style={[
                    styles.modalHeaderText,
                    {
                        marginBottom: RFPercentage(1)
                    }
                ]}
                variant={TypographyVariants.heading3}
            >
                {'Error'}
            </Typography>
            <Typography
                style={[styles.headerText, { lineHeight: RFPercentage(3) }]}
            >
                {LOAN_IS_CLOSED}
            </Typography>
        </View>
    );

    const onCloseButtonPressed = useCallback(
        _.throttle(
            () => {
                navigation.goBack();
            },
            2000,
            { leading: true, trailing: false }
        ),
        [navigation]
    );

    const ClosedLoanModalData: Array<ModalButtonType> = [
        {
            buttonText: 'Close',
            buttonTextStyle: styles.buttonTwoText,
            buttonStyle: styles.buttonTwoContainer,
            buttonFunction: onCloseButtonPressed
        }
    ];

    return (
        <CustomModal
            visible={visible}
            dismissable={false}
            HeaderComponent={ClosedLoanHeaderComponent}
            data={ClosedLoanModalData}
        />
    );
};

const styles = StyleSheet.create({
    modalHeaderText: {
        lineHeight: RFPercentage(3.5),
        textAlign: 'center'
    },
    headerText: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2.1),
        lineHeight: RFPercentage(3.5),
        textAlign: 'center'
    },
    buttonTwoContainer: {
        backgroundColor: BLUE_DARK,
        marginLeft: RFPercentage(0.5),
        minHeight: RFPercentage(4.2),
        minWidth: RFPercentage(13.5)
    },
    buttonTwoText: {
        color: '#fff',
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(2)
    }
});

export default ClosedLoanErrorModal;
