import { AuthData } from '../../types';
import Urls from '../constants/Urls';
import { apiRequest } from './apiRequest';

const { FOS_SERVICE_BASE_URL } = Urls;

export const getCollectionLimits = async (authData?: AuthData) => {
    const url = `${FOS_SERVICE_BASE_URL}/collection/limits?company_id=${authData?.company_id}`;

    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const getDashboardMatrices = async (
    type: string,
    first_date: string,
    last_date: string,
    authData?: AuthData,
    allocationMonth?: string
) => {
    const url = `${FOS_SERVICE_BASE_URL}/agent/performance?company_id=${authData?.company_id}&first_date=${first_date}&last_date=${last_date}&tab=${type}&allocation_month=${allocationMonth}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const getHomepageData = async (authData?: AuthData) => {
    const url = `${FOS_SERVICE_BASE_URL}/homepage?company_id=${authData?.company_id}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};
