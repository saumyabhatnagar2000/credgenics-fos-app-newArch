export enum TaskStatusTypes {
    open = 'open',
    closed = 'closed',
    missed = 'missed',
    pending = 'pending',
    cancelled = 'cancelled'
}

export enum TaskTypes {
    visit = 'visit',
    ptp = 'ptp',
    promise_to_pay = 'promise to pay'
}

export enum DepositTypes {
    cheque = 'Cheque',
    online = 'Online',
    cash = 'Cash'
}

export enum AgentMarkedStatusTypes {
    'partially recovered' = 'partially recovered',
    closed = 'closed'
}

export enum CallingModeTypes {
    manual = 'manual',
    click_to_call = 'click_to_call'
}

export enum DepositStatuses {
    rejected = 'rejected',
    approved = 'approved',
    'not required' = 'not required',
    pending = 'pending'
}

export enum ClockedInOutStatues {
    clocked_out = 'clocked_out',
    clocked_in = 'clocked_in'
}

export enum ClockedInOutMessages {
    clocked_out = 'Clock-out Successful',
    clocked_in = 'Clock-in Successful'
}

export enum SortPortfolioTypes {
    created = 'created',
    distance = 'distance',
    date_of_default = 'date_of_default',
    total_claim_amount = 'total_claim_amount',
    remark = 'remark',
    number_of_transactions = 'number_of_transactions'
}

export enum SortTaskTypes {
    created = 'created',
    distance = 'distance',
    visit_date = 'visit_date',
    date_of_default = 'date_of_default',
    total_claim_amount = 'total_claim_amount',
    amount_recovered = 'amount_recovered'
}

export enum FilterDepositTypes {
    today = 'Today',
    this_week = 'This Week',
    this_month = 'This Month',
    overall = 'Overall'
}

export enum FilterTaskTypesText {
    today = 'Today',
    tomorrow = 'Tomorrow',
    this_week = 'This Week',
    this_month = 'This Month',
    overall = 'Overall',
    yesterday = 'Yesterday'
}

export enum SortValue {
    ascending = 'ascending',
    descending = 'descending'
}

export enum NewTaskType {
    field_visit = 'visit',
    reminder = 'reminder'
}

export enum ReminderType {
    call_back = 'call_back',
    ptp = 'ptp'
}

export enum CallSourceTypes {
    call = 'Call',
    visit = 'Visit',
    none = 'None'
}

export enum LoanDetailsTabs {
    loan = 'loan',
    recovery = 'recovery',
    additional_details = 'additional_details'
}
export enum CurrencyTypes {
    rs = '₹',
    rp = 'Rp'
}
export enum ReminderListType {
    to_do = 'to_do',
    pending = 'pending'
}

export enum Reminder {
    call = 'call',
    ptp = 'visits'
}

export enum QuestionTypes {
    single = 'single',
    multiple = 'multiple'
}

export enum SearchUsedOn {
    portfolio = 'portfolio',
    visit = 'visit',
    history = 'history'
}
export enum SearchTypes {
    applicant_name = 'applicant_name',
    loan_id = 'loan_id',
    bank_name = 'bank_name',
    branch_name = 'branch_name',
    branch_code = 'branch_code'
}

export enum ApplicantTypes {
    applicant = 'applicant',
    co_applicant = 'co_applicant'
}

export enum PortfolioFilterType {
    status = 'Loan Status',
    nbfc = 'NBFC',
    tags = 'Tags'
}

export enum TaskFilterType {
    scheduled_date = 'Scheduled Date',
    visit_purpose = 'Visit Purpose',
    visit_creator = 'Visit Creator'
}

export enum TaskHistoryFilterType {
    submitted = 'Submitted',
    visit_purpose = 'Visit Purpose',
    visit_creator = 'Visit Creator',
    recovery_done = 'Recovery Done',
    recovery_mode = 'Recovery Mode'
}

export enum TaskCreatorType {
    agent = 'Agent',
    manager = 'Manager'
}

export enum TaskRecoveryType {
    yes = 'Yes',
    no = 'No'
}

export enum CountryTypes {
    india = 'India',
    indonesia = 'Indonesia'
}

export enum CountryCodes {
    india = 'IN',
    indonesia = 'ID'
}

export enum RequestMethods {
    get = 'get',
    post = 'post',
    patch = 'patch'
}

export enum BankBranchType {
    company = 'company',
    bank = 'bank',
    airtel = 'airtel'
}

export enum ReminderFromType {
    field_visit = 'field_visit',
    call = 'call'
}
export enum VisitPurposeType {
    surprise_visit = 'Surprise Visit',
    promise_to_pay = 'Promise To Pay'
}

export enum TaskOptions {
    surprise_visit = 'Surprise Visit',
    ptp = 'PTP'
}

export enum DispositionServiceType {
    calling = 'calling',
    fos = 'fos'
}
export enum CompanyType {
    credit_line = 'credit line',
    loan = 'loan'
}
export enum LoginTypes {
    emp = 'Emp. Id',
    phone = 'Phone No.',
    email = 'Email Id'
}

export enum LoginCodes {
    emp = 'employee_code',
    phone = 'phone',
    email = 'email'
}

export enum TaskScheduledByType {
    agent = 'Agent',
    manager = 'Manager'
}

export enum TaskSortAndFilterActiveType {
    sort_by = 'sort_by',
    filter = 'filter'
}
export enum LocationAccessType {
    enable_all = 'enable_all',
    disable_all = 'disable_all',
    enable_soft_prompt = 'enable_soft_prompt',
    enable_hard_prompt = 'enable_hard_prompt'
}

export enum PermissionType {
    UNAVAILABLE = 'unavailable',
    BLOCKED = 'blocked',
    DENIED = 'denied',
    GRANTED = 'granted',
    LIMITED = 'limited'
}

export enum ExpandableCardTypes {
    visit = 'visit',
    call = 'call',
    digitalNotice = 'digitalNotice',
    transaction = 'transaction',
    speedPost = 'speedPost',
    depositLocation = 'depositLocation',
    bankTransfer = 'bankTransfer'
}

export enum CollectionModeTypes {
    payment_link_qr = 'payment_link_qr',
    bank_transfer = 'bank_transfer'
}

export enum PAYMENT_TYPES {
    qrLink = 'QR',
    paymentLink = 'Payment Link',
    bankTransfer = 'Bank Transfer'
}

export enum ToastTypes {
    long = 'long',
    short = 'short'
}

export enum HistoryScreenTabType {
    deposits = 'deposits',
    visits = 'visits'
}

export enum AppStateTypes {
    out_of_focus = 'out_of_focus',
    back_to_focus = 'back_to_focus'
}

export enum OtpVerifyTypes {
    deposit = 'deposit',
    visit = 'visit'
}

export enum ClockInOutStatus {
    clocked_in = 'clocked_in',
    clocked_out = 'clocked_out'
}

export enum LoanStatusType {
    closed = 'Closed'
}

export enum ScreenName {
    portfolio_list = 'Portfolio List',
    portfolio_details = 'Portfolio Details'
}
