import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import Logo from '../assets/Logo';
import CustomButton from '../components/ui/CustomButton';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../components/ui/Typography';
import { BLUE_DARK } from '../constants/Colors';
import { useAuth } from '../hooks/useAuth';
import {
    clearVisitCloseMap,
    removeSubmittedVisitFromCache
} from '../redux/offlineVisitDataSlice';
import { useAppSelector } from '../redux/hooks';
import {
    clearAllLoanDetailOfflineMap,
    LoanDetailOfflineType,
    removeAddressDatafromCache,
    removeAppContactNumFromCache,
    removeCoAppContactNumFromCache,
    removeLoanDataFromCache,
    selectLoanDetailOffline
} from '../redux/loanDetailSlice';
import { selectCloseVisit } from '../redux/offlineVisitDataSlice';
import { addressToCoordinateApiCall } from '../services/addressService';
import { updateContactDetails } from '../services/portfolioService';
import {
    makePrimaryAddressApiSync,
    submitForm,
    updateContactDetailsSync
} from '../services/OfflineSyncService';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'space-evenly',
        paddingHorizontal: '15%',
        paddingVertical: '20%'
    },
    logo: {
        alignItems: 'center'
    },
    text: {
        fontSize: 12,
        padding: 8,
        textAlign: 'center',
        lineHeight: RFPercentage(2.5)
    },
    closeText: {
        fontSize: RFPercentage(1.6),
        color: 'red',
        lineHeight: RFPercentage(2),
        textAlign: 'center',
        marginTop: RFPercentage(2)
    }
});

const PromiseAllSettled = (promises: Array<Promise<any>>) => {
    return Promise.all(
        promises.map((promise) =>
            promise
                .then((value) => ({ success: true, value }))
                .catch((value) => ({ success: false, value }))
        )
    );
};

export default function SyncScreen() {
    const data = useAppSelector(selectCloseVisit);
    const dispatch = useDispatch();
    const data2 = useAppSelector(selectLoanDetailOffline);

    const { authData } = useAuth();

    const [isSyncing, setIsSyncing] = React.useState(true);
    const isSyncCompleted = React.useMemo(() => {
        return Object.keys(data).length == 0 && Object.keys(data2).length == 0;
    }, [data, data2]);

    React.useEffect(() => {
        syncDataOnline();
    }, []);

    //removing data respectively from cache
    const onVisitSubmitSuccess = (visit_id: string) =>
        dispatch(removeSubmittedVisitFromCache(visit_id));

    const onAddressUpdationSuccess = (loan_id: string) => {
        dispatch(removeAddressDatafromCache(loan_id));
        dispatch(removeLoanDataFromCache(loan_id));
    };

    const onAppContactNumUpdationSuccess = (loan_id: string) => {
        dispatch(removeAppContactNumFromCache(loan_id));
        dispatch(removeLoanDataFromCache(loan_id));
    };
    const onCoAppNumUpdationSuccess = (loan_id: string) => {
        dispatch(removeCoAppContactNumFromCache(loan_id));
        dispatch(removeLoanDataFromCache(loan_id));
    };

    const syncDataOnline = async () => {
        const addressUpdationApis: any = [];
        const applicantContactNumberUpdation: any = [];
        const coAppContactNumberUpdation: any = [];

        Object.entries(data2).map((_item) => {
            const loanId = _item[0];
            const updateData: LoanDetailOfflineType = _item[1];
            if (updateData.addressData) {
                addressUpdationApis.push({
                    loanId,
                    data: updateData.addressData,
                    allocationMonth: updateData.allocationMonth
                });
            }
            if (updateData.applicantContactNumber) {
                applicantContactNumberUpdation.push({
                    data: updateData.applicantContactNumber,
                    loanId,
                    allocationMonth: updateData.allocationMonth
                });
            }
            if (updateData.coApplicantObject) {
                coAppContactNumberUpdation.push({
                    data: updateData.coApplicantObject,
                    loanId,
                    allocationMonth: updateData.allocationMonth
                });
            }
        });

        if (!!data) {
            setIsSyncing(true);
            PromiseAllSettled(
                Object.values(data).map((item) => {
                    setIsSyncing(true);
                    return submitForm(item, authData);
                })
            ).then((results) => {
                let resolved = 0;
                results.forEach((result) => {
                    const { response, visit_id } = result.value;
                    if (result.success) {
                        resolved++;
                        onVisitSubmitSuccess(visit_id);
                    }
                });
                setTimeout(() => {
                    setIsSyncing(false);
                }, 1000);
            });
        }

        if (!!addressUpdationApis.length) {
            setIsSyncing(true);
            PromiseAllSettled(
                addressUpdationApis.map((item: any) =>
                    updatePrimaryAddress(item)
                )
            ).then((results) => {
                results.forEach((result) => {
                    console.log(result, 'result address');
                    if (result.success) {
                        const { loan_id, response } = result.value;
                        onAddressUpdationSuccess(loan_id);
                    }
                });
                setTimeout(() => {
                    setIsSyncing(false);
                }, 1000);
            });
        }
        if (!!applicantContactNumberUpdation.length) {
            setIsSyncing(true);
            PromiseAllSettled(
                applicantContactNumberUpdation.map((item: any) =>
                    updateApplicantContactDetails(item)
                )
            ).then((results) => {
                results.forEach((result) => {
                    console.log(result, 'result app cont');
                    if (result.success) {
                        const { response, loan_id } = result.value;
                        onAppContactNumUpdationSuccess(loan_id);
                    }
                });
                setTimeout(() => {
                    setIsSyncing(false);
                }, 1000);
            });
        }

        if (!!coAppContactNumberUpdation.length) {
            setIsSyncing(true);
            PromiseAllSettled(
                coAppContactNumberUpdation.map((item: any) =>
                    updateCoAppContactDetails(item)
                )
            ).then((results) => {
                results.forEach((result) => {
                    console.log(result, 'result co app');
                    if (result.success) {
                        const { response, loan_id } = result.value;
                        onCoAppNumUpdationSuccess(loan_id);
                    }
                });
                setTimeout(() => {
                    setIsSyncing(false);
                }, 1000);
            });
        }
    };

    const updatePrimaryAddress = async (data: any) => {
        const primaryApiData: any = {
            applicantIndex: data?.data?.applicantIndex,
            addressIndex: data?.data?.address_id,
            loanId: data.loanId,
            addressType: data?.data?.address_type,
            applicantType: data?.data?.applicantType
        };
        const addressToCoordinateData: any = {
            applicantIndex: data?.applicantIndex,
            addressIndex: data?.address_id,
            loanId: data.loanId,
            address: `${data?.address_text},${data?.city}${data?.landmark} ,${data?.state} ${data?.pincode}`,
            addressType: data?.address_type
        };
        if (data?.data?.latitude && data?.data?.longitude) {
            try {
                const apiResponse = await makePrimaryAddressApiSync(
                    primaryApiData,
                    data.allocationMonth,
                    authData
                );
                return apiResponse;
            } catch (e) {
                throw e;
            }
        } else {
            try {
                const [primaryApiResponse, addressToCoordinateResponse] =
                    await Promise.all([
                        makePrimaryAddressApiSync(
                            primaryApiData,
                            data.allocationMonth,
                            authData
                        ),
                        addressToCoordinateApiCall(
                            addressToCoordinateData,
                            data?.data?.applicantType,
                            authData
                        )
                    ]);
                return primaryApiResponse;
            } catch (e) {
                console.log(e);
                throw e;
            }
        }
    };

    const updateApplicantContactDetails = async (item: any) => {
        const data = { applicant_contact_number: item?.data ?? '' };
        try {
            const apiResponse = await updateContactDetailsSync(
                item?.loanId ?? '',
                data,
                authData
            );
            return apiResponse;
        } catch (e) {
            throw e;
        }
    };

    const updateCoAppContactDetails = async (item: any) => {
        const data = { co_applicant: item?.data ?? '' };
        try {
            const apiResponse = await updateContactDetailsSync(
                item?.loanId ?? '',
                data,
                authData
            );
            return apiResponse;
        } catch (e) {
            throw e;
        }
    };

    //when user closes this screen
    const clearAllOfflineData = () => {
        dispatch(clearVisitCloseMap());
        dispatch(clearAllLoanDetailOfflineMap());
    };

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.logo}>
                    <Logo size={RFPercentage(20)} />
                </View>
                {isSyncing ? (
                    <>
                        <Typography
                            variant={TypographyVariants.heading3}
                            style={{
                                fontFamily: TypographyFontFamily.heavy,
                                marginBottom: RFPercentage(2)
                            }}
                        >
                            Sync in Progress
                        </Typography>
                        <ActivityIndicator size={'large'} color={BLUE_DARK} />

                        <Typography
                            variant={TypographyVariants.subHeading}
                            style={[
                                styles.text,
                                { fontSize: 14, marginTop: RFPercentage(1) }
                            ]}
                        >
                            {` Going online!\n Do not close the app to prevent data loss`}
                        </Typography>
                    </>
                ) : isSyncCompleted ? (
                    <>
                        <Typography
                            variant={TypographyVariants.heading3}
                            style={{
                                fontFamily: TypographyFontFamily.heavy,
                                marginBottom: RFPercentage(2),
                                color: 'green'
                            }}
                        >
                            Sync Completed!!
                        </Typography>
                    </>
                ) : (
                    <View
                        style={{
                            marginVertical: RFPercentage(4),
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            variant={TypographyVariants.heading3}
                            style={{
                                fontFamily: TypographyFontFamily.heavy,
                                marginBottom: RFPercentage(2),
                                color: 'red'
                            }}
                        >
                            Sync Failed!!
                        </Typography>
                        <CustomButton
                            title={'Retry'}
                            onPress={syncDataOnline}
                        />

                        <CustomButton
                            title="Close"
                            onPress={clearAllOfflineData}
                        />
                        <Typography
                            variant={TypographyVariants.body1}
                            style={[styles.closeText]}
                        >
                            Closing the sync screen, may result in data loss.
                        </Typography>
                    </View>
                )}
            </View>
        </View>
    );
}
