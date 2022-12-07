import Urls from '../constants/Urls';
import { apiRequest } from './apiRequest';
import { COUNTRY_CODE_REGEX } from './country';

const { CLOUDFLARE_TRACE_URL } = Urls;

export async function getCountryCode() {
    const response = await apiRequest({
        url: CLOUDFLARE_TRACE_URL,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Referer: undefined
        }
    });

    if (response && response.status === 200) {
        let countryCode = COUNTRY_CODE_REGEX.exec(response?.data);
        if (countryCode === null || countryCode[1] === '') {
            throw Error('Country code detection failed');
        }
        return countryCode[1];
    }
}
