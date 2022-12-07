const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\d+$/;
export const EMAIL_REGEX_STRICT =
    '^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$';
export const isEmailValid = validateEmail;
export const isPhoneNumberValid = validatePhone;

export function validateEmail(mailId: string) {
    return !!EMAIL_REGEX.test(mailId);
}

export function validatePhone(phone: string) {
    return !!PHONE_REGEX.test(phone);
}
