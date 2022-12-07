import * as React from 'react';
import {Divider} from '@rneui/base';
import CustomAppBar from '../../components/common/AppBar';
import DepositBranchList from '../../components/deposit/DepositBranchList';

export default function DepositBranchScreen({route}: any) {
  const {branchType, companyBranch, bankBranch} = route.params;
  return (
    <>
      <CustomAppBar
        title={`Select ${branchType} branch`}
        search={false}
        options={false}
        calendar={false}
        notifications={false}
        backButton={true}
        add={false}
        sort={false}
        filter={false}
      />
      <Divider />
      <DepositBranchList
        companyBranch={companyBranch}
        bankBranch={bankBranch}
        branchType={branchType}
      />
    </>
  );
}
