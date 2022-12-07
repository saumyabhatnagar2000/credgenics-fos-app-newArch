import { RequestMethods } from './../../enums';
import { AuthData } from '../../types';
import Urls from '../constants/Urls';
import { apiRequest } from './apiRequest';

const {
    FOS_SERVICE_BASE_URL,
    CALLING_SERVICE_BASE_URL,
    COMMUNICATION_SERVICE_BASE_URL,
    RECOVERY_SERVICE_BASE_URL
} = Urls;

export const sendReceipt = async (
    loan_id: string,
    visit_id: string,
    visitDate: string,
    amountRecovered: string,
    receiptUrl: string,
    allocationMonth: string,
    applicantName: string,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/collection/receipt/send`;
    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: {
            visit_id,
            allocation_month: allocationMonth,
            amount_recovered: amountRecovered,
            applicant_name: applicantName,
            company_id: authData?.company_id,
            loan_id,
            visit_date: visitDate,
            short_collection_receipt_url: `${receiptUrl}`
        },
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    if (response) {
        return response;
    }
};

export const callUser = async (
    loan_id: string,
    allocationMonth: string,
    to: string,
    from?: string,
    applicant_type?: string,
    status: string | null = null,
    authData?: AuthData
) => {
    const data = {
        to: to,
        from: from,
        applicant_type,
        status,
        source: 'fos',
        allocation_month: allocationMonth,
        loan_id: loan_id,
        company_id: authData?.company_id
    };

    const url = `${CALLING_SERVICE_BASE_URL}/call/create/v2`;
    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: data,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const getTemplates = async (authData: AuthData) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/templates?company_id=${authData?.company_id}&&fos_payment_template=True`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    if (response && response.status === 200) {
        return response.data.output ?? {};
    }
};

export const getPaymentLink = async (
    loan_id: string,
    allocationMonth: string,
    authData?: AuthData
) => {
    const url = `${COMMUNICATION_SERVICE_BASE_URL}/payment/link?company_id=${authData?.company_id}&loan_id=${loan_id}&allocation_month=${allocationMonth}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    if (response && response?.data) {
        return response;
    }
};

export const getPaymentTemplate = async (authData?: AuthData) => {
    const url = `${COMMUNICATION_SERVICE_BASE_URL}/event/templates/mapping?company_id=${authData?.company_id}&page_number=1&page_size=10`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const sendPaymentLink = async (
    loan_id: string,
    type: string,
    allocationMonth: string,
    applicant_type: string,
    applicant_index: string | number,
    applicant_name: string,
    amount: string | number,
    uptoLength: string | number,
    customContactDetails: string,
    visit_id: string,
    authData?: AuthData
) => {
    const data = {
        upto_index: uptoLength,
        communication_level: 'customer',
        event_comm_type: type,
        allocation_month: allocationMonth,
        company_id: authData?.company_id,
        loan_id,
        source: 'fos_app',
        event_name: 'fos_payment_template',
        inbound_bot_id: '',
        send_to: applicant_type,
        send_to_closed_acc: false,
        custom_to: customContactDetails,
        co_app_upto: '1',
        fos_data: {
            applicant_type,
            applicant_index,
            visit_id,
            applicant_name: applicant_name,
            allocation_month: allocationMonth,
            collection_receipt_url: '',
            recovery_date: '',
            amount_recovered: amount,
            agent_name: authData?.name,
            agent_mobile: authData?.mobile
        }
    };

    const url = COMMUNICATION_SERVICE_BASE_URL + `/trigger/event`;
    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: data,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};
