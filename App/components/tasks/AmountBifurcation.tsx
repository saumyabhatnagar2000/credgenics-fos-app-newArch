import { parseInt } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Switch } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK, GREY_4, TRANSPARENT_GREY } from '../../constants/Colors';
import { getRecoveredKey } from '../../constants/Keys';
import { keyConverter } from '../../services/utils';
import Typography, { TypographyVariants } from '../ui/Typography';

type AmountBifurcationType = {
    recoveryVariables: any;
    recVarsFormData: any;
    setRecVarsFormData: React.Dispatch<React.SetStateAction<any>>;
    setAmount: React.Dispatch<React.SetStateAction<string>>;
    isAutomaticEnabled: boolean;
    setIsAutomaticEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    amount: string;
};

const AmountBifurcation = ({
    recoveryVariables,
    setAmount,
    recVarsFormData,
    setRecVarsFormData,
    isAutomaticEnabled,
    setIsAutomaticEnabled,
    amount
}: AmountBifurcationType) => {
    const onChangeText = (key: string, amountStr: string, limit: string) => {
        // if (parseInt(amountStr) > parseInt(String(limit))) {
        //     ToastAndroid.show(
        //         'Recovered amount cannot exceed due amount',
        //         ToastAndroid.SHORT
        //     );
        //     return;
        // }
        const updatedObj = {
            ...recVarsFormData,
            [key]: amountStr.length > 0 ? parseFloat(amountStr) : 0
        };
        let total = 0;
        Object.values(updatedObj).forEach(
            (data: any) => (total += parseFloat(data))
        );
        setAmount(String(total));
        setRecVarsFormData(updatedObj);
    };

    useEffect(() => {
        setAmount('0');
        setRecVarsFormData({});
    }, [isAutomaticEnabled]);

    const totalAmount = useMemo(() => {
        let total = 0;
        Object.values(recoveryVariables).forEach((_amt: any) => {
            total += parseInt(_amt);
        });
        return total;
    }, [recoveryVariables]);

    useEffect(() => {
        if (isAutomaticEnabled) {
            // if (parseInt(amount) > totalAmount) {
            //     ToastAndroid.show(
            //         'Recovered amount cannot exceed due amount',
            //         ToastAndroid.SHORT
            //     );
            //     return;
            // }
            setRecVarsFormData({});
            let tempAmount = parseInt(amount);
            if (recoveryVariables) {
                for (
                    let i = 0;
                    i < Object.keys(recoveryVariables).length - 1;
                    i++
                ) {
                    let tempRecValue = parseInt(
                        String(Object.values(recoveryVariables)[i])
                    );
                    let tempRecKey = String(Object.keys(recoveryVariables)[i]);
                    if (tempRecValue < tempAmount) {
                        setRecVarsFormData((formData: any) => ({
                            ...formData,
                            [getRecoveredKey(tempRecKey)]: tempRecValue
                        }));
                        tempAmount -= tempRecValue;
                    } else if (tempAmount > 0) {
                        let temptemp = tempAmount;
                        setRecVarsFormData((formData: any) => ({
                            ...formData,
                            [getRecoveredKey(tempRecKey)]: temptemp
                        }));
                        tempAmount = 0;
                    }
                }
                let tempRecKeyLast = String(
                    Object.keys(recoveryVariables).pop()
                );
                setRecVarsFormData((formData: any) => ({
                    ...formData,
                    [getRecoveredKey(tempRecKeyLast)]: tempAmount || 0
                }));
            }
        }
    }, [amount]);

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={[styles.row, { marginVertical: 4 }]}>
                    <View style={styles.typeContainer}>
                        <Typography variant={TypographyVariants.caption3}>
                            Automatic
                        </Typography>
                        <Switch
                            style={styles.switchStyle}
                            value={isAutomaticEnabled}
                            onValueChange={setIsAutomaticEnabled}
                        />
                    </View>
                    <Typography
                        style={{ flex: 1 }}
                        variant={TypographyVariants.caption3}
                    >
                        Due Amount
                    </Typography>
                    <Typography
                        style={{ flex: 1.3 }}
                        variant={TypographyVariants.caption3}
                    >
                        Collected Amount
                    </Typography>
                </View>
                {Object.keys(recoveryVariables).map((recV) => (
                    <View style={styles.row} key={recV}>
                        <Typography
                            style={{ flex: 1.5 }}
                            variant={TypographyVariants.title1}
                        >
                            {keyConverter(recV)}
                        </Typography>
                        <View style={[styles.inputStyle, styles.textView]}>
                            <Typography
                                style={styles.textCont}
                                variant={TypographyVariants.body3}
                            >
                                {recoveryVariables[recV]}
                            </Typography>
                        </View>
                        <TextInput
                            placeholder={
                                isAutomaticEnabled
                                    ? String(
                                          recVarsFormData[
                                              getRecoveredKey(recV)
                                          ] ?? 0
                                      )
                                    : '0'
                            }
                            editable={!isAutomaticEnabled}
                            style={styles.inputStyle}
                            keyboardType="number-pad"
                            value={
                                recVarsFormData[getRecoveredKey(recV)] > 0
                                    ? recVarsFormData[getRecoveredKey(recV)]
                                    : ''
                            }
                            onChangeText={(text) => {
                                if (isAutomaticEnabled) return;
                                return onChangeText(
                                    getRecoveredKey(recV),
                                    text,
                                    recoveryVariables[recV]
                                );
                            }}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: RFPercentage(3)
    },
    innerContainer: {
        justifyContent: 'space-around',
        marginHorizontal: 5
    },
    inputStyle: {
        backgroundColor: 'transparent',
        borderColor: BLUE_DARK,
        borderRadius: 6,
        borderStyle: 'solid',
        borderWidth: 1,
        color: BLUE_DARK,
        flex: 1.3,
        fontSize: RFPercentage(2),
        margin: 2,
        padding: 0,
        paddingVertical: RFPercentage(0.6),
        textAlign: 'center'
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    textCont: {
        alignSelf: 'center',
        color: GREY_4,
        marginVertical: 6
    },
    textView: {
        backgroundColor: TRANSPARENT_GREY,
        borderWidth: 0,
        flex: 1,
        justifyContent: 'center',
        marginRight: 4
    },
    switchStyle: {
        transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }]
    },
    typeContainer: {
        flexDirection: 'row',
        flex: 1.5,
        alignItems: 'center'
    }
});

export default AmountBifurcation;
