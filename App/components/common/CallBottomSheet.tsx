import React, { useCallback, useMemo, useState } from 'react';
import {
    Keyboard,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
    BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import { BottomSheetHandle } from './Icons/BottomSheetHandle';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@rneui/base';
import DashedLine from 'react-native-dashed-line';
import { PhoneSvg } from '../IconSvg';
import { TextInput } from 'react-native-gesture-handler';
import {
    updateContactDetails,
    updateCustomerProfile
} from '../../services/portfolioService';
import { useTaskAction } from '../../hooks/useTaskAction';
import { CustomActivityIndicator } from '../placeholders/CustomActivityIndicator';
import { ApplicantTypes, CompanyType } from '../../../enums';
import { GREY_2 } from '../../constants/Colors';
import useLoanDetails from '../../hooks/useLoanData';
import useCommon from '../../hooks/useCommon';
import _ from 'lodash';
export const CallBottomSheet = React.forwardRef((props: any, ref) => {
    const snapPoints = useMemo(() => [20, '40%'], []);
    const {
        onCallClick,
        data,
        loanId,
        applicantType,
        applicantIndex,
        loanDetails,
        transactionId
    } = props;
    const { countryIsdCode, companyType } = useAuth();
    const { setUpdatedContactDetails, updatedContactDetails } = useTaskAction();
    const [newContactDetail, setnewContactDetail] = useState('');
    const [loading, setLoading] = useState(false);
    const renderBackdrop = useCallback((props) => {
        return <BottomSheetBackdrop disappearsOnIndex={-1} {...props} />;
    }, []);
    const contactNumber = data?.split(',') ?? [];
    const [showError, setShowError] = useState(false);
    const { authData } = useAuth();
    const [errorText, setErrorText] = useState<string | undefined>('');
    const {
        setLoanDetailMap,
        loanDetailMap,
        selectedLoanData,
        getAddressData,
        setLoanDetailsOfflineObj,
        loanDetailOfflineObj
    } = useLoanDetails();
    const { isInternetAvailable } = useCommon();
    const tempLoanDetailMap = _.cloneDeep(loanDetailMap);

    const handleSheetChanges = (index: number) => {
        if (index === -1) {
            Keyboard.dismiss();
        }
    };

    const onError = (text: string | undefined) => {
        setShowError(true);
        setErrorText(text);
        if (text && text.length) setTimeout(() => setShowError(false), 3000);
    };

    const checkIfAlreadyPresent = (detail: string) => {
        let flag = false;
        contactNumber?.filter((number: string) => {
            if (number === detail) {
                flag = true;
            }
        });
        return flag;
    };

    const updateReduxStorage = () => {
        let data = {};
        if (applicantType == ApplicantTypes.applicant) {
            data = {
                applicant_contact_number: contactNumber?.toString()
            };
            const tempLoanData = loanDetailMap[selectedLoanData.loan_id];
            setLoanDetailMap({
                [selectedLoanData.loan_id]: {
                    ...tempLoanData,
                    loan_data: {
                        ...tempLoanData.loan_data,
                        ...data
                    }
                }
            });
            if (!isInternetAvailable) {
                setLoanDetailsOfflineObj({
                    [selectedLoanData.loan_id]: {
                        ...loanDetailOfflineObj[selectedLoanData.loan_id],
                        applicantContactNumber: contactNumber?.toString(),
                        allocationMonth: selectedLoanData.allocation_month
                    }
                });
            }
        } else if (applicantType == ApplicantTypes.co_applicant) {
            const tempAddressData = getAddressData(
                selectedLoanData.allocation_month,
                loanId
            );
            const applicantIndex = tempAddressData.applicant_index;
            let tempLoanData =
                tempLoanDetailMap[selectedLoanData.loan_id].loan_data;
            tempLoanData.co_applicant[
                applicantIndex
            ].co_applicant_contact_number = contactNumber?.toString();

            setLoanDetailMap({
                [selectedLoanData.loan_id]: {
                    ...tempLoanDetailMap[selectedLoanData.loan_id],
                    loan_data: {
                        ...tempLoanData,
                        ['co_applicant']: tempLoanData.co_applicant
                    }
                }
            });
            if (!isInternetAvailable) {
                setLoanDetailsOfflineObj({
                    [selectedLoanData.loan_id]: {
                        ...loanDetailOfflineObj[selectedLoanData.loan_id],
                        coApplicantObject: tempLoanData.co_applicant,
                        allocationMonth: selectedLoanData.allocation_month
                    }
                });
            }
            data = { co_applicant: loanDetails.co_applicant };
        }
    };

    const onClickAdd = async () => {
        if (checkIfAlreadyPresent(newContactDetail)) {
            onError('Number already present');
            return;
        }

        if (countryIsdCode == '+91' && newContactDetail.length != 10) {
            onError('Enter valid number');
            return;
        }
        if (
            companyType == CompanyType.credit_line &&
            transactionId?.length == 0
        ) {
            ToastAndroid.show(
                'No transaction found for current allocation month',
                ToastAndroid.SHORT
            );
            return;
        }
        setLoading(true);
        let data: any = {};
        try {
            if (applicantType == ApplicantTypes.applicant) {
                contactNumber?.unshift(newContactDetail);
                data = {
                    applicant_contact_number: contactNumber?.toString()
                };
            } else if (applicantType == ApplicantTypes.co_applicant) {
                contactNumber?.unshift(newContactDetail);
                const tempAddressData = getAddressData(
                    selectedLoanData.allocation_month,
                    loanId
                );
                const applicantIndex = tempAddressData?.applicant_index;
                let tempLoanData =
                    tempLoanDetailMap[selectedLoanData.loan_id].loan_data;
                tempLoanData.co_applicant[
                    applicantIndex
                ].co_applicant_contact_number = contactNumber?.toString();

                data = { co_applicant: tempLoanData.co_applicant };
            }
            if (companyType == CompanyType.loan) {
                if (!isInternetAvailable) {
                    updateReduxStorage();
                    setLoading(false);
                    return;
                }
                const apiResponse = await updateContactDetails(
                    loanId,
                    data,
                    authData
                );
                if (apiResponse?.data) {
                    updateReduxStorage();
                    setnewContactDetail('');
                    setUpdatedContactDetails(!updatedContactDetails);
                }
            } else if (companyType == CompanyType.credit_line) {
                const apiResponse = await updateCustomerProfile(
                    loanId,
                    transactionId,
                    data,
                    authData
                );
                if (apiResponse?.data) {
                    setnewContactDetail('');
                    ToastAndroid.show(
                        'Details updated successfully',
                        ToastAndroid.SHORT
                    );
                    setUpdatedContactDetails(!updatedContactDetails);
                }
            }
            ToastAndroid.show(
                'Details updated successfully',
                ToastAndroid.SHORT
            );
        } catch (e: any) {
            let message = e?.response?.data?.message ?? 'Some Error Occurred';
            if (
                e?.response?.data?.data?.error == 'Module access not permitted'
            ) {
                message = 'Permission denied. Contact your admin';
            }
            ToastAndroid.show(message, ToastAndroid.SHORT);
        }
        setLoading(false);
    };

    const ContactNumberRow = ({ item, index }) => {
        return (
            <>
                {index != 0 ? <View style={styles.lineSeparator} /> : null}
                {!!item.length && (
                    <TouchableOpacity
                        style={styles.numberContainer}
                        onPress={() => {
                            onCallClick(item);
                            ref?.current?.close();
                        }}
                    >
                        <Typography variant={TypographyVariants.body3}>
                            {item}
                        </Typography>
                        <PhoneSvg color="#06C270" />
                    </TouchableOpacity>
                )}
            </>
        );
    };

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            backdropComponent={renderBackdrop}
            enableHandlePanningGesture={false}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
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
            {loading ? (
                <View style={styles.loadingContainer}>
                    <CustomActivityIndicator />
                </View>
            ) : (
                <BottomSheetScrollView>
                    <View>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.countryCodeContainer}
                                placeholder={`${countryIsdCode}`}
                                placeholderTextColor={'#043E90'}
                                editable={false}
                            />

                            <BottomSheetTextInput
                                style={[styles.numberInputContainer]}
                                placeholder={`Enter new phone number`}
                                placeholderTextColor={'#043E90'}
                                value={newContactDetail}
                                onChangeText={setnewContactDetail}
                                keyboardType={'numeric'}
                            />

                            <Button
                                title={'Add'}
                                buttonStyle={styles.addButtonContainer}
                                titleStyle={styles.addButtonText}
                                onPress={onClickAdd}
                            />
                        </View>
                        {showError ? (
                            <View style={styles.errorContainer}>
                                <Typography
                                    variant={TypographyVariants.caption3}
                                    style={{ color: 'red' }}
                                >
                                    {errorText}
                                </Typography>
                            </View>
                        ) : null}

                        <DashedLine
                            dashColor="#043E90"
                            dashGap={5}
                            dashThickness={1}
                            style={{ marginVertical: RFPercentage(1.5) }}
                        />
                        <View style={{ paddingHorizontal: RFPercentage(2) }}>
                            <Typography
                                style={{ marginBottom: RFPercentage(1) }}
                                variant={TypographyVariants.heading3}
                            >
                                Saved Numbers
                            </Typography>
                            {contactNumber && contactNumber?.length && data ? (
                                contactNumber?.map((item, index) => {
                                    return (
                                        <ContactNumberRow
                                            key={item}
                                            item={item}
                                            index={index}
                                        />
                                    );
                                })
                            ) : (
                                <Typography
                                    variant={TypographyVariants.caption}
                                    style={styles.noDataFound}
                                >
                                    No data found!
                                </Typography>
                            )}
                        </View>
                    </View>
                </BottomSheetScrollView>
            )}
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    addButtonContainer: {
        backgroundColor: '#043E90',
        borderRadius: 10,
        margin: 0
    },
    addButtonText: {
        color: '#fff',
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.8),
        paddingHorizontal: RFPercentage(0.8),
        paddingVertical: RFPercentage(0.3),
        textAlign: 'center'
    },
    countryCodeContainer: {
        backgroundColor: '#C4C4C44D',
        borderRadius: 8,
        fontFamily: TypographyFontFamily.normal,
        height: RFPercentage(5),
        paddingHorizontal: RFPercentage(1),
        textAlign: 'center',
        width: '15%'
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: RFPercentage(0.5)
    },
    handleComponent: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: RFPercentage(2)
    },
    inputBox: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: RFPercentage(1.5)
    },
    lineSeparator: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        height: 0.5,
        width: '100%'
    },
    loadingContainer: {
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center'
    },
    numberContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: RFPercentage(2)
    },
    numberInputContainer: {
        backgroundColor: '#C4C4C44D',
        borderRadius: 8,
        fontFamily: TypographyFontFamily.normal,
        height: RFPercentage(5),
        paddingHorizontal: RFPercentage(1),
        width: '63%',
        justifyContent: 'space-between'
    },
    noDataFound: {
        textAlign: 'center',
        paddingVertical: RFPercentage(0.5),
        color: GREY_2
    }
});
