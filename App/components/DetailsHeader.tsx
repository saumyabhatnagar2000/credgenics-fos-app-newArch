import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    LayoutAnimation,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
    TouchableOpacity
} from 'react-native';
import {
    CallingModeTypes,
    CompanyType,
    ExpandableCardTypes,
    LoanStatusType,
    TaskTypes,
    VisitPurposeType
} from '../../enums';
import { LoanDetailsHeaderType, VisitData } from '../../types';
import { createTask } from '../services/portfolioService';
import { useAuth } from '../hooks/useAuth';
import ExpandableCard from './common/ExpandableCard/ExpandableCard';
import { SideChevron } from './common/Icons/SideChevron';
import { HorizontalLine } from './HorizontalLine';
import { callUser } from '../services/communicationService';
import {
    StringCompare,
    leadingDebounce,
    startCall,
    startNavigation
} from '../services/utils';
import ExpandableView from './common/ExpandableView/ExpandableView';
import IconedBanner from './common/IconedBanner';
import CallListModal from './modals/CallListModal';
import CallTypeListModal from './modals/CallTypeListModal';
import ConnectingClickToCallModal from './modals/ConnectingClickToCallModal';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from './ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BLUE_DARK } from '../constants/Colors';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { AddressBottomSheet } from './common/AddressBottomSheet';
import { getAddress } from '../services/utils';
import _ from 'lodash';
import { CallBottomSheet } from './common/CallBottomSheet';
import { Portal } from 'react-native-paper';
import { LateFeesBottomSheet } from './common/LateFeesBottomSheet';
import { Tab } from './ui/Tab';
import { ChevronDown } from './common/Icons/ChevronDown';
import { ChevronUp } from './common/Icons/ChevronUp';
import { useClockIn } from '../hooks/useClockIn';
import useLoanDetails from '../hooks/useLoanData';
import OnlineOnly from './OnlineOnly';
import useCommon from '../hooks/useCommon';
import { LOAN_IS_CLOSED, SOMETHING_WENT_WRONG } from '../constants/constants';

export default function DetailsHeader({
    tabDetails,
    visitHistory,
    allocation_month,
    callingHistory,
    digitalNoticeHistory,
    speedPostHistory,
    transactionDetails,
    notShowUnplanned,
    showLoanDetailsByDefault = true,
    addressData
}: LoanDetailsHeaderType) {
    const { clockInStatus, showNudge } = useClockIn();
    const isFocused = useIsFocused();
    const { authData, callingModes, companyType } = useAuth();
    const [numbersListVisible, setNumbersListVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { navigate } = useNavigation();
    const [selectedNumber, setSelectedNumber] = useState('');
    const [isConnectingVisible, setIsConnectingVisible] = useState(false);
    const { selectedLoanData } = useLoanDetails();
    const { isInternetAvailable } = useCommon();

    const bottomSheetRef = useRef<BottomSheet>(null);
    const openAddressBottomSheet = () => {
        bottomSheetRef.current?.snapToIndex(0);
    };
    const callBottomSheetRef = useRef<BottomSheet>(null);
    const lateFeeBottomSheetRef = useRef<BottomSheet>(null);
    const openCallBottomSheet = () => {
        callBottomSheetRef.current?.expand();
    };
    const openLateFeeSheet = () => {
        lateFeeBottomSheetRef.current?.expand();
    };
    const [showDetails, setShowDetails] = useState(true);
    const [showCustomerDetails, setShowCustomerDetails] = useState(true);
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const [isQuickVisitClicked, setIsQuickVisitClicked] = useState(false);

    const tabLabel = {
        visits: 'Visit',
        calling: 'Calling',
        legal: 'Legal'
    };
    const detailTabLabel = {
        customer_details: 'Customer Details',
        transaction_details: 'Transaction Details'
    };

    useEffect(() => {
        (async () => {
            if (isFocused) {
                if (clockInStatus && isQuickVisitClicked) {
                    setIsQuickVisitClicked(false);
                    await onUnplannedVisitClickInternal();
                }
            } else {
                setIsQuickVisitClicked(false);
            }
        })();
    }, [clockInStatus, isQuickVisitClicked]);

    const [tab, setTab] = useState([
        {
            label: tabLabel.visits,
            active: true
        },
        {
            label: tabLabel.calling,
            active: false
        },
        {
            label: tabLabel.legal,
            active: false
        }
    ]);
    const [detailTab, setDetailTab] = useState([
        {
            label: detailTabLabel.customer_details,
            active: true
        },
        {
            label: detailTabLabel.transaction_details,
            active: false
        }
    ]);

    let filterDetails = _.cloneDeep(tabDetails);
    if (
        filterDetails?.loan_details?.[0]?.talking_point ||
        filterDetails?.loan_details?.[0]?.talking_point?.length === 0
    ) {
        delete filterDetails?.loan_details[0].talking_point;
    }

    const handleTabChange = (label: string) => {
        let tabDummy = tab;
        tabDummy.map((tab) => {
            tab.active = false;
            if (tab.label === label) {
                tab.active = false;
                if (tab.label === label) {
                    tab.active = true;
                }
                tab.active = true;
            }
        });
        setTab([...tabDummy]);
    };
    const handleDetailsTabChange = (label: string) => {
        let tabDummy = detailTab;
        tabDummy.map((tab) => {
            tab.active = false;
            if (tab.label === label) {
                if (
                    StringCompare(
                        tab.label.toLowerCase(),
                        detailTabLabel.customer_details.toLowerCase()
                    )
                )
                    setShowCustomerDetails(true);
                else setShowCustomerDetails(false);
                tab.active = true;
            }
        });
        setDetailTab([...tabDummy]);
    };

    const getLatestHistoryContent = () => {
        let activetab = '';
        try {
            if (tab[0].active) {
                activetab = tab[0].label;
                if (visitHistory?.length)
                    return (
                        <ExpandableCard
                            key={visitHistory[0].id}
                            dataList={visitHistory[0]}
                            type={ExpandableCardTypes.visit}
                            extraData={extraData}
                        />
                    );
                throw new Error();
            }
            if (tab[1].active) {
                activetab = tab[1].label;
                if (callingHistory?.length)
                    return (
                        <ExpandableCard
                            key={callingHistory[0].call_to}
                            dataList={callingHistory[0]}
                            type={ExpandableCardTypes.call}
                            extraData={extraData}
                        />
                    );
                throw new Error();
            }
            if (tab[2].active) {
                activetab = tab[2].label;
                if (digitalNoticeHistory?.length)
                    return (
                        <ExpandableCard
                            key={digitalNoticeHistory[0].delivered_time}
                            dataList={digitalNoticeHistory[0]}
                            type={ExpandableCardTypes.digitalNotice}
                            extraData={extraData}
                        />
                    );
                throw new Error();
            }
        } catch {
            return (
                <View>
                    <Typography
                        style={styles.noDataText}
                        variant={TypographyVariants.body2}
                    >
                        {` No ${activetab} history found`}
                    </Typography>
                </View>
            );
        }
    };
    const locationText = () => {
        try {
            if (tabDetails?.address) {
                const address = getAddress(
                    addressData?.applicant_type,
                    tabDetails?.address?.primary
                );
                if (address?.address_text)
                    return `${address?.address_text}, ${address?.city}`;
                if (address && address.longitude && address.latitude)
                    return 'Go to location';
            }
        } catch (e) {}
        return 'Not Available';
    };

    const onLocationClicked = () => {
        let address = getAddress(
            addressData?.applicant_type,
            tabDetails?.address?.primary
        );
        if (address) {
            let detsination = '';
            let destinationCoordinates = '';
            if (address?.latitude && address?.longitude) {
                const latitude = address?.latitude;
                const longitude = address?.longitude;
                destinationCoordinates = `${latitude},${longitude}`;
            }
            if (destinationCoordinates) {
                startNavigation(destinationCoordinates);
            } else if (address?.address_text) {
                detsination = `${address?.address_text},${address?.city}${address?.landmark} ,${address?.state} ${address?.pincode}`;
                startNavigation(detsination);
            } else {
                ToastAndroid.show('No Address found!', ToastAndroid.SHORT);
            }
        } else {
            ToastAndroid.show('No Address found!', ToastAndroid.SHORT);
        }
    };

    const onCall = (number: string) => {
        const isC2CAvailable = callingModes.includes(
            CallingModeTypes.click_to_call
        );
        const isManualAvailable = callingModes.includes(
            CallingModeTypes.manual
        );

        if (isC2CAvailable && isManualAvailable) {
            if (isInternetAvailable) setSelectedNumber(number);
            else {
                startCall(number);
            }
        } else if (isManualAvailable) startCall(number);
        else if (isC2CAvailable) {
            if (!isInternetAvailable) {
                ToastAndroid.show(
                    'Calling not supported in C2C method in offline method',
                    ToastAndroid.SHORT
                );
                return;
            }
            c2c(number);
        }
    };

    const c2c = async (number: string) => {
        const data = {
            To: number,
            From: authData?.mobile,
            applicant_type: addressData?.applicant_type,
            status: 'call_attempted'
        };
        try {
            const apiRepsonse = await callUser(
                selectedLoanData.loan_id,
                allocation_month,
                data.To,
                data.From,
                data.applicant_type,
                data.status,
                authData
            );
            setNumbersListVisible(false);
            showConnecting();
            if (
                StringCompare(
                    selectedLoanData?.final_status,
                    LoanStatusType.closed
                )
            ) {
                ToastAndroid.show(LOAN_IS_CLOSED, ToastAndroid.LONG);
                return;
            }
            navigate('DispositionFormScreen', {
                shootId: apiRepsonse?.data?.shoot_id ?? '',
                phoneNumber: data.To
            });
        } catch (e: any) {
            ToastAndroid.show(SOMETHING_WENT_WRONG, ToastAndroid.SHORT);
        }
    };

    const handleCallTypeSelect = (type: CallingModeTypes) => {
        const number = selectedNumber;
        setSelectedNumber('');
        if (type === CallingModeTypes.manual) startCall(number);
        if (type === CallingModeTypes.click_to_call) c2c(number);
    };

    const showConnecting = () => {
        setIsConnectingVisible(true);
        setInterval(() => {
            setIsConnectingVisible(false);
        }, 5000);
    };

    const navigateToHistoryScreen = () => {
        navigate('CombineHistoryScreen', {
            visit_history: visitHistory,
            calling_history: callingHistory,
            digital_notice: digitalNoticeHistory,
            speed_post: speedPostHistory,
            loan_id: selectedLoanData.loan_id,
            loan_data: selectedLoanData
        });
    };
    const navigateToLoanDetails = () => {
        navigate('LoanDetailsScreen', {
            loanData: selectedLoanData,
            loanDetails: tabDetails?.loan_details
        });
    };

    const getDate = () => {
        let d = new Date();
        const month = Number(d.getMonth()) + 1;
        return (
            d.getFullYear() +
            '-' +
            month +
            '-' +
            d.getDate() +
            ' ' +
            d.getHours() +
            ':' +
            d.getMinutes() +
            ':' +
            d.getSeconds()
        );
    };

    const onUnplannedVisitClickInternal = async () => {
        if (
            StringCompare(selectedLoanData?.final_status, LoanStatusType.closed)
        ) {
            ToastAndroid.show(LOAN_IS_CLOSED, ToastAndroid.LONG);
            return;
        }
        if (loading) return;
        if (!clockInStatus) {
            setIsQuickVisitClicked(true);
            ToastAndroid.show(
                'Please clock before creating a new visit',
                ToastAndroid.SHORT
            );
            showNudge();
            return;
        }
        setLoading(true);
        createTask(
            {
                loan_id: selectedLoanData?.loan_id,
                visit_date: getDate(),
                address_index: addressData?.address_index,
                applicant_index: selectedLoanData?.applicant_index,
                applicant_name: selectedLoanData?.applicant_name,
                applicant_type: addressData?.applicant_type,
                comment: ''
            } as VisitData,
            allocation_month,
            TaskTypes.visit,
            authData,
            true
        )
            .then((apiResponse?) => {
                if (apiResponse && apiResponse?.success) {
                    const data = apiResponse?.data;
                    const output = data?.visit_id;
                    if (data?.visit_purpose) {
                        let type = data?.visit_purpose;
                        if (
                            StringCompare(type, VisitPurposeType.surprise_visit)
                        )
                            type = TaskTypes.visit;
                        else if (
                            StringCompare(type, VisitPurposeType.promise_to_pay)
                        )
                            type = TaskTypes.ptp;
                        if (!type) {
                            ToastAndroid.show(
                                'Error creating new visit',
                                ToastAndroid.SHORT
                            );
                            return;
                        }
                        navigate('TaskDetailScreen', {
                            taskType: type,
                            visit_id: output,
                            reminder_id: data?.reminder_id,
                            allocation_month
                        });
                    } else {
                        navigate('TaskDetailScreen', {
                            taskType: TaskTypes.visit,
                            visit_id: output,
                            reminder_id: data?.reminder_id,
                            allocation_month
                        });
                    }
                }
            })
            .catch((e) => {})
            .finally(() => {
                setLoading(false);
            });
    };

    const onUnplannedVisitClick = useCallback(
        leadingDebounce(async function () {
            await onUnplannedVisitClickInternal();
        }, 2000),
        [onUnplannedVisitClickInternal]
    );

    const extraData = {
        type: 'TASK',
        loan_id: selectedLoanData?.loan_id,
        loan_data: selectedLoanData
    };

    return (
        <>
            <View style={styles.container}>
                <ConnectingClickToCallModal visible={isConnectingVisible} />
                {numbersListVisible && (
                    <CallListModal
                        visible={numbersListVisible}
                        setVisible={setNumbersListVisible}
                        onCall={onCall}
                        contactNumberList={
                            tabDetails?.contact_number?.split(',') ?? []
                        }
                    />
                )}

                {!!selectedNumber && (
                    <CallTypeListModal
                        visible={!!selectedNumber}
                        hide={() => setSelectedNumber('')}
                        onTypeSelect={handleCallTypeSelect}
                    />
                )}

                <View>
                    <IconedBanner
                        value={locationText()}
                        bgColor="#fff"
                        type="location"
                        onClickAddicon={openAddressBottomSheet}
                        onTextClick={onLocationClicked}
                    />
                </View>
                <HorizontalLine type="dashed" />

                <View>
                    <IconedBanner
                        value={''}
                        bgColor="#fff"
                        type="phone"
                        onClickAddicon={openCallBottomSheet}
                        onTextClick={openCallBottomSheet}
                    />
                </View>
                {notShowUnplanned ||
                companyType == CompanyType.credit_line ? null : (
                    <TouchableOpacity
                        onPress={onUnplannedVisitClick}
                        style={styles.submitView}
                    >
                        <Typography
                            variant={TypographyVariants.body3}
                            style={{ marginRight: RFPercentage(0.6) }}
                        >
                            Quick Visit
                        </Typography>

                        <SideChevron />
                    </TouchableOpacity>
                )}
                {companyType == CompanyType.loan &&
                    tabDetails?.loan_details && (
                        <>
                            <ExpandableView
                                name="Loan Details"
                                dataList={filterDetails?.loan_details}
                                hasChevron={false}
                                expanded={showLoanDetailsByDefault}
                                extraData={{
                                    openSheet: () => {
                                        openLateFeeSheet();
                                    }
                                }}
                            />
                            <OnlineOnly>
                                <Typography
                                    variant={TypographyVariants.body1}
                                    style={styles.viewMoreText}
                                    onPress={navigateToLoanDetails}
                                >
                                    View More
                                </Typography>
                            </OnlineOnly>
                        </>
                    )}
                {companyType == CompanyType.credit_line && (
                    <>
                        <TouchableOpacity
                            onPress={() => {
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.Presets.easeInEaseOut
                                );
                                setShowDetails(!showDetails);
                            }}
                            style={[styles.detailsContainer]}
                        >
                            <Typography
                                variant={TypographyVariants.body3}
                                style={[styles.title]}
                            >
                                {'DETAILS'}
                            </Typography>
                            <View style={{ marginRight: RFPercentage(2) }}>
                                {!showDetails ? <ChevronDown /> : <ChevronUp />}
                            </View>
                        </TouchableOpacity>
                        {showDetails ? (
                            <>
                                <Tab
                                    tabs={detailTab}
                                    handleTabChange={handleDetailsTabChange}
                                    containerStyle={styles.customerTabContainer}
                                    tabStyle={{
                                        minWidth: '49%',
                                        borderRadius: 4
                                    }}
                                />
                                <View>
                                    {showCustomerDetails ? (
                                        tabDetails?.loan_details && (
                                            <ExpandableView
                                                name="Loan Details"
                                                dataList={
                                                    tabDetails?.loan_details
                                                }
                                                hasChevron={false}
                                                expanded={
                                                    showLoanDetailsByDefault
                                                }
                                                headerNotReq={true}
                                            />
                                        )
                                    ) : transactionDetails &&
                                      transactionDetails?.length ? (
                                        <View>
                                            <ExpandableCard
                                                dataList={transactionDetails[0]}
                                                type="transaction"
                                                extraData={extraData}
                                            />
                                            {transactionDetails[1] && (
                                                <ExpandableCard
                                                    dataList={
                                                        transactionDetails[1]
                                                    }
                                                    type="transaction"
                                                    extraData={extraData}
                                                />
                                            )}
                                            {transactionDetails[2] && (
                                                <ExpandableCard
                                                    dataList={
                                                        transactionDetails[2]
                                                    }
                                                    type="transaction"
                                                    extraData={extraData}
                                                />
                                            )}
                                            {showAllTransactions
                                                ? transactionDetails
                                                      ?.filter(
                                                          (item, index) => {
                                                              if (index > 2)
                                                                  return item;
                                                          }
                                                      )
                                                      .map((data, index) => {
                                                          return (
                                                              <ExpandableCard
                                                                  key={index}
                                                                  dataList={
                                                                      data
                                                                  }
                                                                  type="transaction"
                                                                  extraData={
                                                                      extraData
                                                                  }
                                                              />
                                                          );
                                                      })
                                                : null}
                                            {Object.keys(transactionDetails)
                                                .length > 3 && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setShowAllTransactions(
                                                            !showAllTransactions
                                                        )
                                                    }
                                                    style={{
                                                        alignSelf: 'flex-end'
                                                    }}
                                                >
                                                    <Text
                                                        style={
                                                            styles.viewMoreTextCred
                                                        }
                                                    >
                                                        {`View ${
                                                            showAllTransactions
                                                                ? 'Less'
                                                                : 'More'
                                                        }`}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ) : (
                                        <View
                                            style={styles.noTransactionDataText}
                                        >
                                            <Typography
                                                variant={
                                                    TypographyVariants.body1
                                                }
                                            >
                                                No transaction history found
                                            </Typography>
                                        </View>
                                    )}
                                </View>
                                <HorizontalLine
                                    color="rgba(0,0,0,0.1)"
                                    type="dashed"
                                />
                            </>
                        ) : null}
                    </>
                )}
                <OnlineOnly>
                    <View>
                        <TouchableOpacity onPress={navigateToHistoryScreen}>
                            <ExpandableView
                                name="History"
                                dataList={callingHistory}
                                hasChevron={true}
                                extraData={extraData}
                                headerNotReq={false}
                            />
                        </TouchableOpacity>
                        {isInternetAvailable && (
                            <Tab
                                tabs={tab}
                                handleTabChange={handleTabChange}
                                containerStyle={styles.historyTabContainer}
                                tabStyle={styles.historyTabStyle}
                                tabLabelStyle={TypographyVariants.caption}
                            />
                        )}
                        {isInternetAvailable && getLatestHistoryContent()}
                    </View>
                </OnlineOnly>
            </View>
            <AddressBottomSheet
                data={tabDetails?.address}
                ref={bottomSheetRef}
                applicantType={addressData?.applicant_type}
                applicantIndex={addressData?.applicant_index}
                loanId={selectedLoanData?.loan_id}
                addressIndex={addressData?.address_index}
                loanData={selectedLoanData}
                allocationMonth={allocation_month}
            />
            <Portal>
                <CallBottomSheet
                    loanId={selectedLoanData?.loan_id}
                    data={tabDetails?.contact_number}
                    ref={callBottomSheetRef}
                    onCallClick={onCall}
                    applicantType={addressData?.applicant_type}
                    applicantIndex={selectedLoanData?.applicant_index}
                    loanDetails={tabDetails}
                    transactionId={
                        transactionDetails?.[0]?.transaction_id ?? ''
                    }
                />
                <LateFeesBottomSheet
                    loan_id={selectedLoanData?.loan_id}
                    allocation_month={allocation_month}
                    ref={lateFeeBottomSheetRef}
                />
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20
    },
    customerTabContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        width: '100%'
    },
    detailsContainer: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '4%',
        marginTop: RFPercentage(1.4)
    },
    historyTabContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        paddingBottom: RFPercentage(0),
        paddingTop: RFPercentage(0.7),
        width: '63%'
    },
    historyTabStyle: {
        borderRadius: 4,
        height: 25,
        marginHorizontal: '4%'
    },
    noDataText: {
        marginVertical: RFPercentage(2),
        textAlign: 'center'
    },
    noTransactionDataText: {
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        marginVertical: '50%'
    },
    submitView: {
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderColor: BLUE_DARK,
        borderRadius: 4,
        borderWidth: 1,
        flexDirection: 'row',
        marginRight: RFPercentage(2),
        marginTop: RFPercentage(0.8),
        paddingHorizontal: RFPercentage(1.6),
        paddingVertical: RFPercentage(1)
    },
    title: {
        flex: 1,
        padding: RFPercentage(2.2),
        textTransform: 'uppercase'
    },
    viewMoreText: {
        paddingRight: 20,
        paddingVertical: 5,
        textAlign: 'right',
        textDecorationLine: 'underline'
    },
    viewMoreTextCred: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.oblique,
        fontSize: RFPercentage(1.75),
        marginBottom: RFPercentage(1),
        marginRight: RFPercentage(1.75),
        textDecorationLine: 'underline'
    }
});
