import Urls from '../constants/Urls';
import { ApiResponseType, AuthData } from '../../types';
import { apiRequest } from './apiRequest';
import { ToastAndroid } from 'react-native';
import { StringCompare } from './utils';

const {
    FOS_SERVICE_BASE_URL,
    USER_SERVICE_BASE_URL,
    RECOVERY_SERVICE_BASE_URL
} = Urls;

export const fetchAppConfig = async () => {
    const url = `${FOS_SERVICE_BASE_URL}/public/v2/app/meta`;
    const response: ApiResponseType = await apiRequest({
        url
    });
    if (response?.success && response?.data) {
        return response;
    }
    return null;
};

export const fetchOrgDetails = async (authData?: AuthData) => {
    let userData: any = {};
    let fosData: any = {};
    let recData: any = {};

    try {
        userData = await fetchUserOrgDetails(authData);
    } catch {
        ToastAndroid.show(
            'Error fetching User organisation details',
            ToastAndroid.SHORT
        );
    }
    try {
        fosData = await fetchFosOrgDetails(authData);
    } catch (e) {
        throw e;
    }

    try {
        recData = await fetchRecoveryOrgDetails(authData);
    } catch {
        ToastAndroid.show(
            'Error fetching recovery organisation details',
            ToastAndroid.SHORT
        );
    }

    return {
        ...fosData,
        ...userData,
        ...recData
    };
};

const fetchFosOrgDetails = async (authData?: AuthData) => {
    const url = `${FOS_SERVICE_BASE_URL}/organisation?company_id=${authData?.company_id}`;
    try {
        const response = await apiRequest({
            url,
            headers: {
                authenticationtoken: authData?.authenticationtoken,
                role: authData?.role
            },
            toastMessage: 'Error fetching FOS organisation details'
        });
        if (response && response?.success) {
            const {
                fos_collection_mode,
                fos_deposit_mode,
                fos_calling_mode,
                feedback_response_fos,
                company_name,
                fos_otp_verification_required,
                country_isd_code,
                geofencing_required,
                deposit_details,
                geofencing_distance,
                location_access,
                route_planning,
                deposit_branch_location,
                company_branch_representatives,
                online_collection_mode,
                deposit_otp_verification_method,
                cheque_details_input,
                offline_mode
            } = response?.data;
            return {
                fos_collection_mode,
                fos_deposit_mode,
                fos_calling_mode,
                feedback_response_fos,
                company_name,
                fos_otp_verification_required,
                country_isd_code,
                geofencing_required,
                deposit_details,
                geofencing_distance,
                location_access,
                route_planning,
                deposit_branch_location,
                company_branch_representatives,
                online_collection_mode,
                deposit_otp_verification_method,
                cheque_details_input,
                offline_mode
            };
        }
        return {};
    } catch (error: any) {
        if (StringCompare(error, 'Access Unauthorized')) {
            ToastAndroid.show(
                'FOS Module Access not Permitted',
                ToastAndroid.SHORT
            );
            throw error;
        } else ToastAndroid.show(error, ToastAndroid.SHORT);
    }
    return {};
};

const fetchUserOrgDetails = async (authData?: AuthData) => {
    const url = `${USER_SERVICE_BASE_URL}/company?company_id=${authData?.company_id}`;
    try {
        const response = await apiRequest({
            url,
            headers: {
                authenticationtoken: authData?.authenticationtoken,
                role: authData?.role
            }
        });
        if (response && response?.status === 200) {
            const {
                country_currency_code,
                company_name,
                country_isd_code,
                company_type,
                address_city,
                address_pincode,
                address_state,
                address_text,
                company_logo
            } = response?.data?.data?.company_details ?? {};

            return {
                country_currency_code,
                company_name,
                country_isd_code,
                company_type,
                address_city,
                address_pincode,
                address_state,
                address_text,
                company_logo
            };
        }
        return {};
    } catch (error) {
        return {};
    }
};

const fetchRecoveryOrgDetails = async (authData?: AuthData) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/company?company_id=${authData?.company_id}`;
    try {
        const response = await apiRequest({
            url,
            headers: {
                authenticationtoken: authData?.authenticationtoken,
                role: authData?.role
            }
        });
        if (response && response?.status === 200) {
            return {
                is_recovery_amount_bifurcation_enabled:
                    response?.data.company_details
                        ?.is_recovery_amount_bifurcation_enabled,
                show_balance_claim_amount:
                    response?.data.company_details?.show_balance_claim_amount
            };
        }
        return {};
    } catch (error) {
        return {};
    }
};
