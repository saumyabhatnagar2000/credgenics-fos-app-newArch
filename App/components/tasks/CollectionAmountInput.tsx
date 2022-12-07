import React, { createRef } from 'react';
import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import IconInputBox from '../../components/common/IconInputBox';
import Typography, {
    TypographyFontFamily
} from '../../components/ui/Typography';
import { DARK_GREY, TRANSPARENT_GREY } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';

type CollectionAmountInputType = {
    amount: string;
    loading: boolean;
    disabled: boolean;
    setAmount: React.Dispatch<React.SetStateAction<string>>;
};

const CollectionAmountInput = ({
    amount,
    loading,
    disabled,
    setAmount
}: CollectionAmountInputType) => {
    const { currencySymbol } = useAuth();

    const icon = (
        <Typography style={styles.iconContainer}>{currencySymbol}</Typography>
    );

    return (
        <IconInputBox
            value={parseInt(amount) > 0 ? amount : ''}
            placeholder="0"
            icon={{
                component: () => icon,
                iconName: 'rupee-sign',
                iconColor: DARK_GREY,
                iconType: 'font-awesome-5'
            }}
            inputContainerStyle={{
                backgroundColor: disabled ? TRANSPARENT_GREY : 'transparent'
            }}
            style={styles.inputStyle}
            setText={setAmount}
            compRef={createRef()}
            loading={loading}
            disabled={loading || disabled}
            keyboardType="number-pad"
            iconSize={2}
        />
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        fontSize: RFPercentage(2.4)
    },
    inputStyle: {
        color: DARK_GREY,
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(2.2)
    }
});
export default CollectionAmountInput;
