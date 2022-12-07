import { SearchTypes } from './../../enums';
export const HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

export const cameraPermissionTitle = 'Camera Permission Required!';
export const mediaPermissionTitle = 'Media Permission Required!';
export const mediaPermissionContent =
    'To continue,give media permission to the app from settings-> apps -> fos -> permissions -> media.';
export const cameraPermissionContent =
    'To continue,give camera permission to the app from settings-> apps -> fos -> permissions -> camera.';
export const locationPermissionTitle = 'Location Permission Required!';
export const locationPermissionContent = `The app needs Location Permission.\nPlease grant Location Permission, else you won't be able to use the app.\n\nFor granting location permission choose Permissions->Location->(Allow all the time) and Restart app. `;
export const locationPermissionPartialContent = `This features needs location permission.\nPlease grant Location Permission,else you won't be able to use this feature.\n\nGrant the feature and reload the screen to use the feature`;

export const logoutTitle = 'Logout';
export const logoutContent = 'Are you sure you want to logout?';

export const PortfolioSearchTypes = {
    applicant_name: SearchTypes.applicant_name,
    loan_id: SearchTypes.loan_id
};
export const PortfolioSearchCreditLineTypes = {
    customer_name: SearchTypes.applicant_name,
    customer_id: SearchTypes.loan_id
};
export const VisitSearchTypes = {
    applicant_name: SearchTypes.applicant_name,
    loan_id: SearchTypes.loan_id
};
export const VisitSearchCreditLineTypes = {
    customer_name: SearchTypes.applicant_name,
    customer_id: SearchTypes.loan_id
};

export const BankBranchDepositSearchTypes = {
    bank_name: SearchTypes.bank_name,
    branch_name: SearchTypes.branch_name
};

export const CompanyBranchDepositSearchTypes = {
    branch_name: SearchTypes.branch_name,
    branch_code: SearchTypes.branch_code
};
export const get_email_body = (
    amount: string,
    visit_date: string,
    loan_id: string,
    companyName: string,
    name?: string
) => {
    return `{otp} is your OTP to approve the collection of Rs. ${amount} received on ${visit_date},  against the loan ${loan_id} issued from ${companyName}. Please do not share the OTP with anyone other than the authorized collection representative ${name}`;
};
export const get_sms_body = (
    amount: string,
    visit_date: string,
    loan_id: string,
    companyName: string,
    name?: string
) => {
    return `Hi,
{otp} is your OTP to approve the collection of Rs. ${amount} received on ${visit_date},  against the loan ${loan_id} issued from ${companyName}. Please do not share the OTP with anyone other than the authorized collection representative ${name}.
Sent by
Credgenics`;
};
export const Overall = 'Overall';

export const SMS_CONTENT_TEMPLATE_ID = '1107164742184413487';
export const SMS_PRINCIPAL_ENTITY_ID = '1101360080000040019';
export const otp_max_try_error_string =
    'Maximum limit for entering the invalid OTP reached! You may try again after 5 mins';
export const ROOTED_DEVICE_TEXT = `This device is rooted.\nYou can't use the app in a rooted device.`;

export const LOAN_STATUS_TEXT = [
    'Closed by Agent',
    'Partially Recovered by Agent'
];

export const SOMETHING_WENT_WRONG = 'Something went wrong';
export const COLLECTION_LIMIT_ERROR_TEXT = 'Collection Limit exceeded';
export const ROUTE_PLANNING_NOT_ALLOWED = `You can't select new visits in an already planned route. Reset to make modifications to the route!`;
export const SUPPORT_EMAIL = 'support@credgenics.com';

export const VISITS_PTPS_OPEN = '(Visits/PTPs already open for these loans)';
export const VISIT_PTP_OPEN = '(Visit/PTP already open for this loan)';

export const get_deposit_otp_body = (
    depositAmount: string | number,
    depositDate: string,
    agentName?: string
) =>
    `{otp} is your OTP to approve the Deposit of Rs.${depositAmount}, received on ${depositDate}, from agent ${agentName} . Please do not share the OTP with anyone other than the authorised collection agent! -Credgenics`;

export const DEPOSIT_SMS_TEMPLATE_ID = '1107166211361126113';
export const NO_PERMISSION_CONTENT = {
    title: 'Access Denied!',
    body: 'Please contact your supervisor as you are not permitted to access the FOS app.\n\nRestart the app after permission is granted.'
};
export const DEPOSIT_TIMER_DURATION = 15;
export const MOCK_LOCATION_ENABLED = {
    title: 'Access Denied!',
    body: 'This application is not supported when mock locations are turned on.\n\nPlease go to your settings and turn them off to continue.'
};

export const CLOCK_IN_BEFORE_VISIT = 'Please clock in before closing any visit';
export const OFFLINE_NOT_ALLOWED_STRING =
    'We can’t support all the required functionalities since you are offline. Please wait for Internet connection to get restored';

export const LOAN_IS_CLOSED =
    'This loan is closed, visit/disposition form cannot be created.';
