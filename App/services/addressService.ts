import { AuthData } from './../../types';
import Urls from '../constants/Urls';
import { apiRequest } from './apiRequest';
import { RequestMethods } from '../../enums';

const { RECOVERY_SERVICE_BASE_URL } = Urls;

export const addressToCoordinateApiCall = async (
    data: any,
    applicantType: string,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/address_to_coordinates?company_id=${authData.company_id}&source=recovery&applicant_type=${applicantType}&fos_primary_address=true`;
    const apiData = {
        applicant_index: parseInt(data?.applicantIndex) ?? null,
        address_index: parseInt(data.addressIndex),
        loan_id: data.loanId,
        address_type: data.addressType,
        address: data?.address
    };
    const headers = {
        authenticationtoken: authData?.authenticationtoken
    };
    const response = await apiRequest({
        method: RequestMethods.post,
        url,
        body: apiData,
        headers
    });

    return response;
};

export const addAddressApiCall = async (
    data: any,
    applicantType: string,
    applicantIndex: string,
    loanId: string,
    authData?: AuthData
) => {
    const apiData = {
        applicant_index: applicantIndex ?? null,
        addresses: [data],
        applicant_type: applicantType,
        company_id: authData?.company_id
    };
    const paramLoanId = encodeURIComponent(loanId);
    const url = `${RECOVERY_SERVICE_BASE_URL}/loan/address/${paramLoanId}`;
    const headers = {
        authenticationtoken: authData?.authenticationtoken
    };
    const response = await apiRequest({
        method: RequestMethods.post,
        url,
        body: apiData,
        headers
    });
    return response;
};

export const makePrimaryAddressApiCall = async (
    data: any,
    allocationMonth: string,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/fos/allocation/address-data`;
    const apiData: any = {
        address_index: parseInt(data?.addressIndex ?? 0),
        address_type: data?.addressType,
        allocation_month: allocationMonth,
        applicant_type: data?.applicantType,
        loan_id: data?.loanId,
        company_id: authData?.company_id,
        applicant_index: data?.applicantIndex ?? -1
    };
    const response = await apiRequest({
        method: RequestMethods.patch,
        url,
        body: apiData,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};
