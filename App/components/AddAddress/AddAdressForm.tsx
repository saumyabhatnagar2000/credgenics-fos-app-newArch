import React, {useState} from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import InputWithLabel from '../common/InputWithLabel';
import Colors from '../../constants/Colors';
import {Button} from '@rneui/base';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../ui/Typography';

import {HomeIcon, OtherIcon, WorkIcon} from '../common/Icons/AddressIcons';
import {Formik} from 'formik';
import {CheckBox} from '@rneui/base';
import {CustomDropDown} from '../common/DropDown';
import {
  addAddressApiCall,
  addressToCoordinateApiCall,
  makePrimaryAddressApiCall,
} from '../../services/addressService';
import {useAuth} from '../../hooks/useAuth';
import {useNavigation} from '@react-navigation/native';
import {ApplicantTypes, CurrencyTypes} from '../../../enums';
import {CustomActivityIndicator} from '../placeholders/CustomActivityIndicator';
import {useAction} from '../../hooks/useAction';
import {SOMETHING_WENT_WRONG} from '../../constants/constants';
import useLoanDetails from '../../hooks/useLoanData';
import {getAddressDataKey} from '../../constants/Keys';

export const AddAddressForm = ({
  applicantType,
  loanId,
  addressIndex,
  applicantIndex,
  loanData,
}: any) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Other', value: 'Other', icon: () => <OtherIcon />},
    {label: 'Home', value: 'Home', icon: () => <HomeIcon />},
    {label: 'Work', value: 'Work', icon: () => <WorkIcon />},
  ]);
  const [primaryAddress, setPrimaryAddress] = useState(false);
  const {authData, currencySymbol} = useAuth();
  const [values, setValues] = useState('Other');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {selectedLoanData, setLoanDetailMap, loanDetailMap} = useLoanDetails();
  let tempAddressIndex = addressIndex;
  const allocationMonth = selectedLoanData.allocation_month;
  const {setNewAddressAdded} = useAction();

  const onClickSubmit = async (data: any) => {
    setLoading(true);
    const apidData = {
      applicant_address_text: `${data?.houseNumber} ${
        data?.floor ? data?.floor + ',' : ''
      }${data?.towerName}`,
      applicant_address_type: data.addressType,
      applicant_city: data.city,
      applicant_state: data.state,
      applicant_pincode: parseInt(data.pincode),
      applicant_landmark: data.landmark,
    };

    try {
      const apiResponse = await addAddressApiCall(
        apidData,
        applicantType,
        applicantIndex,
        loanId,
        authData,
      );
      if (apiResponse) {
        if (primaryAddress) {
          if (applicantType == ApplicantTypes.applicant) {
            tempAddressIndex = apiResponse?.data?.address_index;
          } else if (applicantType == ApplicantTypes.co_applicant) {
            tempAddressIndex = addressIndex + 1;
          }
          const primaryApiData: any = {
            applicantIndex: applicantIndex,
            addressIndex: tempAddressIndex,
            loanId: loanId,
            addressType: apidData.applicant_address_type,
            applicantType: applicantType,
          };
          const addressToCoordinateData: any = {
            applicantIndex: applicantIndex,
            addressIndex: tempAddressIndex,
            loanId: loanId,
            address: `${apidData.applicant_address_text},${data?.city}${data?.landmark} ,${data?.state} ${data?.pincode}`,
            addressType: apidData.applicant_address_type,
          };

          try {
            const primaryApiResponse = await makePrimaryAddressApiCall(
              primaryApiData,
              allocationMonth,
              authData,
            );
            if (primaryApiResponse) {
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
                ['address_index']: tempAddressIndex,
              };
              setNewAddressAdded(prev => !prev);
              setLoanDetailMap({
                [selectedLoanData.loan_id]: {
                  ...loanDetailMap[selectedLoanData.loan_id],
                  [getAddressDataKey(selectedLoanData.allocation_month)]:
                    tempAddressData,
                },
              });
            }
          } catch {
            ToastAndroid.show('Some error occurred', ToastAndroid.SHORT);
          }
          try {
            addressToCoordinateApiCall(
              addressToCoordinateData,
              applicantType,
              authData,
            );
          } catch (e) {}
        }

        navigation.reset({
          index: 1,
          routes: [
            {
              name: 'Drawer',
            },
            {
              name: 'PortfolioDetailScreen',
            },
          ],
        });
        ToastAndroid.show('Address Added Successfully', ToastAndroid.SHORT);
      }
    } catch (e) {
      ToastAndroid.show(SOMETHING_WENT_WRONG, ToastAndroid.SHORT);
    }
    setLoading(false);
  };
  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <CustomActivityIndicator />
      </View>
    );
  return (
    <>
      <View style={styles.containerStyle}>
        <Formik
          initialValues={{
            houseNumber: '',
            towerName: '',
            floor: '',
            city: '',
            state: '',
            landmark: '',
            pincode: '',
            addressType: 'Other',
          }}
          onSubmit={async (values, formikActions) => {
            onClickSubmit(values);
            formikActions.setSubmitting(false);
          }}
          validate={values => {
            let errors = {};
            if (!values.houseNumber) {
              errors.houseNumber = 'House Number Required*';
            } else if (!values.towerName)
              errors.towerName = ' Tower Name Required*';
            else if (!values.city) errors.city = 'City Required*';
            else if (!values.state) errors.state = 'State Required*';
            else if (!values.pincode) errors.pincode = 'Pincode Required*';
            else if (
              (currencySymbol == CurrencyTypes.rs &&
                values.pincode.length != 6) ||
              (currencySymbol == CurrencyTypes.rp && values.pincode.length != 5)
            )
              errors.pincode = 'Invalid Pincode*';
            return errors;
          }}>
          {props => (
            <View>
              {props.touched.houseNumber && props.errors.houseNumber ? (
                <Typography
                  style={styles.error}
                  variant={TypographyVariants.caption}>
                  {props.errors.houseNumber}
                </Typography>
              ) : null}
              <InputWithLabel
                placeholder="House/Flat Number*"
                inputContainerStyle={styles.inputContainer}
                containerStyle={{height: 58}}
                value={props.values.houseNumber}
                setText={props.handleChange('houseNumber')}
              />

              <InputWithLabel
                placeholder="Floor"
                inputContainerStyle={styles.inputContainer}
                containerStyle={{height: 58}}
                value={props.values.floor}
                setText={props.handleChange('floor')}
              />
              {props.touched.towerName && props.errors.towerName ? (
                <Typography
                  style={styles.error}
                  variant={TypographyVariants.caption}>
                  {props.errors.towerName}
                </Typography>
              ) : null}
              <InputWithLabel
                placeholder="Tower/Block/Street Name*"
                inputContainerStyle={styles.inputContainer}
                containerStyle={{height: 58}}
                value={props.values.towerName}
                setText={props.handleChange('towerName')}
              />
              {props.touched.city && props.errors.city ? (
                <Typography
                  style={styles.error}
                  variant={TypographyVariants.caption}>
                  {props.errors.city}
                </Typography>
              ) : null}
              <InputWithLabel
                placeholder="City*"
                inputContainerStyle={styles.inputContainer}
                containerStyle={{height: 58}}
                value={props.values.city}
                setText={props.handleChange('city')}
              />
              {props.touched.state && props.errors.state ? (
                <Typography
                  style={styles.error}
                  variant={TypographyVariants.caption}>
                  {props.errors.state}
                </Typography>
              ) : null}
              <InputWithLabel
                placeholder="State*"
                inputContainerStyle={styles.inputContainer}
                containerStyle={{height: 58}}
                value={props.values.state}
                setText={props.handleChange('state')}
              />

              <InputWithLabel
                placeholder="Landmark"
                inputContainerStyle={styles.inputContainer}
                containerStyle={{height: 58}}
                value={props.values.landmark}
                setText={props.handleChange('landmark')}
              />
              {props.touched.pincode && props.errors.pincode ? (
                <Typography
                  style={styles.error}
                  variant={TypographyVariants.caption}>
                  {props.errors.pincode}
                </Typography>
              ) : null}
              <InputWithLabel
                placeholder="Pincode*"
                inputContainerStyle={styles.inputContainer}
                containerStyle={{height: 58}}
                keyboardType="numeric"
                value={props.values.pincode}
                setText={props.handleChange('pincode')}
              />

              <CustomDropDown
                open={open}
                setOpen={setOpen}
                items={items}
                values={values}
                setItems={setItems}
                setValues={setValues}
                onChangeValue={props.handleChange('addressType')}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <CheckBox
                  center
                  title="Use this as customer's updated address"
                  checked={primaryAddress}
                  onPress={() => setPrimaryAddress(!primaryAddress)}
                  fontFamily={TypographyFontFamily.medium}
                  textStyle={styles.checkboxText}
                  checkedColor="#043E90"
                  containerStyle={styles.checkboxContainer}
                />
              </View>

              <Button
                title="Add Address"
                containerStyle={styles.buttonContainer}
                titleStyle={{
                  fontFamily: TypographyFontFamily.normal,
                  fontSize: RFPercentage(2),
                }}
                onPress={props.handleSubmit}
                loading={props.isSubmitting}
                disabled={props.isSubmitting}
              />
            </View>
          )}
        </Formik>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#043E90',
    borderRadius: 4,
    height: RFPercentage(5.9),
    justifyContent: 'center',
    marginVertical: RFPercentage(2),
    width: RFPercentage(19),
  },
  checkboxContainer: {
    backgroundColor: '#f6f8fb',
    borderWidth: 0,
  },
  checkboxText: {
    color: '#043E90',
    fontSize: RFPercentage(1.8),
    fontWeight: 'normal',
  },
  containerStyle: {
    backgroundColor: '#f6f8fb',
    flex: 1,
    paddingVertical: RFPercentage(2),
  },
  error: {
    color: 'red',
    marginBottom: RFPercentage(0.3),
    marginHorizontal: RFPercentage(1.6),
  },
  inputContainer: {
    backgroundColor: Colors.table.grey,
    borderColor: Colors.common.blue,
    borderRadius: 8,
    borderWidth: 1,
    height: 45,
    margin: 0,
    paddingHorizontal: RFPercentage(1),
  },
  loadingContainer: {
    backgroundColor: '#f6f8fb',
    flex: 1,
    justifyContent: 'center',
  },
});
