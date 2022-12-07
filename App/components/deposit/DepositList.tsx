import React, { useEffect, useRef, useState } from 'react';
import {
    BackHandler,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    ToastAndroid,
    View
} from 'react-native';
import DepositRow from './DepoistRow';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    getDepositDetails,
    loadDepostList
} from '../../services/depositService';
import { useAuth } from '../../hooks/useAuth';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import { DepositDetails, DepositType, HistoryLoanDetail } from '../../../types';
import BottomSheet from '@gorhom/bottom-sheet';
import DetailsBottomSheet from './DetailsBottomSheet';
import { BLUE_DARK } from '../../constants/Colors';
import DepositStatusCapsule from '../common/Capsules/DepositStatusCapsule';
import { getOnlyDate } from '../../services/utils';
import { Loading } from '../common/Loading';
import { BankBranchType, DepositStatuses } from '../../../enums';
import { RFPercentage } from 'react-native-responsive-fontsize';
import DepositsImages from '../common/DepositsIcon';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import CurrencyTypography from '../ui/CurrencyTypography';
import { ChevronDown } from '../common/Icons/ChevronDown';
import { ChevronUp } from '../common/Icons/ChevronUp';

const keyExtractor = (item: DepositType, index: number) => index.toString();

export default function DepositList() {
    const { authData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [depositDetailsLoading, setDepositDetailsLoading] = useState(false);
    const [items, setItems] = useState<Array<DepositType>>([]);
    const [index, setIndex] = useState<number | null>(null);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [isAmountDetailsOpen, setIsAmountDetailsOpen] = useState(false);

    const bottomSheetRef = useRef<BottomSheet>(null);

    const updateData = async () => {
        setLoading(true);
        const data = await loadDepostList(authData);
        setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        if (isFocused) {
            updateData();
        }
    }, [isFocused]);

    const onClose = () => setIndex(null);

    useEffect(() => {
        const backAction = () => {
            if (typeof index === 'number') {
                bottomSheetRef.current?.close();
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [bottomSheetRef, index]);

    let selectedDeposit: DepositType;
    let sheetData;

    if (typeof index === 'number') {
        selectedDeposit = items[index];

        const onClick = async () => {
            setDepositDetailsLoading(true);
            try {
                const response = await getDepositDetails(
                    selectedDeposit.deposit_id,
                    authData
                );

                const despositDetails: DepositDetails = response?.data;
                if (!despositDetails) {
                    ToastAndroid.show(
                        'Failed to fetch deposit details',
                        ToastAndroid.SHORT
                    );
                    return;
                }

                const newLoans = despositDetails.loan_details.map(
                    (item: any) => ({
                        ...item,
                        checked: true
                    })
                );

                navigation.navigate('DepositSubmitScreen', {
                    loan_ids: newLoans,
                    amount: despositDetails.total_amount,
                    recovery_method: despositDetails.recovery_method,
                    redeposit: true,
                    data: despositDetails
                });
            } catch (e) {
            } finally {
                setDepositDetailsLoading(false);
            }
        };

        let branchDetailsObj = {};
        if (selectedDeposit?.branch_type == BankBranchType.company) {
            branchDetailsObj = {
                'Branch Name':
                    selectedDeposit.branch_details?.branch_name ?? '--',
                'Branch ID': selectedDeposit.branch_id ?? '--'
            };
        } else {
            branchDetailsObj = {
                'Account Name':
                    selectedDeposit.branch_details?.account_name ?? '--'
            };
        }

        const branchDetails = (
            <View style={styles.sectionDetails}>
                {Object.keys(branchDetailsObj).map((key) => (
                    <View style={styles.sectionItem}>
                        <Typography
                            style={styles.key}
                            variant={TypographyVariants.body2}
                        >
                            {key}
                        </Typography>
                        <Text style={styles.value}>
                            {branchDetailsObj?.[key] ?? ''}
                        </Text>
                    </View>
                ))}
            </View>
        );

        sheetData = (
            <View style={styles.detailsContainer}>
                <View style={[styles.sectionItem, { paddingHorizontal: '2%' }]}>
                    <View>
                        <Typography variant={TypographyVariants.body1}>
                            Created
                        </Typography>
                        <Typography
                            style={{ marginVertical: RFPercentage(0.4) }}
                            variant={TypographyVariants.title1}
                        >
                            {getOnlyDate(selectedDeposit.created)}
                        </Typography>
                    </View>
                    {selectedDeposit.verification_status ===
                        DepositStatuses.rejected &&
                        (depositDetailsLoading ? (
                            <Loading />
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    onClick();
                                }}
                                style={[styles.button]}
                            >
                                <Typography
                                    variant={TypographyVariants.body}
                                    style={{ color: 'white' }}
                                >
                                    Re-Deposit
                                </Typography>
                            </TouchableOpacity>
                        ))}
                </View>
                <View style={[styles.section, { borderTopWidth: 2 }]}>
                    <Typography variant={TypographyVariants.title1}>
                        Branch Details
                    </Typography>
                    {branchDetails}
                </View>
                <View style={styles.section}>
                    <Typography variant={TypographyVariants.title1}>
                        Collection Details
                    </Typography>

                    <View style={styles.sectionDetails}>
                        <View style={styles.loanAmountContainer}>
                            <TouchableOpacity
                                onPress={() =>
                                    setIsAmountDetailsOpen((a) => !a)
                                }
                                activeOpacity={0.7}
                                style={[
                                    styles.sectionItem,
                                    isAmountDetailsOpen
                                        ? {
                                              borderColor: '#0000000D',
                                              borderBottomWidth: 2,
                                              borderStyle: 'solid'
                                          }
                                        : {}
                                ]}
                            >
                                <Typography
                                    style={styles.key}
                                    variant={TypographyVariants.body3}
                                >
                                    Total Amount
                                </Typography>

                                <View style={styles.amountChevronContainer}>
                                    <CurrencyTypography
                                        amount={selectedDeposit.total_amount}
                                        style={[
                                            styles.value,
                                            { marginRight: RFPercentage(1.6) }
                                        ]}
                                    />
                                    {isAmountDetailsOpen ? (
                                        <ChevronUp />
                                    ) : (
                                        <ChevronDown />
                                    )}
                                </View>
                            </TouchableOpacity>
                            {isAmountDetailsOpen && (
                                <View
                                    style={{ paddingVertical: RFPercentage(1) }}
                                >
                                    {selectedDeposit?.loan_details &&
                                    selectedDeposit?.loan_details.length > 0 ? (
                                        <View>
                                            <View style={styles.row}>
                                                <Typography
                                                    color="#5D5D5F"
                                                    style={[
                                                        styles.loanDetailsHeading,
                                                        {
                                                            flex: 2
                                                        }
                                                    ]}
                                                    variant={
                                                        TypographyVariants.caption3
                                                    }
                                                >
                                                    Loan IDs
                                                </Typography>
                                                <Typography
                                                    color="#5D5D5F"
                                                    style={{
                                                        flex: 1
                                                    }}
                                                    variant={
                                                        TypographyVariants.caption3
                                                    }
                                                >
                                                    Amount
                                                </Typography>
                                            </View>
                                            {selectedDeposit?.loan_details?.map(
                                                (
                                                    details: HistoryLoanDetail
                                                ) => (
                                                    <View style={styles.row}>
                                                        <Typography
                                                            color="#7d7d82"
                                                            variant={
                                                                TypographyVariants.caption3
                                                            }
                                                            style={[
                                                                styles.loanDetailsHeading,
                                                                {
                                                                    flex: 2
                                                                }
                                                            ]}
                                                        >
                                                            {details?.loan_id}
                                                        </Typography>
                                                        <CurrencyTypography
                                                            color="#7d7d82"
                                                            variant={
                                                                TypographyVariants.caption3
                                                            }
                                                            amount={
                                                                details?.amount_recovered
                                                            }
                                                            style={{
                                                                flex: 1
                                                            }}
                                                        />
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    ) : (
                                        <Typography
                                            color="#7d7d82"
                                            variant={
                                                TypographyVariants.caption3
                                            }
                                            style={[styles.loanDetailsHeading]}
                                        >
                                            No records found
                                        </Typography>
                                    )}
                                </View>
                            )}
                        </View>
                        <View style={styles.sectionItem}>
                            <Typography
                                style={styles.key}
                                variant={TypographyVariants.body2}
                            >
                                Deposit Method
                            </Typography>

                            <Text
                                style={[
                                    styles.value,
                                    { textTransform: 'capitalize' }
                                ]}
                            >
                                <DepositsImages
                                    type={selectedDeposit.deposit_method}
                                    size={13}
                                />
                                {selectedDeposit.deposit_method}
                            </Text>
                        </View>

                        <View style={styles.sectionItem}>
                            <Typography
                                style={styles.key}
                                variant={TypographyVariants.body2}
                            >
                                Deposit Receipt No.
                            </Typography>

                            <Text style={styles.value}>
                                {selectedDeposit.deposit_receipt_no ?? '--'}
                            </Text>
                        </View>

                        <View style={styles.sectionItem}>
                            <Typography
                                style={styles.key}
                                variant={TypographyVariants.body2}
                            >
                                Verification Status
                            </Typography>

                            <View style={styles.value}>
                                <DepositStatusCapsule
                                    status={selectedDeposit.verification_status}
                                />
                            </View>
                        </View>
                        {!(
                            selectedDeposit.verification_status ==
                            DepositStatuses['not required']
                        ) ? (
                            <View style={styles.sectionItem}>
                                <Typography
                                    style={styles.key}
                                    variant={TypographyVariants.body2}
                                >
                                    Verification Remark
                                </Typography>

                                <Text
                                    style={[
                                        styles.value,
                                        { textTransform: 'capitalize' }
                                    ]}
                                >
                                    {selectedDeposit.verification_remark ??
                                        '--'}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionDetails}>
                        <View style={styles.sectionItem}>
                            <Typography
                                style={styles.key}
                                variant={TypographyVariants.body2}
                            >
                                Comment
                            </Typography>

                            <Text
                                style={[styles.value, styles.commentContainer]}
                            >
                                {selectedDeposit.comment || '--'}
                            </Text>
                        </View>
                    </View>
                </View>
                {selectedDeposit.verification_status ===
                    DepositStatuses.rejected &&
                    (depositDetailsLoading ? (
                        <Loading />
                    ) : (
                        <View style={{ width: '90%', paddingVertical: 5 }}>
                            <TouchableOpacity
                                onPress={onClick}
                                style={[styles.button]}
                            >
                                <Typography
                                    variant={TypographyVariants.body}
                                    style={{ color: 'white' }}
                                >
                                    Re-Deposit
                                </Typography>
                            </TouchableOpacity>
                        </View>
                    ))}
            </View>
        );
    }

    return (
        <>
            <FlatList
                keyExtractor={keyExtractor}
                data={items}
                extraData={items}
                refreshControl={
                    <RefreshControl
                        enabled
                        progressViewOffset={10}
                        refreshing={loading}
                        onRefresh={() => updateData()}
                        colors={[BLUE_DARK]}
                    />
                }
                ListEmptyComponent={
                    !loading ? (
                        <ErrorPlaceholder
                            type="empty"
                            message="No Deposit Found!"
                        />
                    ) : null
                }
                contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: '#F4F6FC',
                    paddingVertical: 5
                }}
                renderItem={({ item, index }) => {
                    const onPress = () => {
                        setIndex(index);
                        bottomSheetRef.current?.expand();
                    };

                    return (
                        <DepositRow
                            onPress={onPress}
                            key={item.deposit_id}
                            data={item}
                        />
                    );
                }}
            />
            <DetailsBottomSheet
                ref={bottomSheetRef}
                onClose={onClose}
                dataComponent={sheetData}
            />
        </>
    );
}

const styles = StyleSheet.create({
    amountChevronContainer: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        alignItems: 'center',
        backgroundColor: BLUE_DARK,
        borderRadius: RFPercentage(1),
        padding: RFPercentage(1.2),
        paddingHorizontal: RFPercentage(2)
    },
    commentContainer: {
        backgroundColor: '#F4F6FC',
        lineHeight: 18,
        paddingLeft: 10,
        paddingRight: 10,
        paddingVertical: 5
    },
    detailsContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        width: '90%'
    },
    key: {
        flex: 1.4,
        marginTop: RFPercentage(0.4)
    },
    loanAmountContainer: {
        backgroundColor: '#F2F3F6',
        borderRadius: 4,
        elevation: 1,
        marginHorizontal: -10,
        paddingHorizontal: 10,
        width: '105%'
    },
    loanDetailsHeading: {
        marginVertical: RFPercentage(0.6),
        textAlign: 'center'
    },
    reDepositText: {
        color: '#043E90',
        fontFamily: 'Avenir Next',
        fontSize: RFPercentage(2.5)
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    section: {
        borderBottomColor: '#ECEEF2',
        borderBottomWidth: 2,
        borderRadius: 1,
        borderStyle: 'dashed',
        borderTopColor: '#ECEEF2',
        marginHorizontal: 10,
        paddingHorizontal: RFPercentage(1),
        paddingVertical: RFPercentage(2),
        width: '100%'
    },
    sectionDetails: {
        alignSelf: 'center',
        marginVertical: RFPercentage(1),
        width: '100%'
    },
    sectionItem: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: RFPercentage(0.4),
        paddingVertical: RFPercentage(0.8),
        width: '100%'
    },
    value: {
        color: BLUE_DARK,
        flexDirection: 'row',
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(2),
        lineHeight: 20
    }
});
