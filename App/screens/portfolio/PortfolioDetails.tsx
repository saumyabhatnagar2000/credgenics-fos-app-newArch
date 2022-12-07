import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from '../../components/portfolio/ActionButton';
import { useAuth } from '../../hooks/useAuth';
import {
    getDigitalNotice,
    getLoanDetailsWithLoan,
    getSpeedPost
} from '../../services/portfolioService';
import { LoanInternalDetailsType, TransactionListType } from '../../../types';
import DetailsHeader from '../../components/DetailsHeader';
import CustomAppBar from '../../components/common/AppBar';
import { ToastAndroid, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/core';
import { CustomActivityIndicator } from '../../components/placeholders/CustomActivityIndicator';
import { useTaskAction } from '../../hooks/useTaskAction';
import { useAction } from '../../hooks/useAction';
import { CompanyType, ScreenName } from '../../../enums';
import { getCallingHistory } from '../../services/callingService';
import { getTransactionList } from '../../services/portfolioService';
import { getFieldVisitHistory } from '../../services/taskService';
import {
    modifyCallingHistory,
    modifyReduxCustomerDetails,
    modifyReduxLoanDetails
} from '../../constants/ModifyData';
import { SOMETHING_WENT_WRONG } from '../../constants/constants';
import useLoanDetails from '../../hooks/useLoanData';
import _ from 'lodash';

export default function PortfolioDetail() {
    const { authData, companyType, showBalanceClaimAmount } = useAuth();
    const [details, setDetails] = useState<LoanInternalDetailsType>();
    const [customerDetails, setCustomerDetails] =
        useState<LoanInternalDetailsType>();
    const [callingHistory, setCallingHistory] = useState<any>();
    const [loading, setLoading] = useState(true);
    const { updatedContactDetails, updatedAddressIndex } = useTaskAction();
    const {
        selectedLoanData,
        loanDetailMap,
        getAddressData,
        setLoanDetailMap
    } = useLoanDetails();
    const { newAddressAdded } = useAction();
    const [tranasctionDetails, setTransactionDetails] = useState<
        Array<TransactionListType>
    >([]);

    const [visitHistory, setVisitHistory] = useState([]);
    const [digitalNotice, setDigitalNotice] = useState([]);
    const [speedPost, setSpeedPost] = useState([]);

    const fetchLoanDetails = () => {
        (async () => {
            setLoading(true);
            if (companyType == CompanyType.loan) {
                try {
                    const res = await getLoanDetailsWithLoan(
                        [
                            {
                                allocation_month:
                                    selectedLoanData.allocation_month,
                                loan_id: selectedLoanData.loan_id
                            }
                        ],
                        authData
                    );
                    const loanDetails = await modifyReduxLoanDetails(
                        res[selectedLoanData.loan_id],
                        selectedLoanData.allocation_month,
                        showBalanceClaimAmount
                    );
                    setDetails(loanDetails);
                } catch (e: any) {
                    ToastAndroid.show(
                        e?.response?.output ?? 'Some error occurred',
                        ToastAndroid.SHORT
                    );
                }
            } else {
                try {
                    const [profileApiResponse, transactionApiResponse] =
                        await Promise.all([
                            getLoanDetailsWithLoan(
                                [
                                    {
                                        loan_id: selectedLoanData.loan_id,
                                        allocation_month:
                                            selectedLoanData.allocation_month
                                    }
                                ],
                                authData
                            ),
                            getTransactionList(
                                selectedLoanData.allocation_month,
                                selectedLoanData.loan_id,
                                authData
                            )
                        ]);
                    let totalLoanAmount = 0;
                    let totalClaimAmount = 0;
                    let amountRecovered = 0;
                    try {
                        if (transactionApiResponse?.data) {
                            let data =
                                transactionApiResponse?.data.output[
                                    selectedLoanData.allocation_month
                                ];
                            data?.forEach((_item: TransactionListType) => {
                                totalLoanAmount += parseInt(
                                    _item?.total_loan_amount
                                );
                                totalClaimAmount += parseInt(
                                    _item?.defaults?.total_claim_amount
                                );
                                amountRecovered += parseInt(
                                    _item?.defaults?.amount_recovered
                                );
                            });
                            setTransactionDetails(data);
                        }
                    } catch (e) {}
                    if (profileApiResponse) {
                        const customer_details = modifyReduxCustomerDetails(
                            profileApiResponse[selectedLoanData.loan_id],
                            selectedLoanData,
                            selectedLoanData.allocation_month,
                            totalLoanAmount,
                            totalClaimAmount,
                            amountRecovered
                        );
                        setCustomerDetails(customer_details);
                    }
                } catch (e) {}
            }
            try {
                const [
                    callingApiResponse,
                    visitHistoryApiResponse,
                    digitalNoticeApiResponse,
                    speedPostApiResponse
                ] = await Promise.all([
                    getCallingHistory(selectedLoanData.loan_id, authData),
                    getFieldVisitHistory(selectedLoanData.loan_id, authData),
                    getDigitalNotice(
                        selectedLoanData.loan_id,
                        selectedLoanData.allocation_month,
                        authData
                    ),
                    getSpeedPost(
                        selectedLoanData.loan_id,
                        selectedLoanData.allocation_month,
                        authData
                    )
                ]);
                if (callingApiResponse?.success) {
                    const tempHis = modifyCallingHistory(
                        callingApiResponse?.data ?? []
                    );
                    setCallingHistory(tempHis);
                }
                if (visitHistoryApiResponse?.data) {
                    setVisitHistory(visitHistoryApiResponse?.data ?? []);
                }
                if (digitalNoticeApiResponse?.data) {
                    setDigitalNotice(
                        digitalNoticeApiResponse?.data?.output ?? []
                    );
                }
                if (speedPostApiResponse?.data) {
                    setSpeedPost(speedPostApiResponse?.data?.output ?? []);
                }
            } catch (e: any) {
                let msg = SOMETHING_WENT_WRONG;
                ToastAndroid.show(
                    e?.response?.data?.output ??
                        e?.response?.data?.message ??
                        msg,
                    ToastAndroid.SHORT
                );
            }
            setLoading(false);
        })();
    };
    useEffect(() => {
        fetchLoanDetails();
    }, [
        loanDetailMap,
        selectedLoanData,
        updatedContactDetails,
        updatedAddressIndex
    ]);

    const updateLoanDetails = async () => {
        try {
            const response = await getLoanDetailsWithLoan(
                [
                    {
                        loan_id: selectedLoanData.loan_id,
                        allocation_month: selectedLoanData.allocation_month
                    }
                ],
                authData
            );
            setLoanDetailMap({
                [selectedLoanData.loan_id]: response[selectedLoanData.loan_id]
            });
        } catch {}
    };

    useEffect(() => {
        updateLoanDetails();
    }, [newAddressAdded]);

    useFocusEffect(useCallback(fetchLoanDetails, []));

    const actionButton = React.useMemo(
        () => (
            <ActionButton
                loanData={[selectedLoanData]}
                address={
                    companyType == CompanyType.loan
                        ? details?.address
                        : customerDetails?.address
                }
                allocationMonth={selectedLoanData.allocation_month}
                screenName={ScreenName.portfolio_details}
            />
        ),
        [selectedLoanData, details?.address]
    );

    return (
        <>
            <CustomAppBar
                title={selectedLoanData.applicant_name}
                subtitle={`${
                    companyType == CompanyType.loan ? 'Loan Id' : 'Customer Id'
                }: ${selectedLoanData.loan_id}`}
                headerImage={selectedLoanData.applicant_photo_link || 'default'}
                filter={false}
                sort={false}
                search={false}
                backButton={true}
                add={false}
                notifications={false}
                options={false}
                talkingPoints={details?.loan_details[0]?.talking_point}
            />
            {loading && (
                <View
                    style={{
                        backgroundColor: 'white',
                        flex: 1,
                        justifyContent: 'center'
                    }}
                >
                    <CustomActivityIndicator />
                </View>
            )}
            {!loading && (
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            backgroundColor: 'white'
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <DetailsHeader
                                allocation_month={
                                    selectedLoanData.allocation_month
                                }
                                tabDetails={
                                    companyType == CompanyType.loan
                                        ? details
                                        : customerDetails
                                }
                                visitHistory={visitHistory}
                                callingHistory={callingHistory}
                                digitalNoticeHistory={digitalNotice}
                                speedPostHistory={speedPost}
                                transactionDetails={tranasctionDetails}
                                addressIndex={details?.address?.primary?.id}
                                addressData={getAddressData(
                                    selectedLoanData.allocation_month,
                                    selectedLoanData.loan_id
                                )}
                            />
                        </View>
                    </ScrollView>
                    {actionButton}
                </View>
            )}
        </>
    );
}
