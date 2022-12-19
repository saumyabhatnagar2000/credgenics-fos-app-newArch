import {
    BankBranchType,
    FilterDepositTypes,
    RequestMethods
} from '../../enums';
import Urls from '../constants/Urls';
import { AuthData, DepositSubmitIdType, MakeDepositType } from './../../types';
import { apiRequest } from './apiRequest';
import {
    getMonthEndDateMaxToday,
    getMonthStartDate,
    getToday,
    getWeekEndDateMaxToday,
    getWeekStartDate
} from './utils';

const { FOS_SERVICE_BASE_URL, RECOVERY_SERVICE_BASE_URL } = Urls;

export const loadPendingDepostList = async (
    filter: FilterDepositTypes,
    authData?: AuthData
) => {
    let firstDate: string = '';
    let lastDate: string = '';

    if (filter === FilterDepositTypes.today) {
        firstDate = getToday();
        lastDate = getToday();
    } else if (filter === FilterDepositTypes.this_week) {
        firstDate = getWeekStartDate();
        lastDate = getWeekEndDateMaxToday();
    } else if (filter === FilterDepositTypes.this_month) {
        firstDate = getMonthStartDate();
        lastDate = getMonthEndDateMaxToday();
    }

    try {
        const url = `${FOS_SERVICE_BASE_URL}/deposit/pending?company_id=${
            authData?.company_id
        }${firstDate.length > 0 ? `&first_date=${firstDate}` : ''}${
            lastDate.length > 0 ? `&last_date=${lastDate}` : ''
        }`;
        const apiResponse = await apiRequest({
            url,
            headers: {
                authenticationtoken: authData?.authenticationtoken,
                role: authData?.role
            }
        });
        if (apiResponse) {
            return apiResponse;
        }
    } catch (error) {}
    return [];
};

export const loadDepostList = async (authData?: AuthData) => {
    try {
        const url = `${FOS_SERVICE_BASE_URL}/deposit?company_id=${authData?.company_id}`;
        const apiResponse = await apiRequest({
            url,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });

        if (apiResponse) {
            const pendindDeposits = apiResponse?.data;
            return pendindDeposits;
        }
    } catch (error) {}
    return [];
};

export const loadDepostHistory = async (
    deposit_id: string,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/deposit/track?company_id=${authData?.company_id}&deposit_id=${deposit_id}`;
    const apiResponse = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    if (apiResponse) return apiResponse;
};

export const updateDepositId = async (
    visit_ids: Array<DepositSubmitIdType>,
    deposit_id: string,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/visit/deposit/update`;
    let data = {
        company_id: authData?.company_id,
        deposit_id: deposit_id,
        visits: visit_ids
    };
    const response = await apiRequest({
        url,
        method: RequestMethods.patch,
        body: data,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const makeDepsoit = async (
    allocationMonth: string,
    depositData: MakeDepositType,
    authData?: AuthData,
    linked_deposit_id?: string,
    OTPverificationMethod?: string
) => {
    const url = `${FOS_SERVICE_BASE_URL}/deposit?company_id=${authData?.company_id}`;
    depositData.loan_data.forEach((item) => {
        delete item.checked;
    });
    const branchMangerDetails =
        depositData.branch_details?.branch_type == BankBranchType.company
            ? depositData.branch_manager_details
            : {};

    const formData = new FormData();
    formData.append(
        'branch_details',
        JSON.stringify(depositData?.branch_details)
    );
    formData.append('comment', depositData.comment);
    formData.append('deposit_method', depositData.deposit_method);
    if (depositData?.branch_details?.branch_type != BankBranchType.airtel) {
        if (depositData.deposit_proof_link)
            formData.append(
                'deposit_proof_link',
                depositData.deposit_proof_link
            );
        else
            formData.append(
                'deposit_proof_file',
                depositData.deposit_proof_file
            );
    }
    formData.append('deposit_receipt_no', depositData.deposit_receipt_no);
    if (linked_deposit_id)
        formData.append('linked_deposit_id', linked_deposit_id);
    formData.append('loan_data', JSON.stringify(depositData.loan_data));
    formData.append('recovery_method', depositData.recovery_method);
    formData.append('total_amount', depositData.total_amount.toString());
    if (
        !!OTPverificationMethod &&
        depositData?.branch_details?.branch_type == BankBranchType.company
    )
        formData.append('otp_data', JSON.stringify(depositData.otp_data));
    formData.append(
        'branch_manager_details',
        JSON.stringify(branchMangerDetails)
    );
    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data',

            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const getDepositDetails = async (
    depositId: string,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/verification/loans/${depositId}?company_id=${authData?.company_id}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        },
        toastMessage: 'Error in Re-deposit'
    });
    return response;
};

export const getTransactionDetailsFromVisit = async (
    visitId: string,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/transaction/details?visit_id=${visitId}`;

    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const getBranchDetails = async (authData?: AuthData) => {
    const url = `${FOS_SERVICE_BASE_URL}/organisation/branch?company_id=${authData?.company_id}&page_number=0&page_limit=0`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const getBranchRepresentatives = async (
    branchCode?: string,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/branch/managers/${branchCode}?company_id=${authData?.company_id}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const cancelDeposit = async (
    depositId: string,
    timedOut = false,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/deposit/confirmation?company_id=${authData?.company_id}`;
    const body = {
        deposit_id: depositId,
        success: false,
        message: timedOut
            ? `Deposit Verification Timed Out`
            : `Deposit Verification Cancelled`
    };
    const response = await apiRequest({
        url,
        body,
        method: RequestMethods.patch,
        headers: { authenticationtoken: authData?.authenticationtoken }
    });
    return response;
};
