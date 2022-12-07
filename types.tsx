import { Moment } from 'moment';
import React from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureResponderEvent, KeyboardTypeOptions } from 'react-native';
import {
    ClockedInOutStatues,
    SortPortfolioTypes,
    SortValue,
    TaskTypes,
    DepositTypes,
    CallingModeTypes,
    SortTaskTypes,
    CurrencyTypes,
    QuestionTypes,
    FilterTaskTypesText,
    PortfolioFilterType,
    CountryCodes,
    FilterDepositTypes,
    CompanyType,
    TaskScheduledByType,
    TaskFilterType,
    VisitPurposeType,
    TaskSortAndFilterActiveType,
    LocationAccessType,
    PermissionType,
    ExpandableCardTypes,
    TaskHistoryFilterType,
    BankBranchType
} from './enums';

export type RootStackParamList = {
    Root: undefined;
    NotFound: undefined;
    Drawer: undefined;
    DrawerRight: undefined;
    PortfolioDetailScreen: undefined;
    NewTaskScreen: undefined;
    TaskDetailScreen: undefined;
    DepositSubmitScreen: undefined;
    DepositBranchScreen: undefined;
    ReceiptPDFScreen: undefined;
    LoanDetailsScreen: undefined;
    CustomerProfileScreen: undefined;
    QuestionnaireScreen: undefined;
    AddAddressScreen: undefined;
    DispositionFormScreen: undefined;
    CreditTaskDetails: undefined;
    CombineHistoryScreen: undefined;
    HelpSectionScreen: undefined;
    HelpSectionDetailsScreen: undefined;
    MapScreen: undefined;
    HistoryScreen: undefined;
    FieldVisitHistory: undefined;
    DepositHistory: undefined;
    DepositTimerScreen:
        | {
              depositAmount: number;
              depositData: Array<PendingDepositType>;
              depositId: string;
          }
        | undefined;
};

export type BottomTabParamList = {
    PortfolioScreen: undefined;
    PTPScreen: undefined;
    FieldVisitScreen: undefined;
    DepositPendingScreen: undefined;
    HomeTab: undefined;
};

export type HistoryTabParamList = {
    PTPHistory: undefined;
    FieldVisitHistory: undefined;
    DepositHistory: undefined;
};

export type LoginParamList = {
    LoginScreen: undefined;
    OTPScreen: undefined;
    ResetPasswordScreen: undefined;
    NewPasswordScreen: undefined;
    Dawer: undefined;
    HelpSectionScreen: undefined;
};

export type ErrorNavigator = {
    NoInternetScreen: undefined;
};

export type onPressFunc = (event: GestureResponderEvent) => void;

type BadgeData = {
    label: string;
    color: string;
    backgroundColor: string;
};

export type UserCredentials = {
    username: string;
    password: string;
    source: string;
    device_id?: string;
    device_name?: string;
    trademark?: string;
};

export type ClockInStatusContextData = {
    clockedInTime: string | null;
    setClockedInTime: React.Dispatch<React.SetStateAction<string | null>>;
    clockTime: string | null;
    setClockTime: React.Dispatch<React.SetStateAction<string | null>>;
    clockInStatus: boolean | null;
    setClockInStatus: React.Dispatch<React.SetStateAction<boolean | null>>;
    updateLoggedInStatus(): Promise<string>;
    checkClockInNudge: (page: string) => Promise<void>;
    showNudge: () => void;
    showClockInBottomSheet: () => void;
    hideClockInBottomSheet: () => void;
    bottomSheetRef: React.RefObject<BottomSheet>;
    autoClockOut: Function;
};

export type LocationContextData = {
    checkLocation: Function;
    locationPermission: PermissionType | undefined;
    setLocationPermission: React.Dispatch<
        React.SetStateAction<PermissionType | undefined>
    >;
    showLocationDialog: boolean;
    setShowLocationDialog: React.Dispatch<React.SetStateAction<boolean>>;
    requestLocation: Function;
    allowLocationAccess: Function;
    getCurrentPermission: Function;
};

export type locationResultType = {
    access: boolean;
    location: Partial<LocationType | undefined>;
    isMocked: boolean;
};

export type AuthContextData = {
    authData?: AuthData;
    userName?: string;
    allocationMonth: string;
    depositBranch?: DepositBranchType;
    companyName: string;
    setDepositBranch: React.Dispatch<
        React.SetStateAction<DepositBranchType | undefined>
    >;
    otpVerificationRequired: boolean;
    setAllocationMonth: React.Dispatch<React.SetStateAction<string>>;
    verification(userData: AuthData): Promise<void>;
    signIn(
        username: string,
        loginType: string,
        companyName: string
    ): Promise<void>;
    signOut(): void;
    collectionModes: DepositTypes[];
    depositModes: DepositTypes[];
    callingModes: CallingModeTypes[];
    currencySymbol: CurrencyTypes | string;
    getCurrencyString: any;
    getMaskedNumber: Function;
    isFeedbackResponseNeeded: boolean;
    isRightDrawer: boolean;
    setIsRightDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    geoFencingRequired: boolean | undefined;
    countryIsdCode: string;
    country: CountryCodes;
    setCountry: React.Dispatch<React.SetStateAction<CountryCodes>>;
    geofencingDistance: number;
    initCountry: Function;
    companyType: CompanyType | undefined;
    isRecoveryAmountBifurcationEnabled: boolean;
    showBalanceClaimAmount: boolean;
    locationAccess: LocationAccessType | undefined;
    isRoutePlanningEnabled: boolean;
    FOSAccessPermitted: boolean;
    setFOSAccessPermitted: React.Dispatch<React.SetStateAction<boolean>>;
    depositBranchLocation: string;
    showCompanyBranchRepresentatives: boolean;
    onlineCollectionMode: string;
    depositOtpVerificationMethod: string;
    chequeDetailsInput: boolean;
    mockLocationEnabled: boolean;
    setMockLocationEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    updateCollectionLimitsDetails: Function;
    companyAddressCity: string;
    companyAddressState: string;
    companyAddressPincode: string;
    companyAddressText: string;
    companyLogo: string;
};

export type AuthData = {
    authenticationtoken: string | undefined;
    userId: string;
    company_id: string;
    name: string;
    role: string;
    mobile: string;
    agent_id?: string;
};

export type LoginOTPData = {
    username?: string;
    login_otp: string;
    request_id?: string;
};

export type ForgotOTPData = {
    username?: string;
    forgot_otp: string;
};

export type PortfolioLoan = {
    loan_id: string;
    applicant_name: string;
    applicant_type: string;
    date_of_default: string;
    total_claim_amount: number;
    distance_in_km: string;
    address_index: number;
    applicant_index?: number;
    final_status: string;
    applicant_photo_link?: string;
    number_of_transactions?: string;
    dpd?: string;
};

export type PortfolioRowType = {
    rowData: PortfolioLoan;
    checked: boolean;
    onCheckboxClicked: Function;
    onCallClicked: Function;
    onItemClicked: Function;
    details?: LoanInternalDetailsType;
};

export type TaskRowType = {
    rowData: TaskType;
    onClick?: Function;
    onCheckboxClicked?: Function;
    checked?: boolean;
};

export type IconType = {
    iconColor: string;
    iconName: string;
    iconType: string;
    component?: () => JSX.Element;
};

export type IconInputType = {
    placeholder: string;
    icon: IconType;
    value?: string;
    setText?: React.Dispatch<React.SetStateAction<string>>;
    compRef?: React.RefObject<any>;
    error?: boolean;
    loading?: boolean;
    keyboardType?: KeyboardTypeOptions;
    disabled?: boolean;
    style?: any;
    iconSize?: number;
    inputContainerStyle?: any;
    containerStyle?: any;
};

export type LocationType = {
    latitude: number;
    longitude: number;
    isMocked?: boolean;
};

export type TaskType = {
    total_claim_amount: number;
    visit_id: string;
    applicant_name?: string;
    applicant_index?: number;
    applicant_type?: string;
    address_index?: number;
    allocation_month?: string;
    created?: string;
    distance?: string;
    loan_id?: string;
    reminder_id?: string;
    visit_date?: string;
    visit_purpose?: VisitPurposeType;
    visit_status?: string;
    collection_receipt_url?: string;
    scheduled_by?: TaskScheduledByType;
    amount_recovered?: string;
    short_collection_receipt_url?: string;
};

export type ReminderType = {
    applicant_name?: string;
    applicant_index?: number;
    applicant_type?: string;
    address_index?: number;
    allocation_month?: string;
    created?: string;
    loan_id?: string;
    reminder_id: string;
    visit_id?: string;
    visit_date?: string;
    visit_purpose?: string;
    visit_status?: string;
};

export type CallingReminderType = {
    reminder_id: string;
    loan_id: string;
    reminder_date: string;
    reminder_status: string;
    reminder_from: string;
    next_step: string;
    comment: string | null;
    allocation_month: string;
    created: string;
    author: string;
    author_id: string;
    role: string;
};

export type LoanDetailsType = {
    loan_type: string;
    product_type: string;
    total_loan_amount: string;
    total_claim_amount: string;
    late_fee: string;
    status: string;
    date_of_default: string;
    location_coordinates?: LocationType;
    talking_point?: string;
};
export type customerDetailsType = {
    loan_type: string;
    product_type: string;
    total_loan_amount: string;
    total_claim_amount: string;
    late_fee: string;
    status: string;
    date_of_default: string;
    location_coordinates?: LocationType;
    cibil_score: string;
};

export type VisitHistoryType = {
    visit_id: string;
    visit_date: string;
    visit_status: string;
    is_customer_met: boolean;
    amount_recovered: string;
    comment: string;
    data: object;
    collection_receipt: string;
    id: string;
    marked_location: object;
    visit_purpose?: string;
};

export type PTPHistoryType = {
    ptp_date: string;
    created_by: string;
    ptp_from: string;
    status: string;
};

export type CallingHistoryType = {
    call_to: string;
    applicant_type: string;
    call_type: string;
    call_status: string;
    duration: number;
    call_start_time: string;
    call_end_time: string;
    recording: string;
    call_disposition: string;
    representative: string;
    role: string;
};

export type LoanInternalDetailsType = {
    address: AddressObjectType;
    applicant_photo_link: string;
    contact_number: string;
    loan_details: Array<LoanDetailsType>;
    field_visit_history?: Array<VisitHistoryType>;
    ptp_history?: Array<PTPHistoryType>;
    calling_history?: Array<CallingHistoryType>;
    email_address: string;
};
export type AddressObjectType = {
    primary: newAddress;
    other_addresses: Array<newAddress>;
    last_location: {
        marked_location: {
            latitude: string;
            longitude: string;
        };
        visit_date: string;
    };
};
export type newAddress = {
    address_id: string;
    applicant_address_type: string;
    applicant_address_text: string;
    applicant_city: string;
    applicant_state: string;
    applicant_pincode: string;
    applicant_landmark: string;
    applicant_address_longitude: string;
    applicant_address_latitude: string;
    co_applicant_address_type: string;
    co_applicant_address_text: string;
    co_applicant_city: string;
    co_applicant_state: string;
    co_applicant_pincode: string;
    co_applicant_landmark: string;
    co_applicant_address_longitude: string;
    co_applicant_address_latitude: string;
};

export type TableRowType = {
    data: Object;
};

export type ExpandableViewType = {
    name: string;
    dataList: any;
    extraData?: any;
    hasChevron: boolean;
    styles?: object;
    type?: string;
    expanded?: boolean;
    headerNotReq?: boolean;
    showCards?: boolean;
};

export type ExpandableCardType = {
    dataList: TransactionListType | object;
    type: ExpandableCardTypes;
    extraData?: any;
};
export type ExpandableHelpCardType = {
    dataList: object | any;
    type?: string;
    extraData?: any;
    isOpened?: boolean;
    setIsOpened?: any;
    depositBranch?: DepositBranchType;
};

export type LoanDetailsHeaderType = {
    tabDetails?: LoanInternalDetailsType;
    notShowUnplanned?: Boolean;
    visitHistory: any;
    callingHistory: any;
    digitalNoticeHistory: Array<digitalNoticeHistoryType>;
    speedPostHistory: Array<speedPostHistoryType>;
    transactionDetails?: Array<TransactionListType>;
    showLoanDetailsByDefault?: boolean;
    addressIndex?: string;
    allocation_month: string;
    addressData: AddressDataType;
};

export type AppBarType = {
    title: string;
    inverted?: boolean;
    subtitle?: string;
    search?: boolean;
    notifications?: boolean;
    backButton?: boolean;
    options?: boolean;
    calendar?: boolean;
    add?: boolean;
    filter?: boolean;
    sort?: boolean;
    clockInStatus?: boolean;
    headerImage?: string;
    talkingPoints?: string;
    onBackClicked?: Function;
    menuButton?: boolean;
    reminders?: boolean;
    rightActionComponent?: Element;
};

export type ActionButtonType = {
    loanData: Array<PortfolioLoan>;
    disabled?: boolean;
    address?: any;
    allocationMonth: string;
    type?: TaskTypes | undefined;
    screenName?: string;
};

export type VisitData = {
    loan_id: string;
    visit_date: string;
    address_index: number;
    applicant_index: number;
    applicant_type: string;
    applicant_name: string;
    comment: string;
};

export type ImageInputType = {
    title: string;
    imageTag: string;
    show: boolean;
};
export type ProofSelectorType = {
    proofs: Array<ImageInputType>;
};

export type TaskContextData = {
    imageProvider: Function;
    imageSetterProvider: Function;
    updateTaskDetails: TaskType | undefined;
    setUpdateTaskDetails: React.Dispatch<
        React.SetStateAction<TaskType | undefined>
    >;
    newVisitCreated: boolean;
    setNewVisitCreated: React.Dispatch<React.SetStateAction<boolean>>;
    updatedAddressIndex: string | null;
    setUpdatedAddressIndex: React.Dispatch<React.SetStateAction<any>>;
    updatedContactDetails: boolean;
    setUpdatedContactDetails: React.Dispatch<React.SetStateAction<boolean>>;
    visitSubmitted: boolean;
    setVisitSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    onlineTabChangeIdx: number | null;
    setOnlineTabChangeIdx: React.Dispatch<React.SetStateAction<any>>;
};

export type ActionContextData = {
    portfolioSortType: SortBy;
    setPortfolioSortType: React.Dispatch<React.SetStateAction<SortBy>>;
    portfolioFilterType: Object;
    setPortfolioFilterType: React.Dispatch<React.SetStateAction<Object>>;
    depositFilterType: FilterDepositTypes;
    setDepositFilterType: React.Dispatch<
        React.SetStateAction<FilterDepositTypes>
    >;
    portfolioSearchType: string;
    setPortfolioSearchType: React.Dispatch<React.SetStateAction<string>>;
    portfolioNBFCType: Object;
    setPortfolioNBFCType: React.Dispatch<React.SetStateAction<Object>>;
    portfolioTagsType: Object;
    setPortfolioTagsType: React.Dispatch<React.SetStateAction<Object>>;
    activeFilterType: PortfolioFilterType;
    setActiveFilterType: React.Dispatch<
        React.SetStateAction<PortfolioFilterType>
    >;
    contextLoanData: any;
    setContextLoanData: React.Dispatch<React.SetStateAction<any>>;
    newAddressAdded: boolean;
    setNewAddressAdded: React.Dispatch<React.SetStateAction<boolean>>;
};
export type TransactionFormType = {
    transaction_status: string;
    transaction_amount_recovered: any;
    transaction_id: string;
};

export type TaskFilterContextData = {
    taskSortType: SortBy;
    setTaskSortType: React.Dispatch<React.SetStateAction<SortBy>>;
    taskFilterType: FilterTaskTypesText;
    setTaskFilterType: React.Dispatch<
        React.SetStateAction<FilterTaskTypesText>
    >;
    activeType: TaskSortAndFilterActiveType | null;
    setActiveType: React.Dispatch<
        React.SetStateAction<TaskSortAndFilterActiveType | null>
    >;
    activeFilterTab: TaskFilterType;
    setActiveFilterTab: React.Dispatch<React.SetStateAction<TaskFilterType>>;
    selectedTaskFilterData: object;
    setSelectedTaskFilterData: React.Dispatch<React.SetStateAction<object>>;
    finalTaskFilterData: object;
    setFinalTaskFilterData: React.Dispatch<React.SetStateAction<object>>;
    checkBoxClicked: Function;
    visitSearchType: string;
    setVisitSearchType: React.Dispatch<React.SetStateAction<string>>;
    clearAllFilters: Function;
    setFilters: Function;
    filterActive: boolean;
    setFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
    radioButtonClicked: Function;
};

export type TaskHistoryFilterContextData = {
    taskSortType: SortBy;
    setTaskSortType: React.Dispatch<React.SetStateAction<SortBy>>;
    taskFilterType: FilterTaskTypesText;
    setTaskFilterType: React.Dispatch<
        React.SetStateAction<FilterTaskTypesText>
    >;
    activeType: TaskSortAndFilterActiveType | null;
    setActiveType: React.Dispatch<
        React.SetStateAction<TaskSortAndFilterActiveType | null>
    >;
    activeFilterTab: TaskHistoryFilterType;
    setActiveFilterTab: React.Dispatch<
        React.SetStateAction<TaskHistoryFilterType>
    >;
    selectedTaskFilterData: object;
    setSelectedTaskFilterData: React.Dispatch<React.SetStateAction<object>>;
    finalTaskHistoryFilterData: object;
    setFinalTaskHistoryFilterData: React.Dispatch<React.SetStateAction<object>>;
    checkBoxClicked: Function;
    visitHistorySearchType: string;
    setVisitHistorySearchType: React.Dispatch<React.SetStateAction<string>>;
    clearAllFilters: Function;
    setFilters: Function;
    filterActive: boolean;
    setFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
    radioButtonClicked: Function;
};

export type TaskSubmitType = {
    loan_id: string;
    visit_id: string;
    agent_id: string;
    is_visit_done: boolean;
    is_recovery_done: boolean;
    is_customer_met: boolean;
    pending_amount: string;
    amount_recovered: string;
    payment_method: string;
    payment_reference_number: string;
    reminder_id?: string;
    visit_proof_file: any;
    payment_proof_file: any;
    final_status: StatusObjectType;
    comment?: string;
    address_index: number;
    committed_amount: string;
    transanctions_data?: Array<TransactionFormType>;
};

export type StatusObjectType = {
    disposition: string;
    sub_disposition_1: string;
    sub_disposition_2: string;
};

export type PendingDepositType = {
    loan_id: string;
    amount_recovered: string;
    payment_method: string;
    payment_reference_number: string;
    agent_marked_status: string;
    created: string;
    checked?: boolean;
    applicant_name: string;
    visit_id: string;
    allocation_month: string;
};

export type DepositSubmitIdType = {
    visit_id: string;
    loan_id: string;
    allocation_month: string;
};

export type DepositDetailsLoanType = {
    allocation_month: string;
    loan_id: string;
    payment_method: string;
    payment_reference_number: string;
    recovery_date: string;
    recovery_status: string;
    amount_recovered: number;
};

export type DepositDetails = {
    agent_id: string;
    branch_details: BranchDetails;
    branch_id: string;
    branch_type: string;
    comment: string;
    company_id: string;
    created: string;
    deposit_id: string;
    deposit_method: string;
    deposit_proof_url: string;
    deposit_receipt_no: string;
    loan_details: Array<DepositDetailsLoanType>;
    total_amount: number;
    recovery_method: string;
    updated: string;
    verification_remark: string;
    verification_status: string;
    verified_by: string;
};

export type DepositFormRowDetailsType = {
    loan_id: string;
    deposit_amount: string;
    agent_marked_status: string;
    length: number;
};

export type PendingDepositRowType = {
    rowData: PendingDepositType;
    isOnline: boolean;
};
export type PendingDepositRowCreditType = {
    rowData: PendingDepositType;
    isOnline: boolean;
    onClickDetails: Function;
    transactionDataMap: any;
};

export type StatusType = {
    id: number;
    display_text: string;
    is_default: boolean;
    is_permanent: boolean;
    is_calling: boolean;
    is_fos: boolean;
    is_recovery: boolean;
    is_remark_required: boolean;
    is_reminder_required: boolean;
    max_reminder_interval?: number;
    text: string;
};

export type MakeDepositType = {
    total_amount: number;
    recovery_method: string;
    deposit_method: string;
    deposit_receipt_no: string;
    loan_data: Array<PendingDepositType>;
    branch_details?: DepositBranchType;
    comment: string;
    deposit_proof_link?: string;
    deposit_proof_file?: any;
    otp_data?: { destination: string; otp_type: String; otp: String };
    branch_manager_details: {
        branch_code?: string;
        client_employee_id?: string;
        name?: string;
        email?: string;
        mobile?: string;
        department?: string;
        manager_id?: string;
    };
};

export type LoanAccountType = {
    statusList: Array<string>;
    loanAccounts: Array<PendingDepositType>;
    setLoanAccounts: Function;
    wasStatusAvailable: any; // TODO: Fix { visit_id: null | "status" }
};

export type DepositType = {
    deposit_id: string;
    total_amount: number;
    deposit_method: string;
    deposit_receipt_no: string;
    branch_id: string;
    verification_status: string;
    verification_remark: string;
    comment: string;
    created: string;
    branch_details?: BranchDetails;
    linked_deposit_id?: string;
    loan_details?: HistoryLoanDetail[];
    branch_type?: BankBranchType;
};

export type HistoryLoanDetail = {
    amount_recovered: number;
    loan_id: string;
};

export type CallActionType = {
    visible: boolean;
    setVisible: Function;
    onCall: Function;
    contactNumberList?: Array<string>;
};

export type UserProfileDetails = {
    name: string;
    email: string;
    mobile: string;
    company_id: string;
    last_login: string;
    role: string;
    assigned_companies: string;
    team: string;
    profession: string;
    location: string;
};

export type CollectionLimitDetails = {
    max_limit: number;
    available_limit: number;
    collection_in_hand: number;
    total_collection: number;
};

export type SortByType = {
    visit_date: number;
    created: number;
    distance: number;
    date_of_default: number;
};

export type SortBy = {
    type: SortPortfolioTypes | SortTaskTypes;
    value: SortValue;
};

export type BranchDetails = {
    ifsc_code: string;
    account_name: string;
    account_number: string;
    account_type?: string;
    bank_name?: string;
    branch_name?: string;
    branch_address?: string;
    branch_contact_number?: string;
    branch_code?: string;
};

export type DepositBranchType = {
    branch_id?: string;
    branch_type?: string;
    branch_details?: BranchDetails;
};

export type MonthPickerType = {
    allocationMonth: number;
    allocationYear: number;
    visible: boolean;
    setVisible: Function;
    onSelected: Function;
};

export type OTPDataType = {
    destination: string;
    otp_type: string;
    otp?: string;
};

export type ResetUserData = {
    username: string;
    new_password: string;
    request_id: string;
};

export type ResultModalType = {
    visible: boolean;
    message: string;
    buttonText: string;
    positive: boolean;
    extra?: any;
    onDone?: Function;
    generateReceipt?: Function;
    showReceiptButton?: boolean;
};

export type BulkCreateModalType = {
    visible: boolean;
    hideModal: React.Dispatch<React.SetStateAction<boolean>>;
    items: Array<PortfolioLoan>;
    statuses: Array<BulkStatusType>;
};

export type BulkStatusType = {
    success: boolean;
    loan_id: string;
    applicant_name: string;
    message: string;
};

export type DepositSubmitType = {
    loan_ids: Array<PendingDepositType>;
    amount: number;
    recovery_method: string;
    redeposit?: boolean;
    data?: DepositDetails;
};

export type AppConfig = {
    app_version: string;
};

export type ClockStatusType = {
    clock_in_location: LocationType;
    clock_in_time: string;
    clock_out_location: string | null;
    clock_out_time: string | null;
    clock_time: string | null;
    id: number;
    status: ClockedInOutStatues;
};

export type TabType = {
    label: string;
    active: boolean;
};

export type FilterType = {
    id: string;
    text: string;
    checked: boolean;
};
export type NewMonthPickerType = {
    visible: Boolean;
    hideMonthPicker: Function;
    selectedDate: any;
    setSelectedDate: React.Dispatch<React.SetStateAction<any>>;
    maxDate?: Moment;
    minDate?: Moment;
    header?: String;
};

export type QuesAnsType = {
    [key: number]: string;
};

export type FeedbackQuestionType = {
    options: string[];
    question: string;
    question_id: string;
    required: boolean;
    type: QuestionTypes;
};

export type FeedbackResponseType = {
    options: string[];
    question: string;
    question_id: string;
    answer?: string[];
};

export type FeedbackSectionType = {
    section_id: string;
    title: string;
    description: string;
    questions: FeedbackQuestionType[];
};

export type FeedbackResponseSectionType = {
    questions: FeedbackResponseType[];
};
export type TaskBottomSheetData = {
    visit_id?: string;
    contact_number?: string;
    email_address?: string;
    unique_id?: string;
};

export type VisitOtpDataType = {
    destination: string;
    otp_type: string;
    other_fields: Object;
};

export type ModalButtonType = {
    buttonText: string;
    buttonTextStyle: any;
    buttonFunction: Function;
    buttonStyle: any;
};

export type Address = {
    applicantIndex: string;
    addressIndex: string;
    address: string;
    loanId: string;
    addressType?: string;
    addressCity?: string;
    addressState?: string;
    addressPincode?: string;
    addressLandmark?: string;
};

export type OrganisationDetails = {
    fos_collection_mode: string;
    fos_deposit_mode: string;
    fos_calling_mode: string;
    feedback_response_fos: boolean;
    country_currency_code: CurrencyTypes;
    company_name: string;
    fos_otp_verification_required: boolean;
    geofencing_required: boolean;
    country_isd_code: string;
    deposit_details: Array<DepositBranchType>;
    geofencing_distance: number;
    company_type: CompanyType;
    is_recovery_amount_bifurcation_enabled: boolean;
    show_balance_claim_amount: boolean;
    location_access: LocationAccessType;
    route_planning: boolean;
    deposit_branch_location: string;
    company_branch_representatives: boolean;
    online_collection_mode: string;
    deposit_otp_verification_method: string;
    cheque_details_input: boolean;
    address_city: string;
    address_pincode: string;
    address_state: string;
    address_text: string;
    company_logo: string;
    offline_mode: boolean;
};

export type DropDownType = {
    label: string;
    value: string;
    icon?: any;
};

export type DepositLocationType = {
    title: string;
    icon: any;
};

export type DispositionType = {
    calling_enabled: boolean;
    committed_amount_required: boolean;
    fos_enabled: true;
    id: string;
    max_reminder_interval: string;
    recovery_enabled: boolean;
    remark_required: boolean;
    reminder_required: boolean;
    sub_disposition_required: boolean;
    text: string;
    subdispositions: Array<DispositionType>;
};

export type DispositionFormErrorType = {
    remark_required: string;
    amount_required: string;
    reminder_date_required: string;
    reminder_time_required: string;
    disposition: string;
    sub_disposition1: string;
    sub_disposition2: string;
    checked_step?: string;
};

export type ChequeDetailsErrorType = {
    cheque_number: string;
    cheque_date: string;
    account_number: string;
    ifsc_code: string;
    bank_name: string;
    branch_name: string;
};

export type BankTransferType = {
    payment_date: string;
    utr_number: string;
    branch_id: string;
    mode: string;
};

export type OnlineTabsType = {
    active: boolean;
    label: string;
    screen: string;
};

export type TransactionListType = {
    client_loan_sanction_date: string;
    defaults: {
        actual_date_of_default: string;
        additional_variables: null;
        allocation_dpd_bracket: string;
        allocation_dpd_value: number;
        allocation_month: string;
        amount_recovered: string;
        amount_recovered_breakdown: any;
        balance_claim_amount: number;
        client_amount_recovered: number;
        closure_with: string;
        created: string;
        date_of_default: string;
        default_emi_number: number;
        dpd: number;
        dpd_bracket: string;
        expected_emi: number;
        expected_emi_interest_amount: number;
        expected_emi_principal_amount: number;
        final_status: string;
        late_fee: number;
        other_penalty: number;
        payment_method: string;
        payment_mode: string;
        principal_outstanding_amount: number;
        recovery_date: string;
        recovery_method: string;
        reference_number: string;
        total_claim_amount: string;
        uploaded_by: string;
        uploaded_by_role: string;
    };
    total_loan_amount: string;
    transaction_id: string;
    updated: string;
};

export type RecoveryVariableType = {
    active: boolean;
    variable_id: string;
    variable_name: string;
};

export type digitalNoticeHistoryType = {
    notice_type: string;
    notice_link: string;
    allocation_month: string;
    type_of_comm: string;
    applicant_type: string;
    delivered_time: string;
    clicked_time: string;
    opened_time: string | null;
    bounced_time: string | null;
    notice_click_count: number;
    triggered_time: string;
};

export type speedPostHistoryType = {
    allocation_month: string;
    author: string;
    company_id: string;
    created: string;
    data: Object;
    document_type: string;
    id: string;
    is_linked_loan: boolean;
    linked_loan_id: string | null;
    loan_id: string;
    notice_type: string;
    role: string | null;
    s3_link: string;
    s3_link_uuid: string;
    status: string | null;
    tracking_id: string | null;
    updated: string;
};
export type ApiResponseType = {
    data: any;
    success: boolean;
    message: string;
    error_code: any;
};
export type DepositRowType = {
    data: DepositType;
    onPress: Function;
};

export type DepositHistoryItemType = {
    deposit_id: string;
    verification_status: string;
    created: string;
    verified_by: string;
    verification_remark: string | null;
};

export type TransactionDetailsType = {
    amount_recovered: number;
    transaction_id: string;
    transaction_status: string;
};

export type BulkVisitDataType = {
    id: string;
    applicant_name: string;
    status: string;
};
export type BranchRepresentativeType = {
    branch_code: string;
    company_id: string;
    client_employee_id: string;
    name: string;
    email: string;
    mobile: string;
    department: string;
    author_id: string | null;
    manager_id: string;
};
export type TimerRefType = {
    resetTimer: Function;
    getTimePassed: Function;
    setUpdateTimer: Function;
    stopTimer: Function;
};

export type AddressData = {
    address_index: number;
    address_type: string;
    applicant_index: number;
    applicant_type: string;
    loan_id?: string;
};

export type LoansArrayType = {
    allocation_month: string;
    loan_id: string;
};

type AddressDataType = {
    address_index: number;
    address_type: string;
    applicant_type: string;
    applicant_index?: number;
};

export type LastLocationType = {
    loan_id: string;
    marked_location: LocationType;
    visit_date: string;
};

type NewLoanDetailsType = {
    [key: string]: any;
    last_location: LastLocationType;
    loan_data: LoanInternalDetailsType;
};

export type LoanDataWithDetailsType = {
    [loan_id: string]: NewLoanDetailsType;
};

export type SelectedLoanDataType = {
    loan_id: string;
    applicant_name: string;
    applicant_type: string;
    date_of_default: string;
    total_claim_amount: number;
    distance_in_km: string;
    address_index: number;
    applicant_index?: number;
    final_status: string;
    applicant_photo_link?: string;
    number_of_transactions?: string;
    dpd?: string;
    visit_id: string;
    allocation_month: string;
    created?: string;
    distance?: string;
    reminder_id?: string;
    visit_date?: string;
    visit_purpose?: VisitPurposeType;
    visit_status?: string;
    collection_receipt_url?: string;
    scheduled_by?: TaskScheduledByType;
    amount_recovered?: string;
    short_collection_receipt_url?: string;
};

export type closeVisitType = {
    taskType: TaskTypes;
    taskData: TaskSubmitType;
    visit_id: string;
    recVarsFormData: any;
    isRecoveryAmountBifurcationEnabled: boolean;
    applicant_index: string;
    applicant_type: string;
    location: LocationType | any;
    address_location?: LocationType | any;
    allocationMonth?: string;
    applicant_name?: string;
    address?: any;
    isTransactionData?: boolean;
    authData?: AuthData;
    payment_details?: any;
    payment_collection_mode?: string;
};

export type OfflineVisitDataMap = {
    [visit_id: string]: any;
};

export type UpdationAddressType = {
    address_index: number;
    address_type: string;
    applicant_index: number;
    applicant_type: string;
    loan_id?: string;
    address?: string;
    address_id?: number;
    address_text?: string;
    city?: string;
    landmark?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    applicantType?: string;
    applicantIndex?: string;
};

export type ReceiptGenerationDataType = {
    applicant_name: string;
    address: string;
    company_name: string;
    company_address: string;
    company_state: string;
    company_pincode: string;
    company_city: string;
    visit_date: string;
    company_type: string;
    loan_id: string;
    payment_method: string;
    agent_name: string;
    amount_bifurcation: string;
    companyLogo: string;
    currency_code: string;
    amount_recovered: string;
    amount_recovered_in_words: string;
};
