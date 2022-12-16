import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { DispositionType } from './../../types';
import { AxiosError } from 'axios';
import { Buffer } from 'buffer';
import {
    Alert,
    Linking,
    PermissionsAndroid,
    Platform,
    ToastAndroid
} from 'react-native';
import { Asset } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import {
    ApplicantTypes,
    CurrencyTypes,
    TaskTypes,
    ToastTypes
} from '../../enums';
import { LocationType, newAddress } from './../../types';
import Geolocation from 'react-native-geolocation-service';
import {
    checkLocationPermissions,
    requestLocationPermissions
} from './locationUtils';
import { Overall, SUPPORT_EMAIL } from '../constants/constants';
import * as Sentry from '@sentry/react-native';
import { debounce } from 'lodash';
import { NativeModules } from 'react-native';
import { getTemplate } from '../assets/OfflineReceipt/template';

export function convertIntoBase64(data_dict: Object) {
    let jsonObj = JSON.stringify(data_dict);
    return Buffer.from(jsonObj).toString('base64');
}

export function catchNetworkError(error: AxiosError) {
    throw error;
}

export function getOnlyDate(date?: string): string {
    date = date?.split(' ')[0];
    return date ?? 'NA';
}

export function getOnlyDistance(distance: any): string {
    if (distance === '') return 'NA';
    if (!distance) return 'NA';
    return `${distance} KM`;
}

export function keyConverter(key: string): string {
    if (key && key != '') {
        return key
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
            .replace(/[^a-zA-Z0-9 ]/g, ' ');
    }
    return 'INVALID KEY';
}

export function addressConverter(address?: string): string {
    if (address === '' || address == null || address == undefined)
        return 'Not Available';
    return address.trim();
}

export function getPaymentModeIcon(paymentMode: string): string {
    if (paymentMode.toLocaleLowerCase() === 'cash') return 'money-bill-alt';
    if (paymentMode.toLocaleLowerCase() === 'cheque') return 'money-check-alt';
    return 'globe';
}

export const getCurrentAllocationMonth = () => {
    return moment().startOf('month').format('YYYY-M-01');
};

export const checkProofAttached = (proof: boolean, imageData: Asset) => {
    if (proof && imageData) {
        if (imageData.type === 'link') return imageData.uri;
        return {
            uri: imageData.uri,
            name: imageData.fileName,
            type: imageData.type
        };
    } else if (!proof) {
        return true;
    }
    return false;
};

export const startNavigation = async (destination?: string) => {
    if (Platform.OS === 'android') {
        const URL = `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${destination}`;
        (await Linking.canOpenURL(URL)) && Linking.openURL(URL);
    }
};

export const goToLocationOnMap = async (location?: LocationType) => {
    if (Platform.OS === 'android') {
        const URL = `https://maps.google.com/maps?q=${location?.latitude},${location?.longitude}`;
        (await Linking.canOpenURL(URL)) && Linking.openURL(URL);
    }
};

export const navigateToLocationOnMap = async (location?: LocationType) => {
    if (Platform.OS === 'android') {
        const URL = `google.navigation:q=${location?.latitude},${location?.longitude}`;
        (await Linking.canOpenURL(URL)) && Linking.openURL(URL);
    }
};

export const startCall = (phoneNumber: string) => {
    if (Platform.OS === 'android') {
        Linking.openURL(`tel:${phoneNumber}`);
    }
};

export const isStringLink = (str: string) => {
    if (!str) return false;
    return str.startsWith('https://') || str.startsWith('https://');
};

const actualDownload = (url: string) => {
    const { dirs } = RNFetchBlob.fs;

    const arr = url?.split('/') || [];
    if (arr.length == 0) Alert.alert('Wrong url', '');

    const name = arr[arr.length - 1];
    if (!name) return Alert.alert('Wrong url', '');

    if (url && name) {
        RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                mediaScannable: true,
                mime: 'application/pdf',
                title: `${Date.now()}_${name}`,
                path: `${dirs.DownloadDir}/CG_Collect_${Date.now()}_${name}`
            }
        })
            .fetch('GET', url, {})
            .then((res) => {
                //
            })
            .catch((e) => {
                //
            });
    }
};

export const handleDownloadFile = async (url: string) => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            actualDownload(url);
        } else {
            Alert.alert(
                'Permission Denied!',
                'You need to give storage permission to download the file'
            );
        }
    } catch (err) {
        console.warn(err);
    }
};

export function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const formatDate = (data: string) => {
    let d = new Date(data?.split(' ')[0]);
    const monthNames = [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    return `${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
};

export const flattenObj = (obj = {}, res = {}, extraKey = '') => {
    for (const key in obj) {
        if (typeof obj[key] !== 'object') {
            res[extraKey + key] = obj[key];
        } else {
            flattenObj(obj[key], res, `${extraKey}${key}.`);
        }
    }
    return res;
};

// WEEK
export const getWeekStartDate = () =>
    moment().startOf('isoWeek').format('YYYY-MM-DD');

export const getWeekEndDate = () =>
    moment().endOf('isoWeek').format('YYYY-MM-DD');

export const getWeekEndDateMaxToday = () => {
    const wed = getWeekEndDate();
    const today = getToday();
    if (wed > today) return today;
    return wed;
};
export const getTommorowDateTime = () =>
    new Date(moment().add(1, 'd').format('YYYY-MM-DD'));

// MONTH
export const getMonthStartDate = () =>
    moment().startOf('months').format('YYYY-MM-DD');

export const getMonthEndDate = () =>
    moment().endOf('months').format('YYYY-MM-DD');

export const getMonthEndDateMaxToday = () => {
    const med = getMonthEndDate();
    const today = getToday();
    if (med > today) return today;
    return med;
};

export const getTomorrow = () => moment().add(1, 'days').format('YYYY-MM-DD');

export const getToday = () => moment().format('YYYY-MM-DD');

export const getYesterday = () =>
    moment().subtract(1, 'days').format('YYYY-MM-DD');

export const getAddress = (
    applicantType: string,
    addressObject: newAddress
) => {
    if (applicantType == ApplicantTypes.applicant) {
        return {
            address_id: addressObject?.address_id,
            address_type: addressObject?.applicant_address_type ?? '',
            address_text: addressObject?.applicant_address_text ?? '',
            city: addressObject?.applicant_city ?? '',
            state: addressObject?.applicant_state ?? '',
            pincode: addressObject?.applicant_pincode ?? '',
            landmark: addressObject?.applicant_landmark ?? '',
            longitude: addressObject?.applicant_address_longitude ?? '',
            latitude: addressObject?.applicant_address_latitude ?? ''
        };
    } else if (applicantType == ApplicantTypes.co_applicant) {
        return {
            address_id: addressObject?.address_id,
            address_type: addressObject?.co_applicant_address_type ?? '',
            address_text: addressObject?.co_applicant_address_text ?? '',
            city: addressObject?.co_applicant_city ?? '',
            state: addressObject?.co_applicant_state ?? '',
            pincode: addressObject?.co_applicant_pincode ?? '',
            landmark: addressObject?.co_applicant_landmark ?? '',
            longitude: addressObject?.co_applicant_address_longitude ?? '',
            latitude: addressObject?.co_applicant_address_latitude ?? ''
        };
    }
};

export const openLocationDialog = () => {
    return checkLocationPermissions().then((result) => {
        if (Platform.Version < 29) {
            return requestLocationPermissions().then((result) => {
                return result;
            });
        }
        return result;
    });
};

export const getLocation = () => {
    return new Promise<LocationType>((resolve, reject) => {
        const timer = setTimeout(() => {
            Sentry.captureMessage('Unable to fetch location');
            ToastAndroid.show('Unable to fetch location', ToastAndroid.SHORT);
            reject({});
        }, 15000);
        Geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    isMocked: position?.mocked
                });
                clearTimeout(timer);
            },
            (err) => {
                reject(err);
                ToastAndroid.show(
                    'Unable to fetch location',
                    ToastAndroid.SHORT
                );
                clearTimeout(timer);
            },
            { enableHighAccuracy: true, maximumAge: 10000 }
        );
    });
};
export const getLocationPromise = async (): Promise<
    LocationType | undefined | {}
> => {
    try {
        const location = await getLocation();
        return location;
    } catch {
        return {};
    }
};

const degsToRads = (deg: any) => (deg * Math.PI) / 180.0;

export const getStraightLineDistance = (
    address_coordinates: any,
    current_coordinates: any
) => {
    let address_longitude = degsToRads(
        parseFloat(address_coordinates.longitude)
    );
    let address_latitude = degsToRads(parseFloat(address_coordinates.latitude));
    let current_longitude = degsToRads(
        parseFloat(current_coordinates.longitude)
    );
    let current_latitude = degsToRads(parseFloat(current_coordinates.latitude));
    // Haversine Formula
    let distance_between_longitudes = current_longitude - address_longitude;
    let distance_between_latitudes = current_latitude - address_latitude;
    let result =
        Math.sin(distance_between_latitudes / 2) ** 2 +
        Math.cos(address_latitude) *
            Math.cos(current_latitude) *
            Math.sin(distance_between_longitudes / 2) ** 2;
    let distance_between_coordinates = 12742 * Math.asin(Math.sqrt(result));
    distance_between_coordinates =
        Math.round((distance_between_coordinates + Number.EPSILON) * 100) / 100;
    if (distance_between_coordinates % 1 == 0)
        distance_between_coordinates = distance_between_coordinates;
    return distance_between_coordinates;
};

export const StringCompare = (str1?: string, str2?: string) => {
    return str1?.toLowerCase().trim() == str2?.toLowerCase().trim();
};

export const addCurrencyDenomination = (
    value: number,
    currencyCode: string
) => {
    let val = Math.abs(value);
    if (val >= 10000000) {
        if (currencyCode == CurrencyTypes.rs)
            val = (val / 10000000).toFixed(2) + ' Cr';
        else val = (val / 1000000).toFixed(2) + ' M';
    } else if (val >= 100000) {
        if (currencyCode == CurrencyTypes.rs)
            val = (val / 100000).toFixed(2) + ' Lac';
        else val = (val / 1000000).toFixed(2) + 'M';
    } else if (val <= 99999) {
        val = val.toString().replace(/\B(?!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    }
    return val;
};

export const maskDetails = (stringToMask: string, noOfChars: number) => {
    var last5 = stringToMask.substring(stringToMask.length - noOfChars);
    var mask = stringToMask
        .substring(0, stringToMask.length - 2)
        .replace(/\d/g, '*');
    return mask + last5;
};

export const showToast = (toastString: string, toastType?: string) => {
    if (toastType == ToastTypes.long)
        ToastAndroid.show(toastString, ToastAndroid.LONG);
    else ToastAndroid.show(toastString, ToastAndroid.SHORT);
};

export const getAllocationMonthText = (allocationMonth: string) => {
    return StringCompare(allocationMonth, Overall)
        ? Overall
        : moment(allocationMonth, 'YYYY-M-DD').format('MMM, YYYY');
};

export const sendContactUsEmail = async () => {
    const url = `mailto:${SUPPORT_EMAIL}`;
    let canOpen;
    try {
        canOpen = await Linking.canOpenURL(url);
    } catch {
        ToastAndroid.show('Some error Occured', ToastAndroid.SHORT);
    }
    return canOpen && Linking.openURL(url);
};

export const generateArrayfromString = (value: string) => {
    return value?.split(',') ?? [''];
};

export const checkIfStatusIsPTP = (
    selectedDisposition?: DispositionType,
    selectedDispositionOne?: DispositionType,
    selectedDispositionTwo?: DispositionType
) => {
    if (
        StringCompare(selectedDisposition?.text, TaskTypes.promise_to_pay) ||
        StringCompare(selectedDisposition?.text, TaskTypes.ptp) ||
        StringCompare(selectedDispositionOne?.text, TaskTypes.ptp) ||
        StringCompare(selectedDispositionOne?.text, TaskTypes.promise_to_pay) ||
        StringCompare(selectedDispositionTwo?.text, TaskTypes.ptp) ||
        StringCompare(selectedDispositionTwo?.text, TaskTypes.promise_to_pay)
    )
        return true;
    return false;
};

export const getValidAmountString = (amount: string) => {
    return amount?.split(',')?.join('') ?? amount;
};

export const leadingDebounce = (callback: Function, delay: number) => {
    return debounce(
        () => {
            callback();
        },
        delay,
        { trailing: false, leading: true }
    );
};

export const getDecimalCountInString = (amount: string) => {
    return amount?.split('.').length - 1;
};

export const KillAppProcess = () => {
    try {
        return NativeModules.ExitApp.exitApp();
    } catch {}
};
