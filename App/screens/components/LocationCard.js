import React from 'react';
import {StyleSheet, ToastAndroid, TouchableOpacity, View} from 'react-native';
import styles from '../styles/SliderEntry.style';
import Typography, {TypographyVariants} from '../../components/ui/Typography';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Icon} from '@rneui/base';
import {BLUE_DARK, BLUE_LIGHT, GREY} from '../../constants/Colors';
import {useAuth} from '../../hooks/useAuth';
import {formatDate, navigateToLocationOnMap} from '../../services/utils';
import {useNavigation} from '@react-navigation/native';
import {TaskTypes} from '../../../enums';
import useLoanDetails from '../../hooks/useLoanData';

function Options({item, visit, onCall, completedVisitData}) {
  const {navigate} = useNavigation();
  const {setSelectedLoanData} = useLoanDetails();

  const navigateToPoint = () =>
    navigateToLocationOnMap({
      latitude: item.latitude,
      longitude: item.longitude,
    });

  const call = () => onCall?.(item, visit);

  const isVisitCompleted = completedVisitData.find(
    _visit => _visit === item.visit_id,
  )
    ? true
    : false;

  const onVisit = () => {
    if (!isVisitCompleted) {
      setSelectedLoanData({...item});
      navigate('TaskDetailScreen', {
        taskType: TaskTypes.visit,
      });
    } else {
      ToastAndroid.showWithGravity(
        'This Visit is already submitted successfully',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
      }}>
      <TouchableOpacity onPress={call} style={stylesNew.option}>
        <Icon name="call" type="ionicon" color={BLUE_DARK} />
        <Typography color="black" variant={TypographyVariants.title1}>
          Call
        </Typography>
      </TouchableOpacity>
      <View
        style={{
          flex: 0.5,
        }}
      />
      <TouchableOpacity onPress={navigateToPoint} style={stylesNew.option}>
        <Icon name="navigate" type="ionicon" color={BLUE_DARK} />
        <Typography color="black" variant={TypographyVariants.title1}>
          Navigate
        </Typography>
      </TouchableOpacity>
      <View
        style={{
          flex: 0.5,
        }}
      />
      <TouchableOpacity
        onPress={onVisit}
        style={[
          stylesNew.option,
          {
            opacity: isVisitCompleted ? 0.2 : 1,
          },
        ]}>
        <Icon name="document-text" type="ionicon" color={BLUE_DARK} />
        <Typography color="black" variant={TypographyVariants.title1}>
          Visit
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

export default function LocationCard({
  data,
  visit,
  onCall,
  completedVisitData,
  allocation_month,
}) {
  const {getCurrencyString} = useAuth();
  const item = data;
  const scheduledDate = formatDate(item?.visit_date);
  return (
    <View style={[styles.slideInnerContainer, stylesNew.container]}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Typography
              variant={TypographyVariants.heading3}
              style={{marginRight: 10, marginVertical: 0}}>
              {item.applicant_name}
            </Typography>
            {/* <StatusCapsule title='PTP' /> */}
          </View>
          {/* <TouchableOpacity>
                        <Icon
                            name="chevron-forward-circle"
                            type="ionicon"
                            color={BLUE_DARK}
                        />
                    </TouchableOpacity> */}
        </View>
        <Typography
          style={{marginVertical: 1}}
          color={BLUE_LIGHT}
          variant={TypographyVariants.body2}>
          {item?.address}
        </Typography>
        <Typography
          style={{marginVertical: 1}}
          color={GREY}
          variant={TypographyVariants.caption1}>
          Loan ID:{item?.loan_id}
        </Typography>
        <Typography style={{marginTop: 4}} variant={TypographyVariants.title}>
          {getCurrencyString(item?.total_claim_amount)}
        </Typography>
      </View>
      <View>
        <Typography
          variant={
            TypographyVariants.body4
          }>{`Scheduled: ${scheduledDate}`}</Typography>
      </View>
      <View>
        <Options
          allocation_month={allocation_month}
          onCall={onCall}
          visit={visit}
          item={item}
          completedVisitData={completedVisitData}
        />
      </View>
    </View>
  );
}

const stylesNew = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 10,
    padding: RFPercentage(2),
    paddingBottom: RFPercentage(1.2),
    paddingHorizontal: RFPercentage(1.6),
  },
  option: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: RFPercentage(0.6),
  },
});
