import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {CompanyType, SortPortfolioTypes, SortValue} from '../../../enums';
import Colors, {BACKGROUND_COLOR, BLUE_DARK} from '../../constants/Colors';
import {useAuth} from '../../hooks/useAuth';
import {CalendarIcon} from '../common/Icons/CalendarIcon';
import {NewMonthPicker} from '../common/MonthPicker/NewMonthPicker';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../ui/Typography';
import {Menu} from 'react-native-paper';
import {ChevronDown} from '../common/Icons/ChevronDown';
import {
  addCurrencyDenomination,
  getAllocationMonthText,
} from '../../services/utils';
import {Divider} from '@rneui/base/dist/divider/Divider';
import {Overall, SOMETHING_WENT_WRONG} from '../../constants/constants';
import moment from 'moment';
import {
  getUnattemptedLoansCount,
  loadCustomerList,
  loadPortfolioList,
} from '../../services/portfolioService';
import {getDashboardMatrices} from '../../services/dashboardService';
import {useTaskAction} from '../../hooks/useTaskAction';
import {useMixpanel} from '../../contexts/MixpanelContext';
import {EventScreens, Events} from '../../constants/Events';
import {useIsFocused} from '@react-navigation/native';

const loanType = 'collections';

export default function PortfolioHeaderDetails() {
  const {
    allocationMonth,
    setAllocationMonth,
    companyType,
    getCurrencyString,
    currencySymbol,
    authData,
  } = useAuth();
  const {logEvent} = useMixpanel();
  const isFocused = useIsFocused();
  const {visitSubmitted, setVisitSubmitted} = useTaskAction();
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);
  const [calendarMenuVisible, setCalendarMenuVisible] = React.useState(false);
  const [loader, setLoader] = useState(false);
  const [loaderFirst, setLoaderFirst] = useState(false);
  const [loaderSecond, setLoaderSecond] = useState(false);
  const [monthlyCollection, setMonthlyCollection] = useState('');
  const [allocatedLoans, setAllocatedLoans] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [unattemptedLoans, setUnattemptedLoans] = useState('');

  const portfolioHeaderBg = require('../../assets/portfolio_header_bg.jpg');

  const hideMonthPicker = () => {
    setShowMonthPicker(false);
  };

  const reloadData = () => {
    portfolioApisCalling();
    getDashboardData(loanType, allocationMonth);
  };

  const isLoading = useMemo(() => {
    return loaderFirst || loaderSecond || loader;
  }, [loaderFirst, loaderSecond, loader]);

  useEffect(() => {
    if (isFocused) {
      if (companyType) reloadData();
    }
  }, [allocationMonth, companyType, isFocused]);

  useEffect(() => {
    if (isFocused) {
      getDashboardData(loanType, allocationMonth);
    }
  }, [visitSubmitted, isFocused]);

  const portfolioApisCalling = async () => {
    setLoaderFirst(true);
    setLoaderSecond(true);
    try {
      const [recoveryPortfolioResponse, unattemptedLoansResponse] =
        await Promise.all([
          callRecoveryFosPortfolioApi(allocationMonth, '', 1, {}),
          callUnattemptedLoansApi(allocationMonth),
        ]);
      if (recoveryPortfolioResponse?.data) {
        const output = recoveryPortfolioResponse?.data?.output;
        setAllocatedLoans(output?.total_count_of_loans?.toString());
        let allocated_amount = 0;
        const customer_details = output?.customer_details;
        for (var i in customer_details) {
          {
            customer_details[i]?.total_claim_amount
              ? (allocated_amount += parseInt(
                  customer_details[i]?.total_claim_amount,
                ))
              : 0;
          }
        }
        setAllocatedAmount(allocated_amount?.toString());
      }
      if (unattemptedLoansResponse?.success) {
        const unAttemptedLoans = unattemptedLoansResponse?.data?.total_records;
        setUnattemptedLoans(unAttemptedLoans?.toString());
      }
    } catch (e) {
      ToastAndroid.show(SOMETHING_WENT_WRONG, ToastAndroid.SHORT);
    } finally {
      setLoaderFirst(false);
      setLoaderSecond(false);
    }
  };

  const callUnattemptedLoansApi = async (allocationMonth: string) => {
    try {
      const apiResponse = await getUnattemptedLoansCount(
        allocationMonth,
        authData,
      );
      if (apiResponse) {
        return apiResponse;
      }
    } catch (e) {}
  };

  const callRecoveryFosPortfolioApi = async (
    allocationMonth: string,
    newValue: string,
    newPageNumber: number = 1,
    filterStatus: Object,
  ) => {
    const apiPageNumber = newPageNumber;
    if (companyType == CompanyType.loan) {
      try {
        const apiResponse = await loadPortfolioList(
          allocationMonth,
          apiPageNumber,
          1000000,
          {
            type: SortPortfolioTypes.created,
            value: SortValue.ascending,
          },
          filterStatus,
          authData,
          {latitude: 0, longitude: 0},
        );
        if (apiResponse) {
          return apiResponse;
        }
      } catch (e) {}
    } else if (companyType == CompanyType.credit_line) {
      try {
        const apiResponse = await loadCustomerList(
          allocationMonth,
          apiPageNumber,
          1000000,
          {
            type: SortPortfolioTypes.created,
            value: SortValue.ascending,
          },
          filterStatus,
          authData,
          {latitude: 0, longitude: 0},
        );
        if (apiResponse) {
          return apiResponse;
        }
      } catch (e) {}
    }
  };

  const getDashboardData = async (type: string, allocationMonth: string) => {
    try {
      setLoader(true);
      const apiResponse = await getDashboardMatrices(
        type,
        '',
        '',
        authData,
        allocationMonth,
      );
      if (apiResponse?.data) {
        const amount = apiResponse?.data['Recovered Amount'];
        setMonthlyCollection(amount?.toString());
        setVisitSubmitted(false);
      }
    } catch (e: any) {
    } finally {
      setLoader(false);
    }
  };

  return (
    <ImageBackground
      source={portfolioHeaderBg}
      style={{marginHorizontal: -8, paddingHorizontal: 8}}
      resizeMode="cover">
      <NewMonthPicker
        visible={showMonthPicker}
        hideMonthPicker={hideMonthPicker}
        selectedDate={allocationMonth}
        setSelectedDate={data => {
          logEvent(Events.allocation_month, EventScreens.portfolio_list, {
            value: data,
          });
          setAllocationMonth(data);
        }}
        maxDate={moment()}
        header="Allocation Month"
      />
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.amountContainer}>
            {loader ? (
              <ActivityIndicator color={'#fff'} animating={true} size="small" />
            ) : (
              <Typography
                variant={TypographyVariants.title}
                style={styles.allocationAmount}>
                {`${currencySymbol} ` +
                  addCurrencyDenomination(
                    monthlyCollection?.length ? parseInt(monthlyCollection) : 0,
                    currencySymbol,
                  )}
              </Typography>
            )}
            <Typography
              variant={TypographyVariants.body2}
              style={styles.allocationAmountlabel}>
              Monthly Collection
            </Typography>
          </View>

          {/* {companyType == CompanyType.loan ? ( */}
          <TouchableOpacity
            style={styles.monthPickerContainer}
            onPress={() => {
              setShowMonthPicker(!showMonthPicker);
            }}
            disabled={isLoading}>
            <View style={styles.monthPickerView}>
              <Typography
                style={styles.monthText}
                variant={TypographyVariants.title1}>
                {getAllocationMonthText(allocationMonth)}
              </Typography>
              <ChevronDown color="#fff" />
            </View>
          </TouchableOpacity>
          {/* ) : (
                        <View style={{ alignSelf: 'flex-end' }}>
                            <Menu
                                visible={calendarMenuVisible}
                                onDismiss={() => setCalendarMenuVisible(false)}
                                contentStyle={{
                                    backgroundColor: '#F6F8FB'
                                }}
                                anchor={
                                    <TouchableOpacity
                                        style={styles.monthPickerContainer}
                                        onPress={() => {
                                            setCalendarMenuVisible(
                                                !calendarMenuVisible
                                            );
                                        }}
                                    >
                                        <View style={styles.monthPickerView}>
                                            <Typography
                                                style={styles.monthText}
                                                variant={
                                                    TypographyVariants.title1
                                                }
                                            >
                                                {getAllocationMonthText(
                                                    allocationMonth
                                                )}
                                            </Typography>
                                            <ChevronDown color="#fff" />
                                        </View>
                                    </TouchableOpacity>
                                }
                            >
                                <Menu.Item
                                    onPress={() => {
                                        setCalendarMenuVisible(false);
                                        setAllocationMonth(Overall);
                                    }}
                                    titleStyle={styles.menuTitle}
                                    title={Overall}
                                />
                                <Divider />
                                <Menu.Item
                                    disabled={isLoading}
                                    onPress={() => {
                                        setCalendarMenuVisible(false);
                                        setShowMonthPicker(!showMonthPicker);
                                    }}
                                    titleStyle={styles.menuTitle}
                                    title={'Select Month'}
                                    icon={() => (
                                        <CalendarIcon color={'#043E90'} />
                                    )}
                                />
                            </Menu>
                        </View>
                    )} */}
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {loaderFirst ? (
              <ActivityIndicator
                color={BLUE_DARK}
                animating={true}
                size="small"
              />
            ) : (
              <Typography
                variant={TypographyVariants.title}
                style={styles.cardText}>
                {allocatedLoans?.length ? allocatedLoans : '0'}
              </Typography>
            )}

            <Typography
              variant={TypographyVariants.body2}
              style={styles.cardLabel}>
              {companyType === CompanyType.credit_line
                ? 'Allocated Customers'
                : 'Allocated Loans'}
            </Typography>
          </View>
          <View style={styles.card}>
            {loaderFirst ? (
              <ActivityIndicator
                color={BLUE_DARK}
                animating={true}
                size="small"
              />
            ) : (
              <Typography
                variant={TypographyVariants.title}
                style={styles.cardText}>
                {`${currencySymbol} ` +
                  addCurrencyDenomination(
                    allocatedAmount?.length ? parseInt(allocatedAmount) : 0,
                    currencySymbol,
                  )}
              </Typography>
            )}
            <Typography
              variant={TypographyVariants.body2}
              style={styles.cardLabel}>
              Allocated Amount
            </Typography>
          </View>
          <View style={styles.card}>
            {loaderSecond ? (
              <ActivityIndicator
                color={BLUE_DARK}
                animating={true}
                size={'small'}
              />
            ) : (
              <Typography
                variant={TypographyVariants.title}
                style={styles.cardText}>
                {unattemptedLoans?.length ? unattemptedLoans : '0'}
              </Typography>
            )}

            <Typography
              variant={TypographyVariants.body2}
              style={styles.cardLabel}>
              {companyType === CompanyType.credit_line
                ? 'Not Visited Customers'
                : 'Not Visited Loans'}
            </Typography>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  allocationAmount: {
    color: Colors.light.background,
    fontSize: 24,
    fontWeight: 'bold',
  },
  allocationAmountlabel: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  amountContainer: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    marginVertical: RFPercentage(3),
    padding: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  cardLabel: {
    color: BLUE_DARK,
    fontSize: 10,
    fontWeight: '600',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  cardText: {
    color: BLUE_DARK,
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    paddingBottom: RFPercentage(1),
    paddingTop: RFPercentage(3),
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: RFPercentage(1.5),
  },
  menuTitle: {
    color: BLUE_DARK,
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(2),
  },
  monthPickerContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: RFPercentage(1),
  },
  monthPickerView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  monthText: {
    color: '#fff',
    marginRight: 5,
  },
});
