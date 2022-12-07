import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK } from '../../constants/Colors';
import Typography, { TypographyVariants } from './Typography';

const CustomButton = ({
    title,
    onPress,
    type,
    disabled,
    style,
    variant,
    ...props
}: any) => (
    <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.5}
        onPress={onPress}
        style={[
            styles.container,
            type === 'transparent'
                ? { backgroundColor: '#fff' }
                : { backgroundColor: BLUE_DARK },
            disabled && {
                backgroundColor: '#8899a880',
                borderColor: '#8899a880'
            },
            style
        ]}
    >
        <Typography
            variant={variant ?? TypographyVariants.title1}
            style={type !== 'transparent' && { color: '#fff' }}
        >
            {title}
        </Typography>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderColor: BLUE_DARK,
        borderRadius: 4,
        borderWidth: 1,
        height: RFPercentage(4.6),
        justifyContent: 'center',
        marginVertical: RFPercentage(1),
        width: RFPercentage(14)
    }
});

export default CustomButton;
