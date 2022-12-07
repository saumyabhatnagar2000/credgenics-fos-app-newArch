import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import Animated, {
    Extrapolate,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue
} from 'react-native-reanimated';
import { toRad } from 'react-native-redash';

// @ts-ignore
export const transformOrigin = ({ x, y }, ...transformations) => {
    'worklet';
    return [
        { translateX: x },
        { translateY: y },
        ...transformations,
        { translateX: x * -1 },
        { translateY: y * -1 }
    ];
};

interface HandleProps extends BottomSheetHandleProps {
    style?: StyleProp<ViewStyle>;
}

const PaymentSheetHandle: React.FC<HandleProps> = ({
    style,
    animatedIndex
}) => {
    //#region animations
    const indicatorTransformOriginY = useDerivedValue(() =>
        interpolate(
            animatedIndex.value,
            [0, 1, 2],
            [-1, 0, 1],
            Extrapolate.CLAMP
        )
    );
    //#endregion

    //#region styles
    const containerStyle = useMemo(() => [styles.header, style], [style]);

    const leftIndicatorStyle = useMemo(
        () => ({
            ...styles.indicator,
            ...styles.leftIndicator
        }),
        []
    );

    const leftIndicatorAnimatedStyle = useAnimatedStyle(() => {
        const leftIndicatorRotate = interpolate(
            animatedIndex.value,
            [0, 1, 2],
            [toRad(-30), 0, toRad(30)],
            Extrapolate.CLAMP
        );

        const backgroundColor = interpolateColor(
            animatedIndex.value,
            [0, 1],
            ['#fff', '#043E90cc']
        );

        return {
            transform: transformOrigin(
                { x: 0, y: indicatorTransformOriginY.value },
                {
                    rotate: `${leftIndicatorRotate}rad`
                },
                {
                    translateX: -5
                }
            ),
            backgroundColor
        };
    });

    const rightIndicatorStyle = useMemo(
        () => ({
            ...styles.indicator,
            ...styles.rightIndicator
        }),
        []
    );

    const rightIndicatorAnimatedStyle = useAnimatedStyle(() => {
        const rightIndicatorRotate = interpolate(
            animatedIndex.value,
            [0, 1, 2],
            [toRad(30), 0, toRad(-30)],
            Extrapolate.CLAMP
        );
        const backgroundColor = interpolateColor(
            animatedIndex.value,
            [0, 1],
            ['#fff', '#043E90cc']
        );
        return {
            transform: transformOrigin(
                { x: 0, y: indicatorTransformOriginY.value },
                {
                    rotate: `${rightIndicatorRotate}rad`
                },
                {
                    translateX: 5
                }
            ),
            backgroundColor
        };
    });
    //#endregion

    // render
    return (
        <Animated.View
            style={[containerStyle]}
            renderToHardwareTextureAndroid={true}
        >
            <Animated.View
                style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]}
            />
            <Animated.View
                style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]}
            />
        </Animated.View>
    );
};

export default PaymentSheetHandle;

const styles = StyleSheet.create({
    header: {
        alignContent: 'center',
        alignItems: 'center',
        borderBottomColor: 'transparent',
        borderBottomWidth: 1,
        justifyContent: 'center',
        paddingVertical: 14
    },
    indicator: {
        backgroundColor: '#999',
        height: 4,
        position: 'absolute',
        width: 10
    },
    leftIndicator: {
        borderBottomStartRadius: 2,
        borderTopStartRadius: 2
    },
    rightIndicator: {
        borderBottomEndRadius: 2,
        borderTopEndRadius: 2
    }
});
