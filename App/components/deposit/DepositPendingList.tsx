import React, { useCallback, useEffect, useState } from 'react';
import {
    useFocusEffect,
    useIsFocused,
    useNavigation
} from '@react-navigation/native';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import { DepositPendingRow } from './DepositPendingRow';
import {
    getTransactionDetailsFromVisit,
    loadPendingDepostList
} from '../../services/depositService';
import { PendingDepositType } from '../../../types';
import { useAuth } from '../../hooks/useAuth';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import { CompanyType, DepositTypes, FilterDepositTypes } from '../../../enums';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, { TypographyVariants } from '../ui/Typography';
import { BLUE_1, BLUE_DARK, BLUE_LIGHT } from '../../constants/Colors';
import CurrencyTypography from '../ui/CurrencyTypography';
import DepositSortAndFilter from './DepositSortAndFilter';
import { useAction } from '../../hooks/useAction';
import { DepositPendingCreditRow } from './DepositPendingCreditRow';
import { StringCompare } from '../../services/utils';
import { useMixpanel } from '../../contexts/MixpanelContext';
import { EventScreens, Events } from '../../constants/Events';

const isOnlineText = 'Online collections do not require Deposition process';

export default function DepositPendingList() {
    const { authData, collectionModes, companyType, setDepositBranch } =
        useAuth();
    const [selections, setSelections] = useState(new Set<PendingDepositType>());
    const [totalDepositAmount, setTotalDepositAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<Array<PendingDepositType>>([]);
    const navigation = useNavigation();
    const [depositType, setDepositType] = useState(collectionModes[2]);
    const { depositFilterType, setDepositFilterType } = useAction();

    const { logEvent } = useMixpanel();
    const isFocused = useIsFocused();

    const isOnline = depositType == DepositTypes.online;
    const isDisabled = totalDepositAmount == 0 || isOnline;

    const [filterItems, setFilterItems] = useState<Array<PendingDepositType>>(
        []
    );

    function onCheckBoxChecked(item: PendingDepositType, index: number) {
        const amount = parseInt(item.amount_recovered);
        item.checked = !item?.checked;
        setItems([...items]);
        if (depositType !== DepositTypes.cheque) {
            if (!item?.checked) {
                selections?.delete(item);
                setSelections(selections);
                setTotalDepositAmount(totalDepositAmount - amount);
            } else {
                selections?.add(item);
                setSelections(selections);
                setTotalDepositAmount(totalDepositAmount + amount);
            }
            return;
        }
        items.forEach((_item) => (_item.checked = false));
        item.checked = true;
        selections.clear();
        selections.add(item);
        setSelections(selections);
        setItems([...items]);
        setTotalDepositAmount(amount);
    }

    const resetData = () => {
        setTotalDepositAmount(0);
        selections.forEach((item) => {
            item.checked = false;
        });
        selections.clear();
    };

    const onRecoveryMethodSelected = (method: DepositTypes) => {
        setDepositType(method);
        resetData();
    };

    useFocusEffect(
        useCallback(() => {
            refreshData(FilterDepositTypes.overall);
            setDepositFilterType(FilterDepositTypes.overall);
        }, [])
    );

    const refreshData = async (filter = depositFilterType) => {
        resetData();
        setLoading(true);
        const apiResponse = await loadPendingDepostList(filter, authData);
        setItems(apiResponse?.data ?? []);
        setLoading(false);
    };

    useEffect(() => {
        if (isFocused) {
            refreshData();
        }
    }, [depositFilterType, isFocused]);

    useEffect(() => {
        if (items) {
            const data = items?.filter((item) =>
                StringCompare(item?.payment_method, depositType)
            );
            setFilterItems(data);
        }
    }, [items, depositType]);

    const keyExtractor = (item: PendingDepositType, index: number) =>
        index.toString();

    const BtnGroup = collectionModes.map((mode: DepositTypes) => {
        const isSelected = mode == depositType;
        return (
            <TouchableOpacity
                key={mode}
                style={[
                    styles.buttonText,
                    isSelected && { backgroundColor: BLUE_LIGHT }
                ]}
                onPress={() => {
                    logEvent(Events.filter, EventScreens.collection_list, {
                        type: mode
                    });
                    onRecoveryMethodSelected(mode);
                }}
            >
                <Typography
                    variant={TypographyVariants.caption}
                    style={[isSelected && { color: 'white' }]}
                >
                    {mode}
                </Typography>
            </TouchableOpacity>
        );
    });

    const makeDeposit = async () => {
        const dataArray = [...selections];
        if (dataArray.length !== 0) {
            resetData();
            navigation.navigate('DepositSubmitScreen', {
                loan_ids: dataArray,
                amount: totalDepositAmount,
                recovery_method: depositType
            });
            setDepositBranch(undefined);
        } else {
            ToastAndroid.show('Select loans!', ToastAndroid.SHORT);
        }
    };

    const [transactionDataMap, setTransactionDataMap] = useState({});
    const getTransactionData = async (rowData: any) => {
        try {
            const apiResponse = await getTransactionDetailsFromVisit(
                rowData.visit_id,
                authData
            );
            setTransactionDataMap((data) => ({
                ...data,
                [rowData.visit_id]: apiResponse?.data
            }));
        } catch (e) {}
    };

    const submitButton = (
        <TouchableOpacity
            disabled={isDisabled}
            style={[
                styles.depositButton,
                {
                    backgroundColor: isDisabled ? '#E3E6E8' : BLUE_DARK
                }
            ]}
            onPress={makeDeposit}
        >
            <Typography
                variant={TypographyVariants.title1}
                style={{
                    color: !isDisabled ? '#fff' : '#9FA6AD'
                }}
            >
                {` Make Deposit: `}
            </Typography>
            <CurrencyTypography
                amount={totalDepositAmount}
                variant={TypographyVariants.title1}
                style={{
                    color: !isDisabled ? '#fff' : '#9FA6AD'
                }}
            />
        </TouchableOpacity>
    );

    return (
        <>
            <View style={styles.headerWrapper}>
                <View style={styles.headerContainer}>{BtnGroup}</View>
                <DepositSortAndFilter />
            </View>
            <View style={styles.listWrapper}>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={filterItems}
                    extraData={filterItems}
                    ListEmptyComponent={
                        !loading ? (
                            <ErrorPlaceholder
                                type="empty"
                                message="No Pending Collections Found!"
                            />
                        ) : null
                    }
                    refreshControl={
                        <RefreshControl
                            enabled
                            progressViewOffset={10}
                            refreshing={loading}
                            onRefresh={() => refreshData()}
                        />
                    }
                    contentContainerStyle={{
                        flexGrow: 1,
                        backgroundColor: '#F6F8FB'
                    }}
                    refreshing={loading}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                if (!isOnline) {
                                    onCheckBoxChecked(item, index);
                                } else {
                                    ToastAndroid.show(
                                        isOnlineText,
                                        ToastAndroid.LONG
                                    );
                                }
                            }}
                            style={styles.rowContainerStyle}
                        >
                            {companyType == CompanyType.loan ? (
                                <DepositPendingRow
                                    key={item.visit_id}
                                    isOnline={isOnline}
                                    rowData={item}
                                />
                            ) : (
                                <DepositPendingCreditRow
                                    key={item.visit_id}
                                    isOnline={isOnline}
                                    rowData={item}
                                    onClickDetails={getTransactionData}
                                    transactionDataMap={transactionDataMap}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                />
                {isOnline && (
                    <Typography
                        style={{
                            alignSelf: 'center',
                            color: BLUE_1,
                            backgroundColor: '#F6F8FB',
                            width: '100%',
                            textAlign: 'center'
                        }}
                        variant={TypographyVariants.body2}
                    >
                        {isOnlineText}
                    </Typography>
                )}
                {filterItems?.length > 0 ? submitButton : null}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        alignItems: 'center',
        borderColor: '#033D8F33',
        borderRadius: 4,
        borderWidth: 1,
        color: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 5,
        margin: RFPercentage(0.5),
        padding: RFPercentage(0.7),
        paddingHorizontal: RFPercentage(1.2)
    },
    depositButton: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: BLUE_DARK,
        borderRadius: RFPercentage(1.4),
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: RFPercentage(1.4),
        paddingHorizontal: RFPercentage(2.4),
        paddingVertical: RFPercentage(1.8),
        width: '80%'
    },
    depositModeButton: {
        backgroundColor: 'white',
        borderColor: 'gray',
        borderRadius: 10,
        borderWidth: 0.5,
        height: 40,
        marginStart: 20,
        width: 110
    },
    emptyText: {
        color: 'gray',
        fontFamily: 'Avenir Next',
        fontSize: 16
    },
    headerContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: RFPercentage(1)
    },
    headerWrapper: {
        backgroundColor: '#F6F8FB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: RFPercentage(1)
    },
    listWrapper: {
        backgroundColor: '#F6F8FB',
        flex: 1
    },
    rowContainerStyle: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginHorizontal: 15,
        marginVertical: 5,
        padding: 5,
        paddingVertical: 10
    },
    scrollContainer: {
        backgroundColor: '#F6F8FB',
        flexGrow: 1
    },
    totalAmount: {
        color: 'green',
        fontFamily: 'poppins',
        fontSize: 16
    }
});
