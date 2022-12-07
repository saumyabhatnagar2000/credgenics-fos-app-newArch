import config from '../config';

export type UrlsType = {
    BASE_URL: string;
    BASE_URL_IDN: string;
    USER_SERVICE_BASE_URL: string;
    RECOVERY_SERVICE_BASE_URL: string;
    FOS_SERVICE_BASE_URL: string;
    CALLING_SERVICE_BASE_URL: string;
    FEEDBACK_SERVICE_BASE_URL: string;
    COMMUNICATION_SERVICE_BASE_URL: string;
    CLOUDFLARE_TRACE_URL: string;
    STATUS_SERVICE_BASE_URL: string;
};

const BASE_URL = config.BASE_URL;
const BASE_URL_IDN = config.BASE_URL_IDN;

const USER_SERVICE_BASE_URL = `/user`;
const RECOVERY_SERVICE_BASE_URL = `/recovery`;
const FOS_SERVICE_BASE_URL = `/fos`;
const CALLING_SERVICE_BASE_URL = `/calling`;
const FEEDBACK_SERVICE_BASE_URL = `/feedback`;
const COMMUNICATION_SERVICE_BASE_URL = `/communication`;
const STATUS_SERVICE_BASE_URL = `/status`;

export const CLOUDFLARE_TRACE_URL = 'https://www.cloudflare.com/cdn-cgi/trace';

export const Referer = config.REFERER;

export default {
    BASE_URL,
    BASE_URL_IDN,
    USER_SERVICE_BASE_URL,
    RECOVERY_SERVICE_BASE_URL,
    FOS_SERVICE_BASE_URL,
    CALLING_SERVICE_BASE_URL,
    FEEDBACK_SERVICE_BASE_URL,
    COMMUNICATION_SERVICE_BASE_URL,
    CLOUDFLARE_TRACE_URL,
    STATUS_SERVICE_BASE_URL
} as UrlsType;
