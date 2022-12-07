import React from 'react';
import { AddAddressForm } from '../components/AddAddress/AddAdressForm';
import CustomAppBar from '../components/common/AppBar';

export const AddAddressScreen = ({ route }) => {
    const { applicantType, loanId, addressIndex, applicantIndex, loanData } =
        route.params;
    return (
        <>
            <CustomAppBar title="Add Address" backButton />
            <AddAddressForm
                loanId={loanId}
                applicantType={applicantType}
                addressIndex={addressIndex}
                applicantIndex={applicantIndex}
                loanData={loanData}
            />
        </>
    );
};
