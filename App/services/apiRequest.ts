import axios from 'axios';
import { RequestMethods } from '../../enums';
import { catchNetworkError } from './utils';
import { Referer } from '../constants/Urls';
import { ToastAndroid } from 'react-native';
import { SOMETHING_WENT_WRONG } from '../constants/constants';

export type ApiRequestType = {
    url: string;
    headers?: object;
    method?: RequestMethods;
    body?: any;
    toastMessage?: string;
};
export type ApiResponseType = {
    data: any;
    success: boolean;
    message: string;
    error_code: any;
};
export async function apiRequest(data: ApiRequestType) {
    try {
        const {
            url,
            method = RequestMethods.get,
            body = {},
            headers = {},
            toastMessage
        } = data;
        if (url.split('/')[1] === 'calling' || url.split('/')[1] === 'fos') {
            try {
                const response = await axios({
                    url,
                    method,
                    data: body,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Referer,
                        ...headers
                    }
                });
                const apiResponse: ApiResponseType = response?.data;
                if (apiResponse?.success) {
                    return apiResponse;
                }
            } catch (error: AxiosError | any) {
                // TODO: Handle offline ?
                const message =
                    error?.response?.data?.message ?? SOMETHING_WENT_WRONG;
                if (!toastMessage?.length)
                    ToastAndroid.show(
                        toastMessage ?? message,
                        ToastAndroid.LONG
                    );
                throw error?.response?.data?.message;
            }
        } else {
            const response = await axios({
                url,
                method,
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Referer,
                    ...headers
                }
            });
            return response;
        }
    } catch (e) {
        catchNetworkError(e);
    }
}
