import React, { useCallback, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, ToastAndroid, View } from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetTextInput,
    BottomSheetView
} from '@gorhom/bottom-sheet';
import { BottomSheetHandle } from './Icons/BottomSheetHandle';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { useAuth } from '../../hooks/useAuth';
import { calculateLateFees } from '../../services/portfolioService';
import Colors from '../../constants/Colors';
import { debounce } from 'lodash';
import { SOMETHING_WENT_WRONG } from '../../constants/constants';
import useLoanDetails from '../../hooks/useLoanData';

export const LateFeesBottomSheet = React.forwardRef((props: any, ref) => {
    const snapPoints = useMemo(() => ['25%'], []);
    const { loan_id } = props;
    const renderBackdrop = useCallback((props) => {
        return <BottomSheetBackdrop disappearsOnIndex={-1} {...props} />;
    }, []);
    const { selectedLoanData } = useLoanDetails();
    const allocation_month = selectedLoanData.allocation_month;
    const { authData } = useAuth();
    const [lateDays, setLateDays] = useState('');
    const [lateFees, setLateFees] = useState(0);
    const { currencySymbol } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSheetChanges = (index: number) => {
        if (index === -1) {
            Keyboard.dismiss();
        } else if (index == 0) {
            setLateDays('');
        }
    };

    const callLateFeesApi = async (days: string) => {
        setLoading(true);
        try {
            const apiResponse = await calculateLateFees(
                loan_id,
                days,
                allocation_month,
                authData
            );
            if (apiResponse?.data) {
                setLateFees(apiResponse?.data?.output?.late_fee);
            }
        } catch (e) {
            ToastAndroid.show(
                e?.response?.data?.output ?? SOMETHING_WENT_WRONG,
                ToastAndroid.SHORT
            );
        }
        setLoading(false);
    };
    const debouncedSearch = useCallback(
        debounce((days: string) => {
            callLateFeesApi(days);
        }, 800),
        []
    );
    const updateValue = (newValue: string) => {
        debouncedSearch(newValue);
        setLateDays(newValue.replace('.', ''));
    };

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            enableHandlePanningGesture={false}
            snapPoints={snapPoints}
            handleComponent={() => {
                return (
                    <View style={styles.handleComponent}>
                        <BottomSheetHandle />
                    </View>
                );
            }}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
        >
            <BottomSheetView style={{ paddingHorizontal: RFPercentage(2) }}>
                <View>
                    <Typography
                        style={{
                            marginBottom: RFPercentage(1)
                        }}
                        variant={TypographyVariants.body3}
                    >
                        Late Fees
                    </Typography>
                    <BottomSheetTextInput
                        style={[styles.numberInputContainer]}
                        placeholder={`No. of Days`}
                        placeholderTextColor={'#043E90'}
                        value={lateDays}
                        onChangeText={updateValue}
                        keyboardType={'numeric'}
                    />
                    <View style={styles.amountContainer}>
                        <Typography
                            style={{ paddingHorizontal: RFPercentage(2) }}
                            variant={TypographyVariants.heading3}
                        >
                            {!loading && lateDays.length
                                ? `${currencySymbol} ${lateFees}`
                                : `${currencySymbol}0`}
                        </Typography>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    amountContainer: {
        backgroundColor: ' rgba(144, 145, 149, 0.1)',
        borderRadius: 8,
        paddingHorizontal: RFPercentage(0.5),
        paddingVertical: RFPercentage(1.75)
    },
    handleComponent: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: RFPercentage(2)
    },
    inputContainer: {
        backgroundColor: Colors.table.grey,
        borderColor: Colors.common.blue,
        borderRadius: 8,
        borderWidth: 1,
        height: 45,
        margin: 0,
        paddingHorizontal: RFPercentage(1)
    },
    loadingContainer: {
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center'
    },
    numberInputContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        fontFamily: TypographyFontFamily.normal,
        height: RFPercentage(5.2),
        marginVertical: RFPercentage(1),
        paddingHorizontal: RFPercentage(1),
        borderColor: '#043E90',
        borderWidth: 1
    }
});
