export const Events = {
    sort_by: 'sort_by',
    filter: 'filter',
    login: 'login',
    clock_in: 'clock_in',
    allocation_month: 'allocation_month',
    app_state: 'app_state',
    proof_selection: 'proof_selection',
    mocking_location: 'mocking_location'
};

export const EventScreens = {
    portfolio_list: 'portfolio_list',
    task_list: 'task_list',
    task_history_list: 'task_history_list',
    collection_list: 'collection_list',
    login_page: 'login_page',
    app_bar: 'app_bar',
    clock_in_sheet: 'clock_in_sheet',
    app: 'app',
    visit_submission_screen: 'visit_submission_screen'
};

export enum TaskDetailsEventTypes {
    screen_mounted = 'screen_mounted',
    visit_submission = 'visit_submission',
    visit_submission_api = 'visit_submission_api',
    receipt_send = 'receipt_send',
    mark_location_api = 'mark_location_api',
    mark_location = 'mark_location',
    address_change = 'address_change'
}

export const EventAction = {
    click: 'click'
};
