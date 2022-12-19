import {
    AuthData,
    LocationType,
    SortBy,
    TaskSubmitType,
    TaskType
} from './../../types';
import {
    FilterTaskTypesText,
    RequestMethods,
    TaskCreatorType,
    TaskFilterType,
    TaskHistoryFilterType,
    TaskOptions,
    TaskRecoveryType
} from './../../enums';
import {
    getMonthEndDate,
    getMonthStartDate,
    getToday,
    getTomorrow,
    getWeekEndDate,
    getWeekStartDate,
    getYesterday
} from './utils';
import Urls from '../constants/Urls';
import { SortValue, TaskStatusTypes, TaskTypes } from '../../enums';
import { apiRequest } from './apiRequest';

const {
    FOS_SERVICE_BASE_URL,
    USER_SERVICE_BASE_URL,
    RECOVERY_SERVICE_BASE_URL
} = Urls;

export const loadTaskList = async (
    filters: SortBy,
    pageNumber: number,
    pageSize: number,
    authData?: AuthData,
    location?: any,
    status?: any,
    taskFilterType?: FilterTaskTypesText,
    searchQuery?: string,
    searchType?: string,
    selectedFilters?: any
) => {
    return getTasks(
        pageNumber,
        pageSize,
        filters,
        authData,
        location,
        status,
        taskFilterType,
        searchQuery,
        searchType,
        selectedFilters
    );
};

const getTasks = async (
    pageNumber: number,
    pageSize: number,
    filters: SortBy,
    authData?: AuthData,
    location?: LocationType,
    status: TaskStatusTypes = TaskStatusTypes.open,
    taskFilterType?: FilterTaskTypesText,
    searchQuery?: string,
    searchType?: string,
    selectedFilters?: any
) => {
    const sortBy = filters.type;
    const sort_type = filters.value === SortValue.ascending ? 'asc' : 'desc';

    let firstDate: string;
    let lastDate: string;

    const checkFilterDates = (dateType: string) => {
        if (status == TaskStatusTypes.open)
            return selectedFilters?.[TaskFilterType.scheduled_date]?.[dateType];
        return selectedFilters?.[TaskHistoryFilterType.submitted]?.[dateType];
    };

    if (checkFilterDates(FilterTaskTypesText.today)) {
        firstDate = getToday();
        lastDate = getToday();
    } else if (checkFilterDates(FilterTaskTypesText.tomorrow)) {
        firstDate = getTomorrow();
        lastDate = getTomorrow();
    } else if (checkFilterDates(FilterTaskTypesText.this_week)) {
        firstDate = getWeekStartDate();
        lastDate = getWeekEndDate();
    } else if (checkFilterDates(FilterTaskTypesText.this_month)) {
        firstDate = getMonthStartDate();
        lastDate = getMonthEndDate();
    } else if (checkFilterDates(FilterTaskTypesText.yesterday)) {
        firstDate = getYesterday();
        lastDate = getYesterday();
    } else {
        firstDate = '';
        lastDate = '';
    }

    let visit_purpose = '';
    const ptp =
        selectedFilters?.[TaskFilterType.visit_purpose]?.[TaskOptions.ptp];
    const visit =
        selectedFilters?.[TaskFilterType.visit_purpose]?.[
            TaskOptions.surprise_visit
        ];
    if (ptp) visit_purpose = 'ptp';
    if (visit) visit_purpose = 'surprise_visit';
    if (ptp && visit) visit_purpose = 'ptp,surprise_visit';

    let recoveryMethod = '';
    if (selectedFilters?.[TaskHistoryFilterType?.recovery_mode]) {
        recoveryMethod = Object.keys(
            selectedFilters[TaskHistoryFilterType.recovery_mode]
        ).join(',');
    }

    let self_scheduled = '';
    const agent =
        selectedFilters?.[TaskFilterType.visit_creator]?.[
            TaskCreatorType.agent
        ];
    const manager =
        selectedFilters?.[TaskFilterType.visit_creator]?.[
            TaskCreatorType.manager
        ];
    if (agent) self_scheduled = 'Agent';
    if (manager) self_scheduled = 'Manager';
    if (agent && manager) self_scheduled = 'Agent,Manager';

    let isRecoveryDone;
    if (!selectedFilters?.[TaskHistoryFilterType.recovery_done])
        isRecoveryDone = '';
    else
        isRecoveryDone = selectedFilters?.[
            TaskHistoryFilterType?.recovery_done
        ]?.[TaskRecoveryType.yes]
            ? true
            : false;

    const company_id = authData?.company_id;
    const url = `${FOS_SERVICE_BASE_URL}/visit?company_id=${company_id}&current_latitude=${
        location?.latitude ? location?.latitude : ''
    }&current_longitude=${
        location?.longitude ? location?.longitude : ''
    }&page_limit=${pageSize}&page_number=${pageNumber}&sort_type=${sort_type}&sort_by=${sortBy}&status=${status}&first_date=${
        firstDate ?? ''
    }&last_date=${lastDate ?? ''}&search_type=${searchType ?? ''}&query_term=${
        searchQuery ?? ''
    }&visit_purpose=${visit_purpose}&self_scheduled=${self_scheduled}&recovery_done=${isRecoveryDone}&payment_method=${recoveryMethod}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            role: authData?.role
        }
    });
    return response;
};

export const getTaskDetails = async (
    allocationMonth: string,
    loanData: TaskType,
    authData?: AuthData
) => {
    const company_id = authData?.company_id;
    const applicant_index = loanData?.applicant_index
        ? loanData.applicant_index
        : 0;
    const address_index = loanData.address_index;
    const applicant_type = loanData.applicant_type;

    const paramLoanId = encodeURIComponent(loanData.loan_id ?? '');
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
export const closeVisit = async (
    taskType: TaskTypes,
    taskData: TaskSubmitType,
    visit_id: string,
    recVarsFormData: any,
    isBifurcatedCollection: boolean,
    applicant_index: string,
    applicant_type: string,
    location: LocationType | any,
    address_location?: LocationType | any,
    allocationMonth?: string,
    applicant_name?: string,
    address?: any,
    isTransactionData?: boolean,
    authData?: AuthData,
    payment_details?: any
) => {
    const company_id = authData?.company_id;
    const final_statuses = JSON.stringify({
        disposition: taskData.final_status.disposition,
        ...(taskData.final_status.sub_disposition_1.length > 0 && {
            sub_disposition_1: taskData.final_status.sub_disposition_1
        }),
        ...(taskData.final_status.sub_disposition_2.length > 0 && {
            sub_disposition_2: taskData.final_status.sub_disposition_2
        })
    });
    const tempLocation = location?.latitude ? location : {};
    const url = `${FOS_SERVICE_BASE_URL}/visit/close`;

    const formData = new FormData();
    formData.append('loan_id', taskData.loan_id);
    formData.append('visit_id', visit_id);
    formData.append('visit_purpose', taskType);
    formData.append('is_customer_met', taskData.is_customer_met ? '1' : '0');
    formData.append('is_recovery_done', taskData.is_recovery_done ? '1' : '0');
    formData.append('is_visit_done', taskData.is_visit_done ? '1' : '0');
    formData.append('visit_proof_file', taskData.visit_proof_file);
    formData.append('visit_proof_coordinates', JSON.stringify(location));
    if (!!payment_details) {
        formData.append('payment_details', JSON.stringify(payment_details));
    }
    formData.append('payment_method', taskData.payment_method);
    formData.append('payment_proof_coordinates', JSON.stringify(location));
    formData.append('payment_proof_file', taskData.payment_proof_file);
    formData.append('amount_recovered', taskData.amount_recovered);
    if (isBifurcatedCollection) {
        formData.append('amount_bifurcation', JSON.stringify(recVarsFormData));
    }
    formData.append('company_id', company_id!);
    formData.append('allocation_month', allocationMonth!);
    formData.append('applicant_index', applicant_index);
    formData.append('applicant_type', applicant_type);
    formData.append('marked_location', JSON.stringify(tempLocation));
    formData.append('address_location', JSON.stringify(address_location));
    formData.append('agent_marked_status', final_statuses);
    formData.append(
        'reminder_id',
        taskData.reminder_id ? taskData.reminder_id : ''
    );
    formData.append('address', address ?? '');
    formData.append('applicant_name', applicant_name ?? '');
    formData.append('comment', taskData.comment ?? '');
    if (taskData.committed_amount.length != 0) {
        formData.append('committed_amount', taskData.committed_amount ?? '');
    }
    if (isTransactionData)
        formData.append(
            'transactions_data',
            JSON.stringify(taskData.transanctions_data)
        );
    const response = await apiRequest({
        url,
        body: formData,
        method: RequestMethods.patch,
        headers: {
            authenticationtoken: authData?.authenticationtoken,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
};


export const generateVisitOtp = async (data: any) => {
    const url = `${USER_SERVICE_BASE_URL}/public/send-otp`;
    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: data
    });
    return response;
};

export const verifyVisitOtp = async (data: any) => {
    const url = `${USER_SERVICE_BASE_URL}/public/check-otp`;
    const response = await apiRequest({
        url,
        method: RequestMethods.post,
        body: data
    });
    return response;
};

export const getFieldVisitHistory = async (
    loanId: string,
    authData?: AuthData
) => {
    const url = `${FOS_SERVICE_BASE_URL}/visit/history/${loanId}?company_id=${authData?.company_id}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};

export const getLastLocation = async (loanId: string, authData?: AuthData) => {
    const url = `${FOS_SERVICE_BASE_URL}/location/last?company_id=${authData?.company_id}&loan_id=${loanId}`;
    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        },
        toastMessage: 'error'
    });
    return response;
};

export const getTransactionData = async (
    customerId: string,
    allocationMonth: string,
    authData?: AuthData
) => {
    const url = `${RECOVERY_SERVICE_BASE_URL}/customer/transactions/${customerId}?company_id=${authData?.company_id}&allocation_month=${allocationMonth}`;

    const response = await apiRequest({
        url,
        headers: {
            authenticationtoken: authData?.authenticationtoken
        }
    });
    return response;
};
