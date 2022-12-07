import { AuthData, ResetUserData } from './../../types';
import { UserCredentials } from '../../types';
import Urls from '../constants/Urls';
import { encryptRSA } from './crypto';
import { apiRequest } from './apiRequest';
import { RequestMethods } from '../../enums';

const { USER_SERVICE_BASE_URL, FOS_SERVICE_BASE_URL } = Urls;

export const loginUser = async (user: UserCredentials) => {
    const url = `${USER_SERVICE_BASE_URL}/public/login`;
    const userData = await encryptRSA(user);

    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: userData,
        headers: {
            'Content-Type': 'text/html'
        }
    });

    return response;
};

export const checkOtp = async (otpData: any) => {
    const url = `${USER_SERVICE_BASE_URL}/public/check-otp`;
    const apiResponse = await apiRequest({
        url,
        method: RequestMethods.post,
        body: otpData
    });
    return apiResponse;
};

export const generateLoginOtp = async (generateLoginOtpData: any) => {
    const url = `${USER_SERVICE_BASE_URL}/public/send-otp`;
    const apiResponse = await apiRequest({
        url,
        method: RequestMethods.post,
        body: generateLoginOtpData
    });
    return apiResponse;
};

export const resetPassword = async (resetUserData: ResetUserData) => {
    const url = `${USER_SERVICE_BASE_URL}/public/forgot-password`;
    const userData = await encryptRSA(resetUserData);
    const response = await apiRequest({
        url,
        method: RequestMethods.patch,
        body: userData
    });
    return response;
};

export const getUserClockStatus = async (authData?: AuthData) => {
    const url = `${FOS_SERVICE_BASE_URL}/clock/status?company_id=${authData?.company_id}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response?.success && response?.data?.[0];
};

export const setUserClockStatus = async (
    location?: any,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/clock/set`;
    const data = {
        location: location?.latitude && location?.longitude ? location : {},
        company_id: authData?.company_id
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
    return response;
};

export const getUserDetails = async (authtoken: string | undefined) => {
    const url = `${USER_SERVICE_BASE_URL}/users`;
    const apiResponse = await apiRequest({
        url,
        headers: {
            authenticationtoken: authtoken
        }
    });
    return apiResponse;
};

export const logoutUser = async (authtoken: string) => {
    const url = `${USER_SERVICE_BASE_URL}/logout`;
    const apiResponse = await apiRequest({
        url,
        method: RequestMethods.post,
        headers: {
            'Content-Type': 'text/plain',
            authenticationtoken: authtoken
        }
    });
    return apiResponse;
};
