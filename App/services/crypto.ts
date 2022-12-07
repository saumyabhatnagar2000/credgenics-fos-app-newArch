import config from '../config';
import RSA, { Hash } from 'react-native-fast-rsa';

export const encryptRSA = async (data: any) => {
    RSA.useJSI = true;
    let keyData = config.AUTH_PUBLIC_KEY;
    const encryptData = await RSA.encryptOAEP(
        JSON.stringify(data),
        '',
        Hash.SHA1,
        keyData
    );

    return encryptData;
};
