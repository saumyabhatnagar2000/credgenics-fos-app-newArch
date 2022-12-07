import React from 'react';
import {Modal, Portal} from 'react-native-paper';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../../ui/Typography';
import {RFPercentage} from 'react-native-responsive-fontsize';
import MonthPicker from 'react-native-month-picker';
import {StyleSheet, View} from 'react-native';
import {Icon} from '@rneui/base';
import Colors, {BLUE_DARK, GREY} from '../../../constants/Colors';
import {NewMonthPickerType} from '../../../../types';
import moment, {Moment} from 'moment';

export const NewMonthPicker = ({
  visible,
  hideMonthPicker,
  selectedDate,
  setSelectedDate,
  maxDate,
  minDate,
  header,
}: NewMonthPickerType) => {
  const changeMonth = (selectedMonth: Moment) => {
    setSelectedDate(moment(selectedMonth, 'YYYY-M-DD').format('YYYY-M-DD'));
    hideMonthPicker();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {
          hideMonthPicker();
        }}
        contentContainerStyle={styles.containerStyle}>
        <View>
          <Typography variant={TypographyVariants.title} style={styles.header}>
            {header}
          </Typography>
        </View>

        <MonthPicker
          selectedDate={moment(selectedDate, 'YYYY-M-DD')}
          onMonthChange={(month: Moment) => changeMonth(month)}
          minDate={minDate}
          maxDate={maxDate}
          containerStyle={styles.monthContainerStyle}
          separatorColor={BLUE_DARK}
          selectedBackgroundColor={BLUE_DARK}
          selectedMonthTextStyle={styles.selectedMonthText}
          monthTextStyle={styles.monthText}
          yearTextStyle={styles.yearText}
          currentMonthTextStyle={{color: BLUE_DARK}}
          monthDisabledStyle={{color: GREY}}
          prevIcon={
            <Icon name="caret-back-outline" type="ionicon" color={BLUE_DARK} />
          }
          nextIcon={
            <Icon
              name="caret-forward-outline"
              type="ionicon"
              color={BLUE_DARK}
            />
          }
        />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    justifyContent: 'flex-start',
    paddingTop: RFPercentage(1),
    width: '80%',
  },
  header: {
    fontFamily: TypographyFontFamily.heavy,
    fontSize: RFPercentage(2.8),
    marginTop: RFPercentage(2),
    textAlign: 'center',
  },
  monthContainerStyle: {
    borderRadius: 10,
    marginBottom: RFPercentage(1.6),
    marginTop: RFPercentage(0.7),
    paddingVertical: RFPercentage(1),
  },
  monthText: {
    color: BLUE_DARK,
    fontFamily: TypographyFontFamily.heavy,
    fontSize: RFPercentage(2),
  },
  selectedMonthText: {
    color: Colors.light.background,
    fontFamily: TypographyFontFamily.normal,
    fontSize: RFPercentage(2),
  },
  yearText: {
    color: BLUE_DARK,
    fontFamily: TypographyFontFamily.heavy,
    fontSize: RFPercentage(2.5),
  },
});
