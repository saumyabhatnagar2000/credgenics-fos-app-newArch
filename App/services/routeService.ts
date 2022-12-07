import Urls from '../constants/Urls';
import { apiRequest } from './apiRequest';
import { RequestMethods } from '../../enums';
import { AuthData } from '../../types';

const { FOS_SERVICE_BASE_URL } = Urls;

export const getOptimizedRoute = async (data: any, authData?: AuthData) => {
    const url = `${FOS_SERVICE_BASE_URL}/route/plan`;

    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: data,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });

    return response?.data;
};

export const resetRoute = async (authData?: AuthData) => {
    const url = `${FOS_SERVICE_BASE_URL}/route/reset`;

    const response = await apiRequest({
        url,
        method: RequestMethods.patch,
        body: { company_id: authData?.company_id },
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const resumeRoute = async (authData?: AuthData) => {
    const url = `${FOS_SERVICE_BASE_URL}/route/resume?company_id=${authData?.company_id}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response?.data;
};
