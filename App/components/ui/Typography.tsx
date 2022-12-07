import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK } from '../../constants/Colors';

export const TypographyVariants = {
    heading: 'heading',
    heading1: 'heading1',
    heading2: 'heading2',
    heading3: 'heading3',
    subHeading: 'subHeading',
    subHeading2: 'subHeading2',
    title: 'title',
    title1: 'title1',
    title2: 'title2',
    body: 'body',
    body1: 'body1',
    body2: 'body2',
    body3: 'body3',
    body4: 'body4',
    body5: 'body5',
    body6: 'body6',
    caption: 'caption',
    caption1: 'caption1',
    caption2: 'caption2',
    caption3: 'caption3',
    caption4: 'caption4',
    caption5: 'caption5'
};

export const TypographyFontFamily = {
    black: 'AvenirLTProBlack',
    blackOblique: 'AvenirLTProBlackOblique',
    heavy: 'AvenirLTProHeavy',
    heavyOblique: 'AvenirLTProHeavyOblique',
    medium: 'AvenirLTProMedium',
    mediumOblique: 'AvenirLTProMediumOblique',
    normal: 'AvenirLTProRoman',
    oblique: 'AvenirLTProOblique',
    book: 'AvenirLTProBook',
    bookOblique: 'AvenirLTProBookOblique',
    light: 'AvenirLTProLight',
    lightOblique: 'AvenirLTProLightOblique'
};

const Typography = (props: any) => {
    const {
        variant = TypographyVariants.subHeading,
        color,
        children,
        style,
        ...rest
    } = props;

    return (
        <Text
            style={[styles[variant], { color: color ?? BLUE_DARK }, style]}
            {...rest}
        >
            {children}
        </Text>
    );
};

export default Typography;

const styles = StyleSheet.create({
    [TypographyVariants.heading]: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(3.6)
    },
    [TypographyVariants.heading1]: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(4.2)
    },
    [TypographyVariants.heading2]: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(3)
    },
    [TypographyVariants.heading3]: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(2.4)
    },
    [TypographyVariants.subHeading]: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(3.2)
    },
    [TypographyVariants.subHeading2]: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2)
    },
    [TypographyVariants.title]: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2.6)
    },
    [TypographyVariants.title1]: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(2)
    },
    [TypographyVariants.title2]: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(2.1)
    },
    [TypographyVariants.body]: {
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(2.2)
    },
    [TypographyVariants.body1]: {
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(2)
    },
    [TypographyVariants.body2]: {
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.8)
    },
    [TypographyVariants.body3]: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(1.8)
    },
    [TypographyVariants.body4]: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(1.8)
    },
    [TypographyVariants.body5]: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2.2)
    },
    [TypographyVariants.body6]: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2.1)
    },
    [TypographyVariants.caption]: {
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.6)
    },
    [TypographyVariants.caption1]: {
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.5)
    },
    [TypographyVariants.caption2]: {
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.3)
    },
    [TypographyVariants.caption3]: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(1.6)
    },
    [TypographyVariants.caption4]: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(1.4)
    },
    [TypographyVariants.caption5]: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(1.6)
    }
});
