import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import {
    ImagePickerResponse,
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import { ToastAndroid } from 'react-native';

export const cameraPermissionChecker = async () => {
    try {
        const result = await check(PERMISSIONS.ANDROID.CAMERA);
        return handlePermissionsResult(result);
    } catch {
        return false;
    }
};

export const requestCameraPermission = async () => {
    try {
        const result = await request(PERMISSIONS.ANDROID.CAMERA);
        return handlePermissionsResult(result);
    } catch {
        return false;
    }
};

export const mediaPermissionChecker = async () => {
    try {
        const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        return handlePermissionsResult(result);
    } catch {
        return false;
    }
};
export const requestMediaPermission = async () => {
    try {
        const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        return handlePermissionsResult(result);
    } catch {
        return false;
    }
};

const handlePermissionsResult = (result: string) => {
    switch (result) {
        case RESULTS.GRANTED:
            return true;
        default:
            return false;
    }
};

export const openCamera = async (setImageData: Function) => {
    launchCamera(
        {
            mediaType: 'photo',
            quality: 0.8,
            cameraType: 'back'
        },
        (result) => {
            handleFileSelection(result, setImageData);
        }
    );
};

export const openMedia = async (setImageData: Function) => {
    launchImageLibrary(
        {
            mediaType: 'photo',
            quality: 0.8
        },
        (result) => {
            handleFileSelection(result, setImageData);
        }
    );
};

const handleFileSelection = (
    result: ImagePickerResponse,
    setImageData: Function
) => {
    if (result.didCancel) {
        // ToastAndroid.show('File selection cancelled', ToastAndroid.LONG);
    } else if (result.assets) {
        setImageData(result.assets[0]);
    } else {
        ToastAndroid.show(
            result.errorMessage ?? 'Some error occured',
            ToastAndroid.LONG
        );
    }
};
