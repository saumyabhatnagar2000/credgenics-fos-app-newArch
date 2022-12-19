import {
    CompanyType,
    PortfolioFilterType,
    RequestMethods,
    SortPortfolioTypes,
} from './../../enums';
import {
    AuthData,
    LoansArrayType,
    LocationType,
    PortfolioLoan,
    RecoveryVariableType,
    SortBy,
    VisitData
} from './../../types';
import Urls from '../constants/Urls';
import { SortValue, TaskTypes } from '../../enums';
import { apiRequest } from './apiRequest';

const { FOS_SERVICE_BASE_URL, RECOVERY_SERVICE_BASE_URL, BASE_URL } = Urls;

export const loadPortfolioList = async (
    allocationMonth: string,
    pageNumber: number,
    pageSize: number,
    sortBy: SortBy,
    filterBy: any,
    authData?: AuthData,
    location?: any,
    searchQuery?: String,
    searchType?: string,
    nbfcFilters?: any,
    tagsFilters?: any
) => {
    return getPortfolioLoans(
        pageNumber,
        pageSize,
        allocationMonth,
        sortBy,
        filterBy,
        authData,
        location,
        searchQuery,
        searchType,
        nbfcFilters,
        tagsFilters
    );
};

export const getPortfolioLoans = async (
    pageNumber: number,
    pageSize: number,
    allocationMonth: string,
    sortFilters: SortBy,
    filters?: any,
    authData?: AuthData,
    location?: LocationType,
    searchQuery?: String,
    searchType?: string,
    nbfcFilters?: any,
    tagsFilters?: any
) => {
    const company_id = authData?.company_id;
    const sortBy = sortFilters.type;

    let sort_type;
    if (sortFilters.type === SortPortfolioTypes.date_of_default)
        sort_type = sortFilters.value === SortValue.ascending ? 'desc' : 'asc';
    else sort_type = sortFilters.value === SortValue.ascending ? 'asc' : 'desc';

    let filterString = encodeURIComponent(
        Object.keys(filters ?? {}).toString()
    ).trim();
    let nbfcFilterString = encodeURIComponent(
        Object.keys(nbfcFilters ?? {}).toString()
    ).trim();
    let tagsFilterString = encodeURIComponent(
        Object.keys(tagsFilters ?? {}).toString()
    ).trim();
    let current_coordinates = { latitude: 0, longitude: 0 };
    if (location?.latitude && location?.longitude) {
        current_coordinates.latitude = location?.latitude;
        current_coordinates.longitude = location?.longitude;
    }
    const url = `${RECOVERY_SERVICE_BASE_URL}/fos/portfolio?company_id=${company_id}&page_number=${pageNumber.toFixed()}&page_size=${pageSize}&company_type=loan&allocation_month=${allocationMonth}&sort=${sortBy}_${sort_type}&recovery_status=${filterString}&search_type=${
        searchType ?? ''
    }&query=${
        searchQuery ?? ''
    }&loan_nbfc_name=${nbfcFilterString}&tag_name=${tagsFilterString}&agent_email=${
        authData?.userId
    }`;
    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: {
            current_coordinates: location?.latitude ? current_coordinates : {}
        },
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const loadRecoveryPortfolioData = async (
    allocationMonth: string,
    pageNumber: number,
    pageSize: number,
    authData?: AuthData
) => {
    const company_id = authData?.company_id;
    const url = `${RECOVERY_SERVICE_BASE_URL}/portfolio?company_id=${company_id}&page_number=${pageNumber}&page_size=${pageSize}&company_type=loan&allocation_month=${allocationMonth}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const getUnattemptedLoansCount = async (
    allocationMonth: string,
    authData?: AuthData
) => {
    const company_id = authData?.company_id;
    const url = `${FOS_SERVICE_BASE_URL}/loans/unattempted?allocation_month=${allocationMonth}&company_id=${company_id}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const getPortfolioLoanDetails = async (
    allocationMonth: string,
    loanData: PortfolioLoan,
    authData?: AuthData
) => {
    const company_id = authData?.company_id;
    const address_index = loanData.address_index;
    const applicant_index = loanData?.applicant_index ?? -1;
    const applicant_type = loanData?.applicant_type;

    const loan_id = loanData.loan_id;
    const paramLoanId = encodeURIComponent(loan_id);

    const url = `${FOS_SERVICE_BASE_URL}/loan/details/${paramLoanId}?company_id=${company_id}&allocation_month=${allocationMonth}&applicant_type=${applicant_type}&address_index=${address_index}&applicant_index=${applicant_index}`;

    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const getLoanDetails = async (
    authData: AuthData,
    loan_id: string,
    fields: string,
    allocationMonth: string
) => {
    const company_id = authData?.company_id;
    const paramLoanId = encodeURIComponent(loan_id);

    const url = `${RECOVERY_SERVICE_BASE_URL}/loan/details/${paramLoanId}?company_id=${company_id}&allocation_month=${allocationMonth}&fields=${fields}`;

    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const getFilterStatuses = async (
    allocationMonth: string,
    companyType?: string,
    type?: string,
    authData?: AuthData
) => {
    let filterTags: string;
    if (type == PortfolioFilterType.status) {
        filterTags = 'recovery_status,loan_status';
    } else if (type == PortfolioFilterType.nbfc) filterTags = 'loan_nbfc_name';
    else filterTags = 'tag_name';
    const url = `${RECOVERY_SERVICE_BASE_URL}/portfolio/filter?company_id=${authData?.company_id}&page_number=1&page_size=10&company_type=${companyType}&allocation_month=${allocationMonth}&search_type=loan_id&filters=${filterTags}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const getFilterTags = async (
    allocationMonth: string,
    companyType?: string,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/portfolio/filter?company_id=${authData?.company_id}&page_number=1&page_size=10&company_type=${companyType}&allocation_month=${allocationMonth}&search_type=loan_id&filters=tag_name`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const getActivitySummary = async (
    authData: AuthData,
    loanData: PortfolioLoan,
    allocationMonth: string
) => {
    const loan_id = loanData.loan_id;
    const paramLoanId = encodeURIComponent(loan_id);
    const company_id = authData?.company_id;
    const url = `${FOS_SERVICE_BASE_URL}/activity/summary/${paramLoanId}?company_id=${company_id}&allocation_month=${allocationMonth}`;

    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const createTask = async (
    visitData: VisitData,
    allocationMonth: string,
    taskType: TaskTypes,
    authData?: AuthData,
    isUnplanned?: Boolean,
    reminderFrom?: String,
    reminderId?: String
) => {
    const url = `${FOS_SERVICE_BASE_URL}/${taskType}`;
    try {
        const response = await apiRequest({
            url,
            method: RequestMethods.post,
            body: {
                allocation_month: allocationMonth,
                applicant_index: visitData?.applicant_index,
                applicant_name: visitData?.applicant_name,
                applicant_type: visitData?.applicant_type,
                comment: visitData?.comment,
                company_id: authData?.company_id,
                loan_id: visitData?.loan_id,
                ...(taskType == TaskTypes.ptp && {
                    reminder_from: reminderFrom ?? ''
                }),
                reminder_id: reminderId ?? '',
                unplanned: isUnplanned,
                visit_date: visitData?.visit_date
            },
            headers: {
                authenticationtoken: authData?.authenticationtoken,
                role: authData?.role
            }
        });
        return response;
    } catch (error: any) {
        throw error;
    }
};

export const createBulkTask = async (
    visitData: Array<PortfolioLoan>,
    allocationMonth: string,
    comment: string,
    taskType: TaskTypes,
    visit_date: string,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/${taskType}/bulk`;
    const loanData = visitData.map((_item) => {
        return {
            loan_id: _item.loan_id,
            applicant_index: _item.applicant_index,
            applicant_type: _item.applicant_type,
            applicant_name: _item.applicant_name,
            comment,
            loan_status: _item.final_status
        };
    });
    const data = {
        allocation_month: allocationMonth,
        company_id: authData?.company_id,
        loans: loanData,
        visit_date: visit_date
    };
    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: data,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const updateContactDetails = async (
    loan_id: string,
    data: any,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/loan/${loan_id}?company_id=${authData?.company_id}`;
    const response = await apiRequest({
        url,
        method: RequestMethods.patch,
        body: data,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const loadCustomerList = async (
    allocationMonth: string,
    pageNumber: number,
    pageSize: number,
    sortBy: SortBy,
    filterBy: any,
    authData?: AuthData,
    location?: any,
    searchQuery?: String,
    searchType?: string,
    nbfcFilters?: any
) => {
    return getCustomerList(
        pageNumber,
        pageSize,
        allocationMonth,
        sortBy,
        filterBy,
        authData,
        location,
        searchQuery,
        searchType,
        nbfcFilters
    );
};

export const getCustomerList = async (
    pageNumber: number,
    pageSize: number,
    allocationMonth: string,
    sortFilters: SortBy,
    filters?: any,
    authData?: AuthData,
    location?: LocationType,
    searchQuery?: String,
    searchType?: string,
    nbfcFilters?: any
) => {
    const company_id = authData?.company_id;
    const sortBy = sortFilters.type;
    let sort_type;
    if (sortFilters.type === SortPortfolioTypes.date_of_default)
        sort_type = sortFilters.value === SortValue.ascending ? 'desc' : 'asc';
    else sort_type = sortFilters.value === SortValue.ascending ? 'asc' : 'desc';
    let filterString = encodeURIComponent(
        Object.keys(filters ?? {}).toString()
    ).trim();
    let nbfcFilterString = encodeURIComponent(
        Object.keys(nbfcFilters ?? {}).toString()
    ).trim();
    const url = `${RECOVERY_SERVICE_BASE_URL}/fos/portfolio?company_id=${company_id}&page_number=${pageNumber.toFixed()}&page_size=${pageSize}&company_type=${
        CompanyType.credit_line
    }&allocation_month=${allocationMonth}&sort=${sortBy}_${sort_type}&recovery_status=${
        filterString ?? ''
    }&search_type=${searchType ?? ''}&query=${
        searchQuery ?? ''
    }&loan_nbfc_name=${nbfcFilterString ?? ''}`;

    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: {
            current_coordinates: {
                longitude: location?.longitude,
                latitude: location?.latitude
            }
        },
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });

    return response;
};
export const getLoanDetailsFromId = async (
    loanId: string,
    authData?: AuthData
) => {
    const paramLoanId = encodeURIComponent(loanId);
    const url = `${RECOVERY_SERVICE_BASE_URL}/loan/${paramLoanId}?company_id=${authData?.company_id}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response?.data?.output?.loan_details?.defaults?.[0] ?? {};
};

export const getCustomerProfile = async (
    customerId: string,
    allocationMonth: string,
    authData?: AuthData
) => {
    const paramCustomerId = encodeURIComponent(customerId);
    const url = `${RECOVERY_SERVICE_BASE_URL}/customer/profile/${paramCustomerId}?company_id=${authData?.company_id}&allocation_month=${allocationMonth}`;
    const response = await apiRequest({
        url,
        method: RequestMethods.get,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const getTransactionList = async (
    allicationMonth: string,
    customerId: string,
    authData?: AuthData
) => {
    const paramCustomerId = encodeURIComponent(customerId);
    const url = `${RECOVERY_SERVICE_BASE_URL}/customer/transactions/${paramCustomerId}?company_id=${authData?.company_id}&allocation_month=${allicationMonth}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};
export const getRecVar = async (authData?: AuthData) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/company/recovery/variables?company_id=${authData?.company_id}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    const activeKeys: string[] = [];
    response?.data?.variables?.forEach((varObj: RecoveryVariableType) =>
        activeKeys.push(varObj.variable_name)
    );
    return activeKeys;
};

export const getLoanProfile = async (
    loanId: string,
    allocationMonth: string,
    authData?: AuthData
) => {
    const paramLoanId = encodeURIComponent(loanId);
    const url = `${RECOVERY_SERVICE_BASE_URL}/loan-profile/${paramLoanId}?company_id=${authData?.company_id}&allocation_month=${allocationMonth}`;
    const response = await apiRequest({
        url,
        method: RequestMethods.get,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const updateCustomerProfile = async (
    customerId: string,
    transactionId: string,
    data: any,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/transaction/${customerId}/${transactionId}?company_id=${authData?.company_id}`;
    const response = await apiRequest({
        url,
        method: RequestMethods.patch,
        body: data,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const calculateLateFees = async (
    loanId: string,
    days: string,
    allocationMonth: string,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/company-formula/${loanId}?company_id=${
        authData?.company_id
    }&allocation_month=${allocationMonth}&days=${days.replace(
        '.',
        ''
    )}&amount_variable=late_fee`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const getDigitalNotice = async (
    loanId: string,
    allocationMonth: string,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/notices/sent/${loanId}?company_id=${authData?.company_id}&allocation_month=${allocationMonth}&is_delivered=true`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const getSpeedPost = async (
    loanId: string,
    allocationMonth: string,
    authData?: AuthData
) => {
    const url = `/scrape/speedposts?company_id=${authData?.company_id}&allocation_month=${allocationMonth}&loan_id=${loanId}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const getLoanDatafromIds = async (
    loanId: string,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/bulk/loan`;
    const body = {
        company_id: authData?.company_id,
        loan_ids: [loanId],
        page_size: 10,
        fields: 'loan'
    };
    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const getAddressDatafromLoanIds = async (
    loanId: string,
    allocationMonth: string,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/fos/allocation/address-data`;
    const body = {
        loan_id: [loanId],
        allocation_month: allocationMonth,
        company_id: authData?.company_id
    };

    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        },
        body
    });
    return response;
};

export const getLoanDetailsWithLoan = async (
    loansArray?: Array<LoansArrayType>,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/visit/loan/details`;
    const response = await apiRequest({
        url: url,
        method: RequestMethods.post,
        body: {
            company_id: authData?.company_id,
            loans: loansArray,
            requiredFields: ['Loan_data', 'Address_data', 'last_location']
        },
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    // console.log(response?.data);
    return response?.data;
};
