import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK } from '../../constants/Colors';
import useCommon from '../../hooks/useCommon';
import Typography, { TypographyVariants } from './Typography';

export const CustomRadioButton = ({
    buttons,
    checked,
    setChecked,
    label,
    isBordered,
    containerStyle,
    buttonStyle,
    textStyle = {},
    optionTextStyles = [],
    color = BLUE_DARK,
    optionColors = []
}: {
    buttons: Array<any>;
    checked: any;
    setChecked: Function;
    label?: string;
    isBordered?: boolean;
    containerStyle?: object;
    buttonStyle?: object;
    textStyle?: object;
    optionTextStyles?: object[];
    color?: string;
    optionColors?: string[];
}) => {
    const { isInternetAvailable } = useCommon();
    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Typography
                    variant={TypographyVariants.title1}
                    style={[
                        styles.textStyle,
                        { marginLeft: 0 },
                        isBordered && { paddingTop: RFPercentage(1) }
                    ]}
                >
                    {label}
                </Typography>
            )}
            {buttons.map((res: any, index: number) => {
                const optionTextStyle = optionTextStyles[index] ?? {};
                const optionColor = optionColors[index] ?? BLUE_DARK;

                return (
                    <>
                        <TouchableOpacity
                            disabled={!isInternetAvailable && res === 'Online'}
                            key={res}
                            style={[
                                styles.rbWrapper,
                                buttonStyle,
                                !isInternetAvailable &&
                                    res === 'Online' && {
                                        opacity: 0.3
                                    }
                            ]}
                            onPress={() => {
                                setChecked(res);
                            }}
                        >
                            <View
                                style={[
                                    styles.rbStyle,
                                    { borderColor: optionColor }
                                ]}
                            >
                                {checked === res && (
                                    <View
                                        style={[
                                            styles.selected,
                                            { backgroundColor: optionColor }
                                        ]}
                                    />
                                )}
                            </View>
                            <Typography
                                variant={TypographyVariants.body3}
                                style={[
                                    { marginLeft: RFPercentage(1) },
                                    isBordered && styles.borderedText,
                                    textStyle,
                                    optionTextStyle
                                ]}
                            >
                                {res === true
                                    ? 'Yes'
                                    : res === false
                                    ? 'No'
                                    : res}
                            </Typography>
                        </TouchableOpacity>
                    </>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    borderedText: {
        borderColor: BLUE_DARK,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: '100%'
    },
    rbStyle: {
        alignItems: 'center',
        borderColor: BLUE_DARK,
        borderRadius: 110,
        borderWidth: 2,
        height: RFPercentage(2),
        justifyContent: 'center',
        width: RFPercentage(2)
    },
    rbWrapper: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    selected: {
        backgroundColor: BLUE_DARK,
        borderRadius: 55,
        height: RFPercentage(1),
        width: RFPercentage(1)
    },
    textStyle: {
        flex: 0.7,
        marginLeft: 8
    }
});
