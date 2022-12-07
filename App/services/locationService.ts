import { RequestMethods } from '../../enums';
import { AuthData, LocationType } from '../../types';
import Urls from '../constants/Urls';
import { apiRequest } from './apiRequest';

const { FOS_SERVICE_BASE_URL } = Urls;

export const markLocation = async (
    loan_id: string,
    visit_id: string,
    location?: LocationType,
    authData?: AuthData,
    address_location?: LocationType | undefined
) => {
    const url = `${FOS_SERVICE_BASE_URL}/location/mark`;
    let data: any = {
        loan_id,
        visit_id,
        marked_location:
            location?.latitude && location?.longitude ? location : {},
        company_id: authData?.company_id
    };
    if (address_location) data.address_location = address_location;

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

export const sendLocationCoordinates = async (
    eventsData: any,
    authData: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/location/push?company_id=${authData?.company_id}`;
    const body = {
        events: eventsData,
        company_id: authData?.company_id
    };

    const response = await apiRequest({
        url,
        body,
        method: RequestMethods.post,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};
