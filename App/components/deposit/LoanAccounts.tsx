import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CheckBox} from '@rneui/base';
import {
  DepositFormRowDetailsType,
  LoanAccountType,
  PendingDepositType,
} from '../../../types';
import Colors, {BLUE_DARK} from '../../constants/Colors';
import {DepositFormRow} from '../common/ExpandableView/DepositFormRow';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../ui/Typography';

const StatusSelector = ({
  item,
  statusList,
  onStatusSelected,
}: {
  item: PendingDepositType;
  statusList: Array<string>;
  onStatusSelected: (item: PendingDepositType, text: string) => void;
}) => {
  return (
    <View
      style={{
        marginVertical: RFPercentage(1),
        backgroundColor: Colors.table.grey,
      }}>
      {statusList.map(status => (
        <CheckBox
          iconRight={true}
          right={true}
          containerStyle={styles.checkboxContainer}
          checked={item.agent_marked_status === status}
          checkedColor={BLUE_DARK}
          title={<Text style={styles.displayText}>{status}</Text>}
          onPress={() => onStatusSelected(item, status)}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          size={16}
        />
      ))}
    </View>
  );
};

export default function LoanAccountsView({
  statusList,
  loanAccounts,
  setLoanAccounts,
  wasStatusAvailable,
}: LoanAccountType) {
  const onStatusSelected = (item: PendingDepositType, finalStatus: string) => {
    const loanIndex = loanAccounts.indexOf(item);
    loanAccounts[loanIndex].agent_marked_status = finalStatus;
    setLoanAccounts([...loanAccounts]);
  };

  return (
    <View style={styles.containerLoan}>
      {loanAccounts.map((item: PendingDepositType, inx) => {
        const dataItem = {
          loan_id: item.loan_id,
          deposit_amount: item.amount_recovered,
          agent_marked_status: item.agent_marked_status,
          length: inx,
        };

        let showOptions = false;
        if (wasStatusAvailable[item.visit_id] == null) showOptions = true;

        return (
          <>
            <DepositFormRow
              statusDisabled={!showOptions}
              dataDict={dataItem as DepositFormRowDetailsType}
            />
            {showOptions && (
              <View
                style={{
                  flexDirection: 'row',
                  padding: 2,
                  justifyContent: 'space-between',
                }}>
                <Typography variant={TypographyVariants.title1}>
                  Select Status
                </Typography>
                {statusList.length === 0 ? (
                  <Text style={styles.value}>Not Available</Text>
                ) : (
                  <StatusSelector
                    item={item}
                    statusList={statusList}
                    onStatusSelected={onStatusSelected}
                  />
                )}
              </View>
            )}
          </>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    backgroundColor: Colors.table.grey,
    borderColor: 'transparent',
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: 'white',
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  containerLoan: {
    backgroundColor: Colors.table.grey,
    marginTop: RFPercentage(2),
  },
  content: {
    color: 'green',
    fontSize: 20,
    fontWeight: '700',
    margin: 5,
    padding: 10,
    textAlign: 'center',
  },
  displayText: {
    color: BLUE_DARK,
    fontFamily: TypographyFontFamily.normal,
    fontSize: RFPercentage(2),
    marginRight: 2,
  },
  dropdownStyle: {
    backgroundColor: 'white',
    borderColor: '#e0e0e0',
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 20,
    padding: 5,
  },
  header: {
    color: 'black',
    fontFamily: 'poppins',
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    textAlign: 'center',
  },
  innerDropdownStyle: {
    backgroundColor: 'white',
  },
  itemContainer: {
    backgroundColor: 'white',
  },
  separator: {
    backgroundColor: '#e0e0e0',
    height: 1,
    width: '100%',
  },
  value: {
    flex: 1,
    fontFamily: 'poppins',
  },
});
