import { RequestMethods } from '../../enums';
import Urls from '../constants/Urls';
import { AuthData } from './../../types';
import { apiRequest } from './apiRequest';

const { FEEDBACK_SERVICE_BASE_URL, FOS_SERVICE_BASE_URL } = Urls;

export async function getForms(authData?: AuthData) {
    const url = `${FEEDBACK_SERVICE_BASE_URL}/forms?company_id=${authData?.company_id}&source=fos`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    if (response?.data?.forms?.length > 0) {
        return response?.data?.forms?.[0];
    }
}

export async function getFormDetails(form_id: string, authData?: AuthData) {
    const url = `${FEEDBACK_SERVICE_BASE_URL}/form?form_id=${form_id}&detailed=True`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response?.data?.data;
}

export async function getFormResponses(
    response_id: string,
    authData?: AuthData
) {
    const url = `${FEEDBACK_SERVICE_BASE_URL}/responses?response_ids=${response_id}`;

    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });

    return response?.data;
}

export async function submitForm(
    form_id: string,
    answers: any,
    authData?: AuthData
) {
    const url = `${FEEDBACK_SERVICE_BASE_URL}/response`;
    const data = {
        form_id: form_id,
        answers: answers,
        metadata: {}
    };

    const response = await apiRequest({
        url,
        body: data,
        method: RequestMethods.post,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });

    return response?.data?.data;
}

export async function saveResponseToVisit(
    visit_id: string,
    feedback_response_id: string,
    loanId: string,
    allocationMonth: string,
    authData?: AuthData
) {
    const url = `${FOS_SERVICE_BASE_URL}/visit/feedback`;
    const body = {
        allocation_month: allocationMonth,
        company_id: authData?.company_id,
        feedback_response: feedback_response_id,
        loan_id: loanId,
        visit_id: visit_id
    };
    const response = await apiRequest({
        url,
        method: RequestMethods.patch,
        body,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        },
        toastMessage: 'Error saving form to visit'
    });
    return response;
}
