import { RequestMethods } from '../../enums';
import { AuthData } from '../../types';
import Urls from '../constants/Urls';
import { apiRequest } from './apiRequest';

const { FOS_SERVICE_BASE_URL, RECOVERY_SERVICE_BASE_URL } = Urls;

export const submitForm = async (data: any, authData?: AuthData) => {
    const newForm = new FormData();
    for (let key in data) {
        newForm.append(key, data[key]);
    }
    const url = `${FOS_SERVICE_BASE_URL}/visit/close`;
    try {
        const response = await apiRequest({
            url,
            body: newForm,
            method: RequestMethods.patch,
            headers: {
                authenticationtoken: authData?.authenticationtoken,
                'Content-Type': 'multipart/form-data'
            }
        });
        return { response, visit_id: data.visit_id };
    } catch (e) {
        throw { response: e, visit_id: data.visit_id };
    }
};

export const makePrimaryAddressApiSync = async (
    data: any,
    allocationMonth: string,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/fos/allocation/address-data`;
    const apiData: any = {
        address_index: parseInt(data?.addressIndex ?? -1),
        address_type: data?.addressType,
        allocation_month: allocationMonth,
        applicant_type: data?.applicantType,
        loan_id: data?.loanId,
        company_id: authData?.company_id,
        applicant_index: data?.applicantIndex
    };
    try {
        const response = await apiRequest({
            method: RequestMethods.patch,
            url,
            body: apiData,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });
        return { response, loan_id: data?.loanId };
    } catch (e) {
        throw { response: e, loan_id: data?.loanId };
    }
};

export const updateContactDetailsSync = async (
    loan_id: string,
    data: any,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/loan/${loan_id}?company_id=${authData?.company_id}`;
    try {
        const response = await apiRequest({
            url,
            method: RequestMethods.patch,
            body: data,
            headers: {
                authenticationtoken: authData?.authenticationtoken,
                role: authData?.role
            }
        });
        return { response, loan_id };
    } catch (e) {
        console.log(e.response.data);
        throw { response: e, loan_id };
    }
};
