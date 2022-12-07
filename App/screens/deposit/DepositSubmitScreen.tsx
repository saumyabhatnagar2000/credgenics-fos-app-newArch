import * as React from 'react';
import {Divider} from '@rneui/base';
import CustomAppBar from '../../components/common/AppBar';
import DepositSubmit from '../../components/deposit/DepositSubmit';

export default function DepositSubmitScreen({route}) {
  const {
    loan_ids,
    amount,
    recovery_method,
    redeposit = false,
    data = {},
  } = route.params;
  return (
    <>
      <CustomAppBar
        title="Deposit collection"
        search={false}
        options={false}
        calendar={false}
        notifications={false}
        backButton={true}
        filter={false}
        add={false}
        sort={false}
      />
      <Divider />
      <DepositSubmit
        loan_ids={loan_ids}
        amount={amount}
        recovery_method={recovery_method}
        redeposit={redeposit}
        data={data}
      />
    </>
  );
}
