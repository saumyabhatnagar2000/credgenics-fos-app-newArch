import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { RED } from '../../constants/Colors';
import Typography, { TypographyVariants } from '../ui/Typography';

const CustomBottomSheetTextInput = ({
    containerStyle,
    placeholder,
    onChangeText,
    defaultValue,
    keyboardType,
    showError,
    errorMsg
}: any) => {
    return (
        <>
            <BottomSheetTextInput
                style={containerStyle}
                placeholder={placeholder}
                onChangeText={onChangeText}
                defaultValue={defaultValue}
                underlineColorAndroid="transparent"
                keyboardType={keyboardType}
            />
            {showError && (
                <Typography
                    variant={TypographyVariants.caption3}
                    style={styles.dateError}
                >
                    {errorMsg}
                </Typography>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    dateError: {
        color: RED,
        marginBottom: RFPercentage(1),
        marginTop: RFPercentage(0.5),
        marginLeft: RFPercentage(1.5)
    }
});

export default CustomBottomSheetTextInput;
