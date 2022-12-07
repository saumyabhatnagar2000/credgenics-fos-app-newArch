import React from 'react';
import {Icon} from '@rneui/base';
import {StyleSheet, View} from 'react-native';
import {PendingDepositRowType} from '../../../types';
import {getOnlyDate} from '../../services/utils';
import {DepositTypes} from '../../../enums';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Typography, {TypographyVariants} from '../ui/Typography';
import {GREY} from '../../constants/Colors';
import CurrencyTypography from '../ui/CurrencyTypography';

export const DepositPendingRow = ({
  rowData,
  isOnline,
}: PendingDepositRowType): JSX.Element => {
  const icon =
    rowData.payment_method === DepositTypes.cheque
      ? rowData.checked
        ? 'radio-button-checked'
        : 'radio-button-off'
      : rowData.checked
      ? 'check-box'
      : 'check-box-outline-blank';

  return (
    <View style={{flexDirection: 'row', marginLeft: 10}}>
      {!isOnline && (
        <Icon
          name={icon}
          type="material"
          color={rowData.checked ? '#2C68B2' : 'gray'}
          style={{margin: 10, marginLeft: 0}}
        />
      )}
      <View style={styles.container}>
        <View style={styles.toprow}>
          <View style={{flex: 3}}>
            <Typography
              variant={TypographyVariants.title1}
              style={styles.heading}>
              {rowData.applicant_name ?? 'NA'}
            </Typography>

            <Typography
              style={styles.textSecondary}
              variant={TypographyVariants.caption1}>
              Visit ID : {rowData.visit_id ? rowData.visit_id : 'NA'}
            </Typography>
            <Typography
              style={{marginTop: RFPercentage(0.5)}}
              variant={TypographyVariants.caption1}>
              {`${getOnlyDate(rowData.created)}  |  ${rowData.loan_id}`}
            </Typography>
          </View>
          <CurrencyTypography
            amount={rowData.amount_recovered}
            variant={TypographyVariants.title1}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: RFPercentage(1),
  },
  heading: {
    paddingVertical: 2,
  },
  textSecondary: {
    color: GREY,
    marginTop: RFPercentage(0.4),
  },
  toprow: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
