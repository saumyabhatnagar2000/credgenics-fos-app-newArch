import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from '@rneui/base';
import CustomAppBar from '../components/common/AppBar';
import {TableRow} from '../components/common/ExpandableView/TableRow';
import {useAuth} from '../hooks/useAuth';
import {getActivitySummary, getLoanDetails} from '../services/portfolioService';
import {AxiosError, AxiosResponse} from 'axios';
import {ToastAndroid} from 'react-native';
import Typography, {TypographyVariants} from '../components/ui/Typography';
import ExpandableView from '../components/common/ExpandableView/ExpandableView';
import UserProfileIcon from '../components/auth/UserProfileIcon';
import {flattenObj} from '../services/utils';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {BLUE_DARK} from '../constants/Colors';
import {SOMETHING_WENT_WRONG} from '../constants/constants';
import {Tab} from '../components/ui/Tab';
import moment from 'moment';
import {NewMonthPicker} from '../components/common/MonthPicker/NewMonthPicker';
import {SummaryCard} from '../components/ui/SummaryCard';
import {LinearGradientHOC} from '../components/ui/LinearGradientHOC';
import useLoanDetails from '../hooks/useLoanData';

const HIDE_APPLICANT_KEYS = ['applicant_name', 'applicant_photo_link'];
const HIDE_COAPPLICANT_KEYS = ['co_applicant_photo_link'];

const CO_APPLICANT = 'co_applicant';

export function CustomerProfile({route}: {route: any}) {
  const {authData, allocationMonth} = useAuth();
  const {selectedLoanData} = useLoanDetails();

  const [customerData, setCustomerData] = useState({});
  const [stringType, setStringType] = useState({});
  const [arrayType, setArrayType] = useState({});
  const [coApplicantData, setCoApplicantData] = useState({});

  const [showMonthPicker, setShowMonthPicker] = React.useState(false);
  const hideMonthPicker = () => setShowMonthPicker(!showMonthPicker);

  const [activitySummary, setActivitySummary] = useState({});
  const [localAllocationMonth, setLocalAllocationMonth] =
    useState(allocationMonth);

  const [tabs, setTabs] = useState([
    {
      label: 'Customer Details',
      active: true,
    },
    {
      label: 'Activity Summary',
      active: false,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const headerImageUrl: string = route.params?.headerImageUrl;
  const getCustomerDetails = () => {
    setLoading(true);
    getLoanDetails(
      authData!,
      route.params.loan_id,
      'applicant',
      allocationMonth,
    )
      .then((apiResponse?: AxiosResponse) => {
        if (apiResponse) {
          const data = apiResponse.data;
          const output = data.output;
          setCustomerData(output?.applicant_details);
        }
        setLoading(false);
      })
      .catch((error: AxiosError) => {
        let message = SOMETHING_WENT_WRONG;
        if (error.response) {
          message =
            error?.response?.data.output ?? error?.response?.data.message;
        }
        ToastAndroid.show(message, ToastAndroid.LONG);
        setLoading(false);
      });
  };

  const getActivityData = () => {
    getActivitySummary(authData!, selectedLoanData, localAllocationMonth).then(
      apiResponse => {
        if (apiResponse) {
          const output = apiResponse?.data;
          setActivitySummary(output);
        }
      },
    );
  };

  useEffect(() => {
    getActivityData();
  }, [localAllocationMonth]);

  useEffect(() => {
    setLoading(true);
    if (route.params.loan_id) getCustomerDetails();
    setLoading(false);
  }, [route.params]);

  const getUpdatedKeys = () => {
    let stringObj: any = {};
    let arrayObj: any = {};
    let coApplicantObj: any = {};
    let coApplicant: any = {};

    Object.keys(customerData).map(loan => {
      if (
        (typeof customerData[loan] === 'string' ||
          typeof customerData[loan] === 'number' ||
          customerData[loan] === null) &&
        !HIDE_APPLICANT_KEYS.includes(loan)
      ) {
        stringObj[loan] = customerData[loan];
      } else if (Array.isArray(customerData[loan]) && loan !== CO_APPLICANT) {
        arrayObj[loan] = customerData[loan];
      } else if (loan === CO_APPLICANT) {
        customerData[loan]?.map((data, i) => {
          coApplicant = {};
          Object.keys(data)?.map(d => {
            if (!HIDE_COAPPLICANT_KEYS.includes(d)) {
              if (typeof data[d] !== 'object') {
                coApplicant[d] = data[d];
              } else {
                data[d]?.map((val, ind) => {
                  Object.keys(val).map(v => {
                    coApplicant[v + ' ' + +(ind + 1)] = val[v];
                  });
                });
              }
            }
            coApplicantObj[loan + ' ' + +(i + 1)] = coApplicant;
          });
        });
      }
    });
    setStringType({
      ...stringObj,
    });
    setArrayType({
      ...arrayObj,
    });
    setCoApplicantData({
      ...coApplicantObj,
    });
  };

  useEffect(() => {
    if (customerData && Object.keys(customerData).length) {
      getUpdatedKeys();
    }
  }, [customerData]);

  const getName = () => {
    return (
      <View style={styles.nameContainer}>
        <Typography variant={TypographyVariants.heading2} style={styles.text}>
          {customerData.applicant_name}
        </Typography>
        <Typography variant={TypographyVariants.body1} style={styles.text}>
          ID: {route.params.loan_id}
        </Typography>
      </View>
    );
  };
  const getApplicationImage = () => {
    return headerImageUrl != 'default' ? (
      <ImageBackground
        style={styles.imageWrapper}
        source={{uri: headerImageUrl}}>
        {getName()}
      </ImageBackground>
    ) : (
      <View style={styles.imageWrapper}>
        <UserProfileIcon background="#F6F8FB" />
        {getName()}
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          paddingVertical: RFPercentage(2),
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size="small" color={BLUE_DARK} />
      </View>
    );
  }

  const handleTabChange = (label: string) => {
    let tabDummy = tabs;
    tabDummy.map(tab => {
      tab.active = false;
      if (tab.label === label) {
        tab.active = true;
      }
    });
    setTabs([...tabDummy]);
  };

  const isActivitySummary = !tabs[0].active;

  let floatingButton = null;
  if (isActivitySummary) {
    floatingButton = (
      <View
        style={{
          position: 'absolute',
          bottom: RFPercentage(4),
          right: RFPercentage(3),
        }}>
        <TouchableOpacity
          onPress={() => setShowMonthPicker(a => !a)}
          activeOpacity={0.7}
          style={{
            height: RFPercentage(8),
            width: RFPercentage(8),
            borderRadius: 100,
            elevation: 10,
            overflow: 'hidden',
          }}>
          <LinearGradientHOC
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              type="font-awesome"
              name="calendar"
              color="white"
              size={RFPercentage(3)}
            />
            <Typography
              color="white"
              variant={TypographyVariants.body4}
              style={{marginTop: 2}}>
              {moment(localAllocationMonth, 'YYYY-M-DD').format('MMM')}
            </Typography>
          </LinearGradientHOC>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <CustomAppBar title="" backButton={true} options={false} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          isActivitySummary ? {flex: 1} : {},
        ]}>
        {getApplicationImage()}
        <View style={styles.floatingButtonContainer}>
          <Tab
            tabs={tabs}
            handleTabChange={handleTabChange}
            containerStyle={{
              width: '100%',
              justifyContent: 'space-around',
              paddingVertical: RFPercentage(0),
            }}
            tabStyle={{
              height: RFPercentage(3.5),
            }}
            tabLabelStyle={TypographyVariants.caption3}
          />
        </View>
        {!isActivitySummary ? (
          <View
            style={{
              marginVertical: RFPercentage(1),
              backgroundColor: '#F6F8FB',
            }}>
            <TableRow dataDict={stringType} />
            {Object.keys(arrayType)?.map(value =>
              arrayType?.[value]?.map((val, i) => (
                <ExpandableView
                  name={`${value.split('_').join(' ')} ${i + 1}`}
                  dataList={flattenObj(val) || {}}
                  hasChevron={false}
                  styles={styles.expandableViewStyle}
                  type="table"
                />
              )),
            )}
            {Object.keys(coApplicantData)?.map(value => (
              <ExpandableView
                name={`${value?.split('_')?.join(' ')}`}
                dataList={flattenObj(coApplicantData?.[value]) || {}}
                hasChevron={false}
                styles={styles.expandableViewStyle}
                type="table"
              />
            ))}
          </View>
        ) : (
          <View
            style={{
              marginVertical: RFPercentage(1),
              flex: 1,
              position: 'relative',
            }}>
            <View style={styles.activitySummaryWrapper}>
              <NewMonthPicker
                visible={showMonthPicker}
                hideMonthPicker={hideMonthPicker}
                selectedDate={localAllocationMonth}
                setSelectedDate={setLocalAllocationMonth}
                maxDate={moment()}
                header="Allocation Month"
              />

              {Object.keys(activitySummary).map((data, i) => (
                <SummaryCard
                  value={data}
                  number={activitySummary?.[data]}
                  key={i}
                  notCapitalize
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      {floatingButton}
    </View>
  );
}

const styles = StyleSheet.create({
  activitySummaryWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#F6F8FB',
  },
  expandableViewStyle: {
    backgroundColor: '#fff',
    elevation: 1,
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  floatingButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: RFPercentage(1),
    paddingTop: RFPercentage(2),
    width: '100%',
  },
  imageWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 250,
    justifyContent: 'center',
    width: '100%',
  },
  monthPickerContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: RFPercentage(3),
    marginVertical: RFPercentage(1),
    minWidth: RFPercentage(14),
  },
  monthText: {
    color: '#043E90',
    marginRight: 5,
  },
  nameContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: RFPercentage(1),
    bottom: RFPercentage(1.4),
    left: 0,
    marginLeft: RFPercentage(1.8),
    padding: RFPercentage(1.2),
    position: 'absolute',
  },
  text: {
    color: '#fff',
    marginBottom: RFPercentage(0.2),
  },
});
