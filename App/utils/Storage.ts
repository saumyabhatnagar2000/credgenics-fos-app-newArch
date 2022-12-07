import EncryptedStorage from 'react-native-encrypted-storage';

export async function setStorageData(key: string, data: any) {
    return EncryptedStorage.setItem(key, data);
}

export async function deleteStorageData(key: string) {
    return EncryptedStorage.removeItem(key);
}

export async function getStorageData(key: string) {
    return EncryptedStorage.getItem(key);
}
