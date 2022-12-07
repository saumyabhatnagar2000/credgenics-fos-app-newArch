import config from '../config';

export const AUTH_STORAGE_KEY = `@AuthData-${config.ENV}`;
export const USERNAME_STORAGE_KEY = `@Username-${config.ENV}`;
export const LOGIN_TYPE_STORAGE_KEY = `@LoginType-${config.ENV}`;
export const COMPANY_STORAGE_KEY = `@CompanyName-${config.ENV}`;
export const NUDGE_STORAGE_KEY = `@Nudge-${config.ENV}`;
export const LOCATION_STORAGE_KEY = `@Location-${config.ENV}`;
export const LOCATION_REJECTED_STORAGE_KEY = `@Location-Rejected-${config.ENV}`;
export const COUNTRY_STORAGE_KEY = `@Country-${config.ENV}`;
export const VISIT_COMPLETE_STORAGE_KEY = `@CompletedVisits-${config.ENV}`;
export const ROUTE_PLANNING_RESUME_KEY = `@RoutePlanningReset-${config.ENV}`;
export const TIMESTAMP_DEPOSIT_TIMER = `@TimestampDepositTimer-${config.ENV}`;
