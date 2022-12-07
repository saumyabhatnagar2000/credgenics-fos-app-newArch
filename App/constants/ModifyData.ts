import { LoanDetails } from './../components/loanDetails/LoanDetails';
import { AuthData } from './../../types';
import { getLastLocation } from '../services/taskService';
import { StringCompare } from '../services/utils';
import { ApplicantTypes } from '../../enums';
import _ from 'lodash';
import { Overall } from './constants';
import { getAddressDataKey } from './Keys';

export const modifyCustomerDetails = async (
    loanData: any,
    loanProfile: any,
    allocationMonth: string,
    totalLoanAmount?: number,
    totalClaimAmount?: number,
    amountRecovered?: number,
    authData?: AuthData
) => {
    let loanDetails: any = {};
    loanDetails.loan_details = [{}];
    loanDetails.loan_details[0].customer_id = loanData?.loan_id;
    loanDetails.loan_details[0].total_claim_amount = totalClaimAmount;
    loanDetails.loan_details[0].loan_type = loanProfile?.loan_type;
    loanDetails.loan_details[0].product_type = loanProfile?.product_type;
    loanDetails.loan_details[0].total_loan_amount = totalLoanAmount;
    loanDetails.loan_details[0].settlement_amount =
        loanProfile?.settlement_amount;
    loanDetails.loan_details[0].credit_bank_name =
        loanProfile?.credit_bank_name;
    loanDetails.loan_details[0].amount_recovered = amountRecovered;

    if (loanProfile?.persona)
        loanDetails.loan_details[0].persona = loanProfile?.persona;
    if (loanProfile?.talking_points)
        loanDetails.loan_details[0].talking_point = loanProfile?.talking_points;
    if (loanProfile?.treatment_recommended)
        loanDetails.loan_details[0].treatment_recommended =
            loanProfile?.treatment_recommended;

    let defaults = loanProfile?.defaults ?? [];
    const defaultsLength = loanProfile?.defaults?.length ?? 0;
    if (allocationMonth == Overall) {
        loanDetails.loan_details[0].settlement_amount =
            defaults[defaultsLength - 1]?.settlement_amount;
        loanDetails.loan_details[0].final_status =
            defaults[defaultsLength - 1]?.final_status;
    } else {
        for (let i = 0; i < defaults.length; i++) {
            if (StringCompare(defaults[i].allocation_month, allocationMonth)) {
                loanDetails.loan_details[0].settlement_amount =
                    defaults[i]?.settlement_amount;
                loanDetails.loan_details[0].final_status =
                    defaults[i]?.final_status;
                break;
            }
        }
    }
    if (loanData?.applicant_type === ApplicantTypes.applicant) {
        loanDetails.contact_number = loanProfile?.applicant_contact_number;
        loanDetails.applicant_photo_link = loanProfile?.applicant_photo_link;
        loanDetails.email_address = loanProfile?.applicant_email;
        loanDetails.address = {
            primary: {},
            other_addresses: [],
            last_location: {}
        };
        for (let i = 0; i < loanProfile?.applicant_address.length; i++) {
            if (
                loanData.address_index ==
                loanProfile?.applicant_address[i]?.address_id
            ) {
                loanDetails.address.primary = {
                    ...loanProfile?.applicant_address[i]
                };
                loanProfile.applicant_address = _.reject(
                    loanProfile?.applicant_address,
                    loanProfile?.applicant_address[i]
                );
                break;
            }
        }
        loanDetails.address.other_addresses = _.cloneDeep(
            loanProfile?.applicant_address
        );
        try {
            const apiResponse = await getLastLocation(
                loanData.loan_id,
                authData
            );
            if (apiResponse?.success) {
                loanDetails.address.last_location = {
                    marked_location: {
                        ...apiResponse?.data?.last_location
                    },
                    visit_date: apiResponse?.data?.visit_date ?? ''
                };
            }
        } catch (e: any) {}
    } else if (loanData?.applicant_type === ApplicantTypes.co_applicant) {
        loanDetails.co_applicant = loanProfile?.co_applicant;
        let co_applicant_object =
            loanProfile?.co_applicant?.[parseInt(loanData.applicant_index)] ??
            {};
        loanDetails.contact_number =
            co_applicant_object?.co_applicant_contact_number;
        loanDetails.applicant_photo_link =
            co_applicant_object?.co_applicant_photo_link;
        loanDetails.email_address = co_applicant_object?.co_applicant_email;
        loanDetails.address = {
            primary: {},
            other_addresses: [],
            last_location: {}
        };

        for (
            let i = 0;
            i < co_applicant_object?.co_applicant_address?.length;
            i++
        ) {
            co_applicant_object.co_applicant_address[i].id = i;
        }

        loanDetails.address.primary =
            co_applicant_object.co_applicant_address[
                parseInt(loanData.address_index)
            ];

        co_applicant_object.co_applicant_address = _.reject(
            co_applicant_object?.co_applicant_address,
            co_applicant_object?.co_applicant_address[
                parseInt(loanData.address_index)
            ]
        );
        loanDetails.address.other_addresses = _.cloneDeep(
            co_applicant_object?.co_applicant_address
        );
        try {
            const apiResponse = await getLastLocation(
                loanData.loan_id,
                authData
            );
            if (apiResponse?.success) {
                loanDetails.address.last_location = {
                    marked_location: {
                        ...apiResponse?.data?.last_location
                    }
                };
            }
        } catch {}
    }
    return loanDetails;
};

export const modifyLoanDetails = async (
    loanData: any,
    loanProfile: any,
    allocationMonth: string,
    showBalanceClaimAmount?: boolean,
    lastLocationReq?: boolean,
    authData?: AuthData
) => {
    let loanDetails: any = {};
    loanDetails.loan_details = [{}];
    loanDetails.loan_details[0].loan_type = loanProfile?.loan_type;
    loanDetails.loan_details[0].product_type = loanProfile?.product_type;
    loanDetails.loan_details[0].total_loan_amount =
        loanProfile?.total_loan_amount;
    if (loanProfile?.persona)
        loanDetails.loan_details[0].persona = loanProfile?.persona;
    if (loanProfile?.talking_points)
        loanDetails.loan_details[0].talking_point = loanProfile?.talking_points;
    if (loanProfile?.treatment_recommended)
        loanDetails.loan_details[0].treatment_recommended =
            loanProfile?.treatment_recommended;

    let defaults = loanProfile?.defaults ?? [];
    for (let i = 0; i < defaults.length; i++) {
        if (StringCompare(defaults[i].allocation_month, allocationMonth)) {
            loanDetails.loan_details[0].total_claim_amount =
                defaults[i]?.total_claim_amount;
            loanDetails.loan_details[0].late_fee = defaults[i]?.late_fee;
            loanDetails.loan_details[0].final_status =
                defaults[i]?.final_status;
            loanDetails.loan_details[0].date_of_default =
                defaults[i]?.date_of_default;
            if (showBalanceClaimAmount) {
                loanDetails.loan_details[0].balance_claim_amount =
                    defaults[i]?.balance_claim_amount;
            }
            break;
        }
    }
    if (loanData?.applicant_type === ApplicantTypes.applicant) {
        loanDetails.contact_number = loanProfile?.applicant_contact_number;
        loanDetails.applicant_photo_link = loanProfile?.applicant_photo_link;
        loanDetails.email_address = loanProfile?.applicant_email;
        loanDetails.address = {
            primary: {},
            other_addresses: [],
            last_location: {}
        };
        for (let i = 0; i < loanProfile?.applicant_address.length; i++) {
            if (
                loanData.address_index == loanProfile?.applicant_address[i]?.id
            ) {
                loanDetails.address.primary = {
                    ...loanProfile?.applicant_address[i]
                };
                loanProfile.applicant_address = _.reject(
                    loanProfile?.applicant_address,
                    loanProfile?.applicant_address[i]
                );
                break;
            }
        }
        loanDetails.address.other_addresses = _.cloneDeep(
            loanProfile?.applicant_address
        );
        if (lastLocationReq) {
            try {
                const apiResponse = await getLastLocation(
                    loanData.loan_id,
                    authData
                );
                if (apiResponse?.success) {
                    loanDetails.address.last_location = {
                        marked_location: {
                            ...apiResponse?.data?.last_location
                        },
                        visit_date: apiResponse?.data?.visit_date ?? ''
                    };
                }
            } catch {}
        }
    } else if (loanData?.applicant_type === ApplicantTypes.co_applicant) {
        loanDetails.co_applicant = loanProfile?.co_applicant;
        let co_applicant_object =
            loanProfile?.co_applicant?.[parseInt(loanData.applicant_index)] ??
            {};
        loanDetails.contact_number =
            co_applicant_object?.co_applicant_contact_number;
        loanDetails.applicant_photo_link =
            co_applicant_object?.co_applicant_photo_link;
        loanDetails.email_address = co_applicant_object?.co_applicant_email;
        loanDetails.address = {
            primary: {},
            other_addresses: [],
            last_location: {}
        };

        for (
            let i = 0;
            i < co_applicant_object?.co_applicant_address?.length;
            i++
        ) {
            co_applicant_object.co_applicant_address[i].id = i;
        }

        loanDetails.address.primary =
            co_applicant_object.co_applicant_address[
                parseInt(loanData.address_index)
            ];

        co_applicant_object.co_applicant_address = _.reject(
            co_applicant_object?.co_applicant_address,
            co_applicant_object?.co_applicant_address[
                parseInt(loanData.address_index)
            ]
        );
        loanDetails.address.other_addresses = _.cloneDeep(
            co_applicant_object?.co_applicant_address
        );
        try {
            const apiResponse = await getLastLocation(
                loanData.loan_id,
                authData
            );
            if (apiResponse?.success) {
                loanDetails.address.last_location = {
                    marked_location: {
                        ...apiResponse?.data?.last_location
                    }
                };
            }
        } catch (e: any) {}
    }
    return loanDetails;
};

export const modifyReduxLoanDetails = async (
    loanProfile: any,
    allocationMonth: string,
    showBalanceClaimAmount?: boolean
) => {
    let loanDetails: any = {};
    loanDetails.loan_details = [{}];
    const key = getAddressDataKey(allocationMonth);
    let addressData = loanProfile[key];
    const last_location = loanProfile?.last_location;
    loanProfile = { ...loanProfile.loan_data };
    loanDetails.loan_details[0].loan_type = loanProfile?.loan_type;
    loanDetails.loan_details[0].product_type = loanProfile?.product_type;
    loanDetails.loan_details[0].total_loan_amount =
        loanProfile?.total_loan_amount;
    if (loanProfile?.persona)
        loanDetails.loan_details[0].persona = loanProfile?.persona;
    if (loanProfile?.talking_points)
        loanDetails.loan_details[0].talking_point = loanProfile?.talking_points;
    if (loanProfile?.treatment_recommended)
        loanDetails.loan_details[0].treatment_recommended =
            loanProfile?.treatment_recommended;

    let defaults = loanProfile?.defaults ?? [];
    for (let i = 0; i < defaults.length; i++) {
        if (StringCompare(defaults[i].allocation_month, allocationMonth)) {
            loanDetails.loan_details[0].total_claim_amount =
                defaults[i]?.total_claim_amount;
            loanDetails.loan_details[0].late_fee = defaults[i]?.late_fee;
            loanDetails.loan_details[0].final_status =
                defaults[i]?.final_status;
            loanDetails.loan_details[0].date_of_default =
                defaults[i]?.date_of_default;
            if (showBalanceClaimAmount) {
                loanDetails.loan_details[0].balance_claim_amount =
                    defaults[i]?.balance_claim_amount;
            }
            break;
        }
    }
    if (addressData?.applicant_type === ApplicantTypes.applicant) {
        loanDetails.contact_number = loanProfile?.applicant_contact_number;
        loanDetails.applicant_photo_link = loanProfile?.applicant_photo_link;
        loanDetails.email_address = loanProfile?.applicant_email;
        loanDetails.address = {
            primary: {},
            other_addresses: [],
            last_location: {}
        };
        for (let i = 0; i < loanProfile?.applicant_address.length; i++) {
            if (
                addressData.address_index ==
                loanProfile?.applicant_address[i]?.address_id
            ) {
                loanDetails.address.primary = {
                    ...loanProfile?.applicant_address[i]
                };
                loanProfile.applicant_address = _.reject(
                    loanProfile?.applicant_address,
                    loanProfile?.applicant_address[i]
                );
                break;
            }
        }
        loanDetails.address.other_addresses = _.cloneDeep(
            loanProfile?.applicant_address
        );
        loanDetails.address.last_location = {
            marked_location: last_location?.marked_location ?? {},
            visit_date: last_location?.visit_date ?? ''
        };
    } else if (addressData?.applicant_type === ApplicantTypes.co_applicant) {
        loanDetails.co_applicant = loanProfile?.co_applicant;
        let co_applicant_object = {
            ...(loanProfile?.co_applicant?.[addressData.applicant_index] ?? {})
        };
        loanDetails.contact_number =
            co_applicant_object?.co_applicant_contact_number;
        loanDetails.applicant_photo_link =
            co_applicant_object?.co_applicant_photo_link;
        loanDetails.email_address = co_applicant_object?.co_applicant_email;
        loanDetails.address = {
            primary: {},
            other_addresses: [],
            last_location: {}
        };

        for (
            let i = 0;
            i < co_applicant_object?.co_applicant_address?.length;
            i++
        ) {
            co_applicant_object.co_applicant_address[i].address_id = i;
        }

        loanDetails.address.primary =
            co_applicant_object.co_applicant_address[
                parseInt(addressData.address_index)
            ];

        co_applicant_object.co_applicant_address = _.reject(
            co_applicant_object?.co_applicant_address,
            co_applicant_object?.co_applicant_address[addressData.address_index]
        );

        loanDetails.address.other_addresses = _.cloneDeep(
            co_applicant_object?.co_applicant_address
        );
        loanDetails.address.last_location = {
            marked_location: last_location?.marked_location ?? {},
            visit_date: last_location?.visit_date ?? ''
        };
    }
    return loanDetails;
};

export const modifyReduxCustomerDetails = (
    loanProfile: any,
    loanData: any,
    allocationMonth: string,
    totalClaimAmount: number,
    totalLoanAmount: number,
    amountRecovered: number
) => {
    let loanDetails: any = {};
    loanDetails.loan_details = [{}];
    const key = getAddressDataKey(allocationMonth);
    const addressData = loanProfile[key];
    const last_location = loanProfile?.last_location;
    loanProfile = { ...loanProfile.loan_data };

    loanDetails.loan_details[0].customer_id = loanData?.loan_id;
    loanDetails.loan_details[0].total_claim_amount = totalClaimAmount;
    loanDetails.loan_details[0].loan_type = loanProfile?.loan_type;
    loanDetails.loan_details[0].product_type = loanProfile?.product_type;
    loanDetails.loan_details[0].total_loan_amount = totalLoanAmount;
    loanDetails.loan_details[0].settlement_amount =
        loanProfile?.settlement_amount;
    loanDetails.loan_details[0].credit_bank_name =
        loanProfile?.credit_bank_name;
    loanDetails.loan_details[0].amount_recovered = amountRecovered;

    if (loanProfile?.persona)
        loanDetails.loan_details[0].persona = loanProfile?.persona;
    if (loanProfile?.talking_points)
        loanDetails.loan_details[0].talking_point = loanProfile?.talking_points;
    if (loanProfile?.treatment_recommended)
        loanDetails.loan_details[0].treatment_recommended =
            loanProfile?.treatment_recommended;

    let defaults = loanProfile?.defaults ?? [];
    const defaultsLength = loanProfile?.defaults?.length ?? 0;
    if (allocationMonth == Overall) {
        loanDetails.loan_details[0].settlement_amount =
            defaults[defaultsLength - 1]?.settlement_amount;
        loanDetails.loan_details[0].final_status =
            defaults[defaultsLength - 1]?.final_status;
    } else {
        for (let i = 0; i < defaults.length; i++) {
            if (StringCompare(defaults[i].allocation_month, allocationMonth)) {
                loanDetails.loan_details[0].settlement_amount =
                    defaults[i]?.settlement_amount;
                loanDetails.loan_details[0].final_status =
                    defaults[i]?.final_status;
                break;
            }
        }
    }
    if (addressData?.applicant_type === ApplicantTypes.applicant) {
        loanDetails.contact_number = loanProfile?.applicant_contact_number;
        loanDetails.applicant_photo_link = loanProfile?.applicant_photo_link;
        loanDetails.email_address = loanProfile?.applicant_email;
        loanDetails.address = {
            primary: {},
            other_addresses: [],
            last_location: {}
        };
        for (let i = 0; i < loanProfile?.applicant_address.length; i++) {
            if (
                addressData.address_index ==
                loanProfile?.applicant_address[i]?.address_id
            ) {
                loanDetails.address.primary = {
                    ...loanProfile?.applicant_address[i]
                };
                loanProfile.applicant_address = _.reject(
                    loanProfile?.applicant_address,
                    loanProfile?.applicant_address[i]
                );
                break;
            }
        }
        loanDetails.address.other_addresses = _.cloneDeep(
            loanProfile?.applicant_address
        );
        try {
            loanDetails.address.last_location = {
                marked_location: last_location?.marked_location ?? {},
                visit_date: last_location?.visit_date ?? ''
            };
        } catch (e: any) {}
    } else if (addressData?.applicant_type === ApplicantTypes.co_applicant) {
        loanDetails.co_applicant = loanProfile?.co_applicant;
        let co_applicant_object =
            loanProfile?.co_applicant?.[
                parseInt(addressData.applicant_index)
            ] ?? {};
        loanDetails.contact_number =
            co_applicant_object?.co_applicant_contact_number;
        loanDetails.applicant_photo_link =
            co_applicant_object?.co_applicant_photo_link;
        loanDetails.email_address = co_applicant_object?.co_applicant_email;
        loanDetails.address = {
            primary: {},
            other_addresses: [],
            last_location: {}
        };

        for (
            let i = 0;
            i < co_applicant_object?.co_applicant_address?.length;
            i++
        ) {
            co_applicant_object.co_applicant_address[i].id = i;
        }

        loanDetails.address.primary =
            co_applicant_object.co_applicant_address[
                parseInt(addressData.address_index)
            ];

        co_applicant_object.co_applicant_address = _.reject(
            co_applicant_object?.co_applicant_address,
            co_applicant_object?.co_applicant_address[
                parseInt(addressData.address_index)
            ]
        );
        loanDetails.address.other_addresses = _.cloneDeep(
            co_applicant_object?.co_applicant_address
        );
        loanDetails.address.last_location = {
            marked_location: last_location?.marked_location ?? {},
            visit_date: last_location?.visit_date ?? ''
        };
    }
    return loanDetails;
};

export const modifyCallingHistory = (calls: any) => {
    let calling_history: any = [];
    if (calls) {
        for (let i = 0; i < calls.length; i++) {
            let call: any = {};
            let comm_dict = calls[i]?.comm_dict;
            call.call_to = comm_dict.to;
            call.applicant_type = comm_dict.applicant_type;
            call.call_type = comm_dict.call_type;
            call.call_status = comm_dict.call_status;
            call['duration (in sec)'] = comm_dict.duration;
            call.call_start_time = comm_dict.call_start_time;
            call.call_end_time = comm_dict.call_end_time;
            call.recording = comm_dict.recording_url;
            call.committed_amount = comm_dict.committed_amount;
            call.sub_disposition_1 = comm_dict.sub_disposition_1;
            call.sub_disposition_2 = comm_dict.sub_disposition_2;
            call.call_disposition = calls[i].status;
            call.representative = calls[i].author;
            call.role = calls[i].role;
            calling_history.push(call);
        }
    }
    return calling_history;
};

export const getDefaultObject = (loanDetails: any, allocationMonth: string) => {
    let defaults = loanDetails?.defaults ?? [];
    let currentDefault = {};
    for (let i = 0; i < defaults.length; i++) {
        if (StringCompare(defaults[i].allocation_month, allocationMonth)) {
            currentDefault = defaults[i];
        }
    }
    return currentDefault;
};
