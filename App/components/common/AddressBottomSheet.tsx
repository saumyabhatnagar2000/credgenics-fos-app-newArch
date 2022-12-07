import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, ToastAndroid, TouchableOpacity, View} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../ui/Typography';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Portal} from 'react-native-paper';
import {BottomSheetHandle} from './Icons/BottomSheetHandle';
import {AddIcon} from './Icons/AddIcon';
import DashedLine from 'react-native-dashed-line';
import {useNavigation, useRoute} from '@react-navigation/native';
import {HomeIcon, OtherIcon, WorkIcon} from './Icons/AddressIcons';
import {Button} from '@rneui/base';
import {ScrollView} from 'react-native-gesture-handler';
import {
  addressToCoordinateApiCall,
  makePrimaryAddressApiCall,
} from '../../services/addressService';
import {useAuth} from '../../hooks/useAuth';
import {ChevronDown} from './Icons/ChevronDown';
import {ChevronUp} from './Icons/ChevronUp';
import {convertIntoBase64, getAddress} from '../../services/utils';
import {useTaskAction} from '../../hooks/useTaskAction';
import {MapIcon} from './Icons/Map';
import {startNavigation} from '../../services/utils';
import {CustomActivityIndicator} from '../placeholders/CustomActivityIndicator';
import {TaskDetailsEventTypes} from '../../constants/Events';
import {useMixpanel} from '../../contexts/MixpanelContext';
import useCommon from '../../hooks/useCommon';
import useLoanDetails from '../../hooks/useLoanData';
import {getAddressDataKey} from '../../constants/Keys';
import OnlineOnly from '../OnlineOnly';

const getAddressIcon = (addressType?: string) => {
  addressType = addressType ?? '';
  if (addressType.toLowerCase() === 'home') return <HomeIcon />;
  else if (addressType.toLowerCase() === 'work') return <WorkIcon />;
  else return <OtherIcon />;
};

export const AddressBottomSheet = React.forwardRef((props: any, ref) => {
  const {authData} = useAuth();
  let {
    data,
    applicantType,
    applicantIndex = -1,
    loanId,
    addressIndex,
    loanData,
  } = props;

  const {setUpdatedAddressIndex} = useTaskAction();
  const navigation = useNavigation();
  const {logEvent} = useMixpanel();
  const route = useRoute();
  1;
  const {
    selectedLoanData,
    loanDetailMap,
    setLoanDetailMap,
    setLoanDetailsOfflineObj,
    loanDetailOfflineObj,
  } = useLoanDetails();
  const {isInternetAvailable} = useCommon();
  const SavedAddress = data?.other_addresses ?? [];
  const snapPoints = useMemo(() => ['70%'], []);
  const lastVisited = data?.last_location;
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      setScrollable(false);
      setFilteredData(SavedAddress.slice(0, 2));
    } else if (index == 0) {
      setFilteredData(SavedAddress.slice(0, 2));
    }
  };

  const renderBackdrop = useCallback(props => {
    setFilteredData(SavedAddress.slice(0, 2));
    return <BottomSheetBackdrop disappearsOnIndex={-1} {...props} />;
  }, []);

  const [FilteredData, setFilteredData] = useState<Array<Object>>(
    SavedAddress.slice(0, 2),
  );

  const [scrollable, setScrollable] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCLickMapIcon = (address: any) => {
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
  const onClickLastVisited = (address: any) => {
    if (address) {
      let destination = address?.marked_location;
      let destinationCoordinates = '';
      if (destination && destination?.longitude && destination?.latitude) {
        const latitude = destination?.latitude;
        const longitude = destination?.longitude;
        destinationCoordinates = `${latitude},${longitude}`;
      }
      if (destinationCoordinates) {
        startNavigation(destinationCoordinates);
      } else {
        ToastAndroid.show('No Address found!', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('No Address found!', ToastAndroid.SHORT);
    }
  };

  const onClickAddAddress = () => {
    navigation.navigate('AddAddressScreen', {
      applicantType,
      loanId: loanId,
      addressIndex: addressIndex,
      applicantIndex: applicantIndex,
      loanData,
    });
    ref?.current?.close();
  };

  const onClickAddress = async (data: any) => {
    if (selectedLoanData.allocation_month == 'Overall') {
      ToastAndroid.show(
        `Address cannot be made primary at ‘Overall’ allocation month, please select an individual month.`,
        ToastAndroid.LONG,
      );
      return;
    }
    setLoading(true);
    const primaryApiData: any = {
      applicantIndex: applicantIndex,
      addressIndex: data?.address_id,
      loanId: loanId,
      addressType: data?.address_type,
      applicantType: applicantType,
    };
    const addressToCoordinateData: any = {
      applicantIndex: applicantIndex,
      addressIndex: data?.address_id,
      loanId: loanId,
      address: `${data?.address_text},${data?.city}${data?.landmark} ,${data?.state} ${data?.pincode}`,
      addressType: data?.address_type,
    };
    if (data?.latitude && data?.longitude) {
      try {
        const apiResponse = await makePrimaryAddressApiCall(
          primaryApiData,
          selectedLoanData.allocation_month,
          authData,
        );
        if (apiResponse || !isInternetAvailable) {
          logEvent(TaskDetailsEventTypes.address_change, route.name, {
            success: true,
            value: {
              message: apiResponse?.data?.message ?? '',
            },
            old_address: {
              address_index: addressIndex,
            },
            new_address: {
              address_index: data?.address_id,
              latitude: data?.latitude ?? 0,
              longitude: data?.longitude ?? 0,
            },
          });
          ToastAndroid.show(
            'Default Address Updated successfully',
            ToastAndroid.SHORT,
          );
          setUpdatedAddressIndex(data?.address_id);

          let tempAddressData =
            loanDetailMap[selectedLoanData.loan_id]?.[
              getAddressDataKey(selectedLoanData.allocation_month)
            ];
          tempAddressData = {
            ...tempAddressData,
            ['address_index']: data?.address_id,
          };
          setLoanDetailMap({
            [selectedLoanData.loan_id]: {
              ...loanDetailMap[selectedLoanData.loan_id],
              [getAddressDataKey(selectedLoanData.allocation_month)]:
                tempAddressData,
            },
          });
          if (!isInternetAvailable) {
            setLoanDetailsOfflineObj({
              [selectedLoanData.loan_id]: {
                ...loanDetailOfflineObj[selectedLoanData.loan_id],
                addressData: {
                  ...data,
                  applicantIndex: applicantIndex,
                  applicantType: applicantType,
                },
                allocationMonth: selectedLoanData.allocation_month,
              },
            });
          }
        }
      } catch (e: any) {
        logEvent(TaskDetailsEventTypes.address_change, route.name, {
          success: false,
          value: {
            message: e?.response?.data ?? '',
          },
        });
        ToastAndroid.show('Some error Occurred', ToastAndroid.SHORT);
      }
    } else {
      try {
        const [primaryApiResponse, addressToCoordinateResponse] =
          await Promise.all([
            makePrimaryAddressApiCall(
              primaryApiData,
              selectedLoanData.allocation_month,
              authData,
            ),
            addressToCoordinateApiCall(
              addressToCoordinateData,
              applicantType,
              authData,
            ),
          ]);

        if (
          (primaryApiResponse && addressToCoordinateResponse) ||
          !isInternetAvailable
        ) {
          setUpdatedAddressIndex(data?.address_id);
          logEvent(TaskDetailsEventTypes.address_change, route.name, {
            success: true,
            value: {
              message: primaryApiResponse?.data?.message ?? '',
            },
            old_address: {
              address_index: addressIndex,
            },
            new_address: {address_index: data?.id},
          });
          ToastAndroid.show(
            'Default Address Updated successfully',
            ToastAndroid.SHORT,
          );
          let tempAddressData =
            loanDetailMap[selectedLoanData.loan_id]?.[
              getAddressDataKey(selectedLoanData.allocation_month)
            ];
          tempAddressData = {
            ...tempAddressData,
            ['address_index']: data?.address_id,
          };
          setLoanDetailMap({
            [selectedLoanData.loan_id]: {
              ...loanDetailMap[selectedLoanData.loan_id],
              [getAddressDataKey(selectedLoanData.allocation_month)]:
                tempAddressData,
            },
          });
          if (!isInternetAvailable) {
            setLoanDetailsOfflineObj({
              [selectedLoanData.loan_id]: {
                ...loanDetailOfflineObj[selectedLoanData.loan_id],
                addressData: {
                  ...data,
                  applicantIndex: applicantIndex,
                  applicantType: applicantType,
                },
                allocationMonth: selectedLoanData.allocation_month,
              },
            });
          }
        }
      } catch (e: any) {
        logEvent(TaskDetailsEventTypes.address_change, route.name, {
          success: false,
          value: {
            message: e?.response?.data ?? '',
          },
        });
        ToastAndroid.show('Some error Occurred', ToastAndroid.SHORT);
      }
      addressToCoordinateApiCall(
        addressToCoordinateData,
        applicantType,
        authData,
      );
    }
    setLoading(false);
    ref?.current?.close();
  };
  const expandSheet = () => {
    setScrollable(true);
    setFilteredData(SavedAddress);
  };
  const collapseSheet = () => {
    setScrollable(false);
    setFilteredData(SavedAddress.slice(0, 2));
  };
  const SavedAddressRow = ({
    data,
    index,
    type,
  }: {
    data: any;
    index: number;
    type?: string;
  }) => {
    const convertedOtherAddress = getAddress(applicantType, data);
    return (
      <>
        {index != 0 ? <View style={styles.lineStyle} /> : null}
        <View
          style={{
            marginHorizontal: RFPercentage(1),
            flexDirection: 'row',
          }}>
          <View style={{flexDirection: 'row', flex: 8}}>
            <TouchableOpacity
              style={styles.addressCard}
              onPress={() =>
                !(type == 'primary')
                  ? onClickAddress(convertedOtherAddress)
                  : null
              }>
              <View style={styles.addressHeader}>
                {getAddressIcon(convertedOtherAddress?.address_type)}
                <Typography
                  variant={TypographyVariants.body1}
                  style={{marginLeft: RFPercentage(0.7)}}>
                  {convertedOtherAddress?.address_type ?? 'Other'}
                </Typography>
              </View>
              <Typography
                style={styles.addressText}
                variant={TypographyVariants.body2}>
                {convertedOtherAddress?.address_text
                  ? `${
                      convertedOtherAddress?.address_text
                        ? convertedOtherAddress?.address_text + ','
                        : ''
                    } ${
                      convertedOtherAddress?.city
                        ? convertedOtherAddress?.city + ','
                        : ''
                    } ${
                      convertedOtherAddress?.landmark
                        ? convertedOtherAddress?.landmark + ','
                        : ''
                    } ${
                      convertedOtherAddress?.state
                        ? convertedOtherAddress?.state + ','
                        : ''
                    } ${convertedOtherAddress?.pincode ?? ''}`
                  : `${
                      convertedOtherAddress?.latitude
                        ? convertedOtherAddress?.latitude + ','
                        : ''
                    } ${
                      convertedOtherAddress?.longitude
                        ? convertedOtherAddress?.longitude + ','
                        : ''
                    }`}
              </Typography>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => onCLickMapIcon(convertedOtherAddress)}
            style={styles.mapIconContainer}>
            <MapIcon color="#043E90" size={17} />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <Portal>
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enableHandlePanningGesture={false}
        handleComponent={() => {
          return (
            <View style={styles.handleComponent}>
              <BottomSheetHandle />
            </View>
          );
        }}
        style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <CustomActivityIndicator />
          </View>
        ) : (
          <BottomSheetScrollView scrollEnabled={true}>
            <View
              style={{
                paddingHorizontal: RFPercentage(0.8),
              }}>
              <OnlineOnly>
                <TouchableOpacity
                  style={styles.addAddressContainer}
                  onPress={onClickAddAddress}>
                  <AddIcon />
                  <Typography style={styles.addAddressText}>
                    Add Address
                  </Typography>
                </TouchableOpacity>
              </OnlineOnly>
              <DashedLine
                style={{
                  marginVertical: RFPercentage(1.2),
                }}
                dashThickness={1}
                dashGap={4}
                dashColor="#043E90"
              />
              <Typography style={styles.addressHeaderText}>
                Primary Address
              </Typography>
              <SavedAddressRow type="primary" data={data?.primary} index={0} />

              {!!lastVisited?.visit_date ? (
                <View style={styles.addressCard}>
                  <Typography style={styles.addressHeaderText}>
                    {`Last Visited on ${lastVisited?.visit_date ?? ''} `}
                  </Typography>

                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.lastVisitedCard}>
                      <Typography
                        style={styles.addressText}
                        variant={TypographyVariants.body2}>
                        {lastVisited?.marked_location.latitude + ',' ?? ' '}{' '}
                        {lastVisited?.marked_location?.longitude ?? ' '}
                      </Typography>
                    </View>

                    <TouchableOpacity
                      onPress={() => onClickLastVisited(data?.last_location)}
                      style={styles.mapIconContainer}>
                      <MapIcon size={17} color="#043E90" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <Typography style={styles.addressHeaderText}>
                    No Last Visit Data Found
                  </Typography>
                </View>
              )}
              <DashedLine
                style={{
                  marginTop: RFPercentage(2),
                }}
                dashThickness={0.3}
                dashGap={4}
                dashColor="#4366AD"
              />
              <View style={{flex: 1, flexGrow: 1}}>
                {SavedAddress?.length > 0 ? (
                  <Typography
                    style={[
                      styles.addressHeaderText,
                      {fontSize: RFPercentage(2.1)},
                    ]}>
                    Other Addresses
                  </Typography>
                ) : null}
                <ScrollView scrollEnabled={scrollable}>
                  {FilteredData.map((item: any, index: number) => {
                    return <SavedAddressRow index={index} data={item} />;
                  })}
                </ScrollView>

                {SavedAddress.length > 0 ? (
                  <Button
                    onPress={!scrollable ? expandSheet : collapseSheet}
                    title={!scrollable ? 'See More' : 'See Less'}
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.buttonTitle}
                    iconRight
                    iconContainerStyle={{
                      marginLeft: RFPercentage(1),
                    }}
                    icon={!scrollable ? <ChevronDown /> : <ChevronUp />}
                  />
                ) : null}
              </View>
            </View>
          </BottomSheetScrollView>
        )}
      </BottomSheet>
    </Portal>
  );
});

const styles = StyleSheet.create({
  addAddressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  addAddressText: {
    fontFamily: TypographyFontFamily.heavy,
    fontSize: RFPercentage(2.2),
    marginLeft: RFPercentage(0.8),
  },
  addressCard: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical: RFPercentage(1.3),
  },
  addressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: RFPercentage(1),
  },
  addressHeaderText: {
    fontFamily: TypographyFontFamily.heavy,
    fontSize: RFPercentage(2.1),
    marginTop: RFPercentage(1.2),
  },
  addressText: {
    color: '#909195',
    lineHeight: RFPercentage(2.5),
  },
  buttonContainer: {
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderColor: '#909195',
    borderWidth: 0.5,
    height: RFPercentage(4.5),
    justifyContent: 'center',
    marginVertical: RFPercentage(2),
    width: RFPercentage(38),
  },
  buttonTitle: {
    alignSelf: 'center',
    color: '#043E90',
    fontFamily: TypographyFontFamily.normal,
    fontSize: RFPercentage(2),
    marginRight: RFPercentage(1),
  },
  contentContainer: {
    paddingHorizontal: RFPercentage(2),
  },
  handleComponent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: RFPercentage(2),
  },
  lastVisitedCard: {
    flexDirection: 'row',
    flex: 5,
    marginHorizontal: RFPercentage(1),
    marginTop: RFPercentage(1),
  },
  lineStyle: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: 0.5,
    width: '100%',
  },
  loadingContainer: {
    backgroundColor: '#f6f8fb',
    flex: 1,
    justifyContent: 'center',
  },
  mapIconContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
