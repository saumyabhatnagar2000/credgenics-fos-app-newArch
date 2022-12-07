import { RequestMethods } from './../../enums';
import { AuthData } from './../../types';
import Urls from '../constants/Urls';
import { apiRequest } from './apiRequest';
import { catchNetworkError } from './utils';

const {
    CALLING_SERVICE_BASE_URL,
    RECOVERY_SERVICE_BASE_URL,
    FOS_SERVICE_BASE_URL,
    STATUS_SERVICE_BASE_URL
} = Urls;

export const getDispositionStatus = async (
    serviceType: string,
    filterRequired: boolean,
    authData?: AuthData,
    id = ''
) => {
    const url = `/status/dispositions/selected?company_id=${
        authData?.company_id
    }&id=${id}&service_type=${serviceType}&events_type=${
        filterRequired ? 'collection' : ''
    }`;
    try {
        const response = await apiRequest({
            url,
            method: RequestMethods.get,
            headers: {
                authenticationtoken: authData?.authenticationtoken,
                role: authData?.role
            }
        });
        return response;
    } catch (e: AxiosError) {
        catchNetworkError(e);
    }
};

export const submitDisposition = async (body: any, authData?: AuthData) => {
    const url = `${CALLING_SERVICE_BASE_URL}/call/update/v2`;
    try {
        const response = await apiRequest({
            url,
            body,
            method: RequestMethods.patch,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });
        return response;
    } catch (e) {
        catchNetworkError(e);
    }
};

export const closeReminder = async (
    loanId: string,
    newReminder: boolean,
    authData?: AuthData
) => {
    const body = {
        comment: 'closed after calling',
        closed: true,
        new_reminder: true
    };
    const url = `${RECOVERY_SERVICE_BASE_URL}/reminder/close/${loanId}?company_id=${authData?.company_id}`;
    try {
        const response = await apiRequest({
            url,
            body,
            method: RequestMethods.patch,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });
        return response;
    } catch (e) {
        catchNetworkError(e);
    }
};

export const createNewReminder = async (
    body: any,
    loanId: string,
    allocationMonth: string,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/reminder/create/${loanId}?company_id=${authData?.company_id}&allocation_month=${allocationMonth}`;
    try {
        const response = await apiRequest({
            url,
            body,
            method: RequestMethods.post,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });
        return response;
    } catch (e) {
        catchNetworkError(e);
    }
};

export const getCallingReminders = async (
    from_date: string,
    to_date: string,
    authData?: AuthData
) => {
    const body = {
        company_id: authData?.company_id,
        next_step: ['Call', 'call'],
        author_id: [authData?.userId],
        ...(from_date.length > 0 && { from_date: from_date }),
        to_date: to_date
    };
    const url = `${RECOVERY_SERVICE_BASE_URL}/internal/reminders`;
    try {
        const response = await apiRequest({
            url,
            body,
            method: RequestMethods.post,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });
        return response;
    } catch (e) {
        catchNetworkError(e);
    }
};

export const getNextTasks = async (
    from_date: string,
    to_date: string,
    authData?: AuthData
) => {
    const body = {
        company_id: authData?.company_id,
        next_step: ['field_visit', 'Visit', 'Call', 'call'],
        author_id: [authData?.userId],
        ...(from_date.length > 0 && { from_date: from_date }),
        to_date: to_date
    };
    const url = `${RECOVERY_SERVICE_BASE_URL}/internal/reminders`;
    try {
        const response = await apiRequest({
            url,
            body,
            method: RequestMethods.post,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });
        return response;
    } catch (e) {
        catchNetworkError(e);
    }
};

export const getMissedTasks = async (
    from_date: string,
    to_date: string,
    authData?: AuthData
) => {
    const body = {
        company_id: authData?.company_id,
        next_step: ['field_visit', 'Visit', 'Call', 'call'],
        author_id: [authData?.userId],
        ...(from_date.length > 0 && { from_date: from_date }),
        to_date: to_date
    };
    const url = `${RECOVERY_SERVICE_BASE_URL}/internal/reminders`;
    try {
        const response = await apiRequest({
            url,
            body,
            method: RequestMethods.post,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });
        return response;
    } catch (e) {
        catchNetworkError(e);
    }
};

export const getVisitReminders = async (
    from_date: string,
    to_date: string,
    authData?: AuthData
) => {
    const body = {
        company_id: authData?.company_id,
        next_step: ['field_visit', 'Visit'],
        author_id: [authData?.userId],
        ...(from_date.length > 0 && { from_date: from_date }),
        to_date: to_date
    };
    const url = `${RECOVERY_SERVICE_BASE_URL}/internal/reminders`;
    try {
        const response = await apiRequest({
            url,
            body,
            method: RequestMethods.post,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });
        return response;
    } catch (e) {
        catchNetworkError(e);
    }
};

export const getVisitDetails = async (
    reminderId: string,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/reminder/visit/details?reminder_id=${reminderId}`;
    try {
        const response = await apiRequest({
            url,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });
        return response;
    } catch (e) {
        catchNetworkError(e);
    }
};
export const getCallingHistory = async (
    customerId: string,
    authData?: AuthData
) => {
    const url = `${CALLING_SERVICE_BASE_URL}/call-log/v2/${customerId}?company_id=${authData?.company_id}`;
    try {
        const response = await apiRequest({
            url,
            headers: {
                authenticationtoken: authData?.authenticationtoken
            }
        });
        return response;
    } catch (e) {
        catchNetworkError(e);
    }
};

export const getAllDispositionStatus = async (authData?: AuthData) => {
    const url = `${STATUS_SERVICE_BASE_URL}/all/dispositions?company_id=${authData?.company_id}&service_type=fos&events_type=collection`;
    try {
        const response = await apiRequest({
            url,
            headers: { authenticationtoken: authData?.authenticationtoken }
        });
        return response?.data;
    } catch (e) {}
};
