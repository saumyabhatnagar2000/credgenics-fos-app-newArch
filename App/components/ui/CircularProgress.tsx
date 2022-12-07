import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useAuth } from '../../hooks/useAuth';
import { addCurrencyDenomination } from '../../services/utils';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from './Typography';

const propStyle = (percent: number, base_degrees: number) => {
    const rotateBy = base_degrees + percent * 3.6;
    return {
        transform: [{ rotateZ: `${rotateBy}deg` }]
    };
};

const renderThirdLayer = (percent: number) => {
    if (percent > 50) {
        /**
         * Third layer circle default is 45 degrees, so by default it occupies the right half semicircle.
         * Since first 50 percent is already taken care  by second layer circle, hence we subtract it
         * before passing to the propStyle function
         **/
        return (
            <View
                style={[
                    styles.secondProgressLayer,
                    propStyle(percent - 50, 45)
                ]}
            />
        );
    } else {
        return <View style={styles.offsetLayer} />;
    }
};

export const CircularProgress = ({
    percent,
    value,
    label
}: {
    percent: number;
    value: number;
    label: string;
}) => {
    let firstProgressLayerStyle;
    if (percent > 50) {
        firstProgressLayerStyle = propStyle(50, -135);
    } else {
        firstProgressLayerStyle = propStyle(percent, -135);
    }
    const { getCurrencyString, currencySymbol } = useAuth();
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.container}>
                <View
                    style={[styles.firstProgressLayer, firstProgressLayerStyle]}
                />
                {renderThirdLayer(percent)}
                <Typography
                    style={{ fontSize: RFPercentage(1.4), textAlign: 'center' }}
                    variant={TypographyVariants.caption2}
                >
                    {value === undefined || value === null
                        ? 'NA'
                        : `${currencySymbol} ` +
                          addCurrencyDenomination(value, currencySymbol)}
                </Typography>
            </View>
            <Typography
                variant={TypographyVariants.body3}
                style={{ paddingTop: 5 }}
            >
                {label}
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderColor: '#fff',
        borderRadius: 34,
        borderWidth: 5,
        height: 68,
        justifyContent: 'center',
        width: 68
    },
    display: {
        fontFamily: TypographyFontFamily.heavy,
        position: 'absolute'
    },
    firstProgressLayer: {
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRadius: 34,
        borderRightColor: '#233F78',
        borderTopColor: '#233F78',
        borderWidth: 5,
        height: 68,
        position: 'absolute',
        transform: [{ rotateZ: '-135deg' }],
        width: 68
    },
    offsetLayer: {
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRadius: 34,
        borderRightColor: '#fff',
        borderTopColor: '#fff',
        borderWidth: 5,
        height: 68,
        position: 'absolute',
        transform: [{ rotateZ: '-135deg' }],
        width: 68
    },
    secondProgressLayer: {
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRadius: 34,
        borderRightColor: '#233F78',
        borderTopColor: '#233F78',
        borderWidth: 5,
        height: 68,
        position: 'absolute',
        transform: [{ rotateZ: '45deg' }],
        width: 68
    }
});
