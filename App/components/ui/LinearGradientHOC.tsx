import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { LINEAR_GRADIENT } from '../../constants/Colors';

export const LinearGradientHOC = (props: any) => {
    const { colors, children, ...rest } = props;
    return (
        <LinearGradient
            colors={colors ?? LINEAR_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            {...rest}
        >
            {children}
        </LinearGradient>
    );
};
