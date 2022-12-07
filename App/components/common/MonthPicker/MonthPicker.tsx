import * as React from 'react';
import {Button} from 'react-native-elements';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {MonthPickerType} from '../../../../types';
import {BLUE, BLUE_DARK} from '../../../constants/Colors';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../../ui/Typography';

export default function MonthPicker({
  allocationYear,
  allocationMonth,
  visible,
  setVisible,
  onSelected,
}: MonthPickerType) {
  const monthList = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const [month, setMonth] = React.useState(monthList[allocationMonth - 1]);
  const [year, setYear] = React.useState(allocationYear);

  React.useEffect(() => {
    setYear(allocationYear);
    setMonth(monthList[allocationMonth - 1]);
  }, [visible]);

  const onMonthSelected = (monthItem: string) => {
    const currentDate = new Date();
    if (
      currentDate.getFullYear() <= year &&
      currentDate.getMonth() < monthList.indexOf(monthItem)
    ) {
      return;
    }
    setMonth(monthItem);
    const index = monthList.indexOf(monthItem) + 1;
    onSelected(`${year}-${index}-01`);
    setTimeout(() => setVisible(false), 100);
  };

  const getMonthStyle = (monthItem: string) => {
    const currentDate = new Date();
    if (month === monthItem) return styles.selectedMonth;
    if (
      currentDate.getFullYear() === year &&
      currentDate.getMonth() < monthList.indexOf(monthItem)
    ) {
      return styles.disabledMonth;
    } else {
      return styles.monthText;
    }
  };
  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={true}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={styles.containerStyle}>
        <Typography
          style={styles.headerText}
          variant={TypographyVariants.title}>
          Allocation Month
        </Typography>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginBottom: RFPercentage(1.6),
          }}>
          <Button
            title="PREV"
            titleStyle={styles.buttonStyle}
            buttonStyle={{
              backgroundColor: BLUE,
              paddingHorizontal: RFPercentage(2.4),
            }}
            onPress={() => setYear(year - 1)}
          />
          <Typography
            variant={TypographyVariants.title}
            style={{flex: 1, textAlign: 'center'}}>
            {year}
          </Typography>
          <Button
            title="NEXT"
            titleStyle={styles.buttonStyle}
            buttonStyle={[
              year === new Date().getFullYear()
                ? {backgroundColor: 'gray'}
                : {backgroundColor: BLUE},
              {
                paddingHorizontal: RFPercentage(2.4),
              },
            ]}
            onPress={() => {
              if (year < new Date().getFullYear()) {
                setYear(year + 1);
              }
            }}
          />
        </View>
        <View style={styles.rowStyle}>
          {monthList.slice(0, 3).map(month => {
            const style = getMonthStyle(month);
            return (
              <TouchableOpacity
                key={month}
                onPress={() => onMonthSelected(month)}>
                <Typography style={style} variant={TypographyVariants.title1}>
                  {month}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.rowStyle}>
          {monthList.slice(3, 6).map(month => {
            const style = getMonthStyle(month);
            return (
              <TouchableOpacity
                key={month}
                onPress={() => onMonthSelected(month)}>
                <Typography style={style} variant={TypographyVariants.title1}>
                  {month}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.rowStyle}>
          {monthList.slice(6, 9).map(month => {
            const style = getMonthStyle(month);
            return (
              <TouchableOpacity
                key={month}
                onPress={() => onMonthSelected(month)}>
                <Typography style={style} variant={TypographyVariants.title1}>
                  {month}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.rowStyle}>
          {monthList.slice(9, 12).map(month => {
            const style = getMonthStyle(month);
            return (
              <TouchableOpacity
                key={month}
                onPress={() => onMonthSelected(month)}>
                <Typography style={style} variant={TypographyVariants.title1}>
                  {month}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    fontFamily: TypographyFontFamily.heavy,
    fontSize: RFPercentage(1.8),
  },
  containerStyle: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'flex-start',
    padding: RFPercentage(3),
    width: '80%',
  },
  disabledMonth: {
    color: 'gray',
    margin: 20,
  },
  headerText: {
    marginBottom: RFPercentage(3),
    textAlign: 'center',
  },
  monthText: {
    color: BLUE_DARK,
    margin: 20,
  },
  rowStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '96%',
  },
  selectedMonth: {
    backgroundColor: BLUE_DARK,
    borderRadius: RFPercentage(1),
    color: 'white',
    paddingHorizontal: RFPercentage(2),
    paddingVertical: RFPercentage(1.2),
  },
});
