import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, ToastAndroid } from 'react-native';
import PortfolioRow from './PortfolioRow';
import {
    useFocusEffect,
    useIsFocused,
    useNavigation
} from '@react-navigation/native';
import {
    getCustomerProfile,
    getLoanProfile,
    loadCustomerList,
    loadPortfolioList
} from '../../services/portfolioService';
import { useAuth } from '../../hooks/useAuth';
import {
    LoanInternalDetailsType,
    LoansArrayType,
    PortfolioLoan
} from '../../../types';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import { useAction } from '../../hooks/useAction';
import ListFooterLoader from '../common/ListFooterLoader';
import ActionButton from './ActionButton';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
    CompanyType,
    LocationAccessType,
    ScreenName,
    SearchUsedOn,
    SortPortfolioTypes
} from '../../../enums';
import { FiltersScreen } from './FiltersScreen';
import CustomSearchBar from '../common/CustomSearchBar';
import debounce from 'lodash.debounce';
import {
    Overall,
    PortfolioSearchCreditLineTypes,
    PortfolioSearchTypes,
    SOMETHING_WENT_WRONG
} from '../../constants/constants';
import { BLUE_DARK } from '../../constants/Colors';
import { useTaskAction } from '../../hooks/useTaskAction';
import {
    modifyCustomerDetails,
    modifyLoanDetails
} from '../../constants/ModifyData';
import { useLocation } from '../../hooks/useLocation';
import usePortfolio from '../../hooks/usePortfolio';
import { useAppDispatch } from '../../redux/hooks';
import { updatePortfolioList } from '../../redux/portfolioSlice';
import useLoanDetails from '../../hooks/useLoanData';

const keyExtractor = (item: PortfolioLoan, index: number) =>
    `${item.loan_id}-${index}`;

const LIGHT_BLUE = '#F6F8FB';

export default function PortfolioList({
    filtersVisible,
    setFiltersVisible,
    setFilters,
    resetFilters,
    filtersSelected,
    setFiltersSelected,
    nbfcFiltersSelected,
    setNBFCFiltersSelected,
    tagsFilterSelected,
    setTagsfilterSelected
}: {
    filtersVisible: boolean;
    setFiltersVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setFilters: Function;
    resetFilters: Function;
    filtersSelected: any;
    setFiltersSelected: any;
    nbfcFiltersSelected: any;
    setNBFCFiltersSelected: any;
    tagsFilterSelected: any;
    setTagsfilterSelected: any;
}) {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { authData, allocationMonth, companyType, locationAccess } =
        useAuth();
    const {
        portfolioSortType,
        portfolioFilterType,
        portfolioSearchType,
        portfolioNBFCType
    } = useAction();
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [detailsMap, setDetailsMap] = useState<
        Map<string, LoanInternalDetailsType>
    >(new Map([]));
    const { checkLocation, allowLocationAccess } = useLocation();

    const { portfolioList } = usePortfolio();
    const { setSelectedLoanData } = useLoanDetails();

    const dispatch = useAppDispatch();
    const setPortfolioList = (items: Array<PortfolioLoan>) => {
        dispatch(updatePortfolioList(items));
    };

    const [selected, setSelected] = useState<any>({});
    useFocusEffect(
        useCallback(() => {
            (async () => {
                if (locationAccess != LocationAccessType.disable_all)
                    await checkLocation();
            })();
        }, [])
    );
    const reloadData = () => {
        resetData();
        callPortfolioApi(allocationMonth, '', 1);
    };
    const { updatedAddressIndex } = useTaskAction();
    const resetData = () => {
        setTotalCount(0);
        setPortfolioList([]);
        setSelected({});
        setDetailsMap(new Map([]));
        setPageNumber(1);
        setSearchQuery('');
    };

    const debouncedSearch = useCallback(
        debounce((allocationMonth: string, query: string) => {
            callPortfolioApi(allocationMonth, query, 1);
        }, 500),
        [portfolioSearchType]
    );

    const updateValue = (newValue: string) => {
        setPageNumber(1);
        setSearchQuery(newValue);
        debouncedSearch(allocationMonth, newValue);
    };

    useEffect(() => {
        if (isFocused) {
            if (companyType) reloadData();
        }
    }, [
        allocationMonth,
        portfolioSortType,
        portfolioFilterType,
        portfolioSearchType,
        updatedAddressIndex,
        portfolioNBFCType,
        companyType,
        isFocused
    ]);

    const { getLoanDetails, loanDetailMap } = useLoanDetails();
    const callPortfolioApi = async (
        allocationMonth: string,
        newValue: string = searchQuery,
        newPageNumber: number = 1
    ) => {
        setLoading(true);
        const locationObject = await allowLocationAccess();
        if (!locationObject.access) {
            if (loading) setLoading(false);
            return;
        }
        if (portfolioSortType.type == SortPortfolioTypes.distance) {
            if (locationAccess == LocationAccessType.disable_all) {
                ToastAndroid.show(
                    'This functionality is supported only with location access',
                    ToastAndroid.SHORT
                );
            }
            await checkLocation();
            const locationObject = await allowLocationAccess();
            if (!locationObject.access) return;
        }
        const apiPageNumber = newPageNumber;
        const { isMocked, ...loc } = locationObject.location;
        if (companyType == CompanyType.loan) {
            try {
                const apiResponse = await loadPortfolioList(
                    allocationMonth,
                    apiPageNumber,
                    10,
                    portfolioSortType,
                    portfolioFilterType,
                    authData,
                    loc,
                    newValue,
                    portfolioSearchType,
                    portfolioNBFCType,
                    ''
                );
                if (apiResponse) {
                    const data = apiResponse.data;
                    let loans = [];
                    let total = 0;
                    try {
                        loans = data?.output?.customer_details ?? [];
                        total = parseInt(
                            data?.output?.total_count_of_loans ?? 0
                        );
                    } catch (e) {}
                    setTotalCount(total);
                    if (apiPageNumber == 1) {
                        setPortfolioList(loans);
                        setSelected({});
                    } else {
                        setPortfolioList(portfolioList.concat(loans));
                    }
                }
            } catch (e) {
                resetData();
            }
        } else if (companyType == CompanyType.credit_line) {
            try {
                const apiResponse = await loadCustomerList(
                    allocationMonth,
                    apiPageNumber,
                    10,
                    portfolioSortType,
                    portfolioFilterType,
                    authData,
                    locationObject.location,
                    newValue,
                    portfolioSearchType,
                    portfolioNBFCType
                );
                if (apiResponse) {
                    const data = apiResponse.data;
                    let customers = [];
                    let total = 0;
                    let allocation_month = '';
                    try {
                        customers = data?.output?.customer_details ?? [];
                        total = parseInt(
                            data?.output?.total_count_of_loans ?? 0
                        );
                        allocation_month = data?.output?.allocation_month;
                        if (customers.length) {
                            customers = customers.map((_customer: any) => {
                                return {
                                    ..._customer,
                                    allocation_month: allocation_month
                                };
                            });
                        }
                    } catch (e) {}
                    setTotalCount(total);
                    if (apiPageNumber == 1) {
                        setPortfolioList(customers);
                        setSelected({});
                    } else {
                        setPortfolioList(portfolioList.concat(customers));
                    }
                }
            } catch (e) {
                resetData();
            }
        }
        setLoading(false);
    };

    const ListFooterComponenet = () => {
        if (portfolioList.length == 0) return null;
        if (portfolioList.length < totalCount - 1) return <ListFooterLoader />;
        return null;
    };

    const actionButton = React.useMemo(() => {
        let data: Array<PortfolioLoan> = portfolioList.filter(
            (item) => selected[item.loan_id] === true
        );
        if (!data.length) return null;

        return (
            <ActionButton
                disabled={!data.length}
                loanData={data}
                screenName={ScreenName.portfolio_list}
                allocationMonth={allocationMonth}
            />
        );
    }, [selected, portfolioList]);

    const getLoanAndSaveInState = async (loan: PortfolioLoan) => {
        if (detailsMap?.has(loan.loan_id)) {
            const loanDetails = detailsMap.get(loan.loan_id);
            // implement call logic
        }

        ToastAndroid.show('Fetching Details', ToastAndroid.LONG);
        // this call can be optimized by not bringing field visit history with details

        try {
            if (companyType == CompanyType.loan) {
                const apiResponse = await getLoanProfile(
                    loan.loan_id,
                    allocationMonth,
                    authData
                );
                if (apiResponse?.data) {
                    const data = await modifyLoanDetails(
                        loan,
                        apiResponse?.data?.output?.question_dict,
                        allocationMonth,
                        undefined,
                        false,
                        authData
                    );
                    setDetailsMap(
                        (prev) => new Map([...prev, [loan.loan_id, data]])
                    );
                }
            } else {
                const apiResponse = await getCustomerProfile(
                    loan.loan_id,
                    allocationMonth,
                    authData
                );
                if (apiResponse?.data) {
                    const data = await modifyCustomerDetails(
                        loan,
                        apiResponse?.data?.output,
                        allocationMonth,
                        undefined,
                        undefined,
                        undefined,
                        authData
                    );
                    setDetailsMap(
                        (prev) => new Map([...prev, [loan.loan_id, data]])
                    );
                }
            }
        } catch (error: any) {
            let message = SOMETHING_WENT_WRONG;
            if (error.response) {
                message =
                    error?.response?.data.output ??
                    error?.response?.data.message;
            }
            ToastAndroid.show(message, ToastAndroid.LONG);
        }
    };
    return (
        <>
            {filtersVisible ? (
                <FiltersScreen
                    visible={filtersVisible}
                    setVisible={setFiltersVisible}
                    setFilters={setFilters}
                    resetFilters={resetFilters}
                    selected={filtersSelected}
                    setSelected={setFiltersSelected}
                    nbfcFiltersSelected={nbfcFiltersSelected}
                    setNBFCFiltersSelected={setNBFCFiltersSelected}
                    tagsFilterSelected={tagsFilterSelected}
                    setTagsfilterSelected={setTagsfilterSelected}
                />
            ) : (
                <>
                    <CustomSearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={updateValue}
                        searchType={
                            companyType == CompanyType.loan
                                ? PortfolioSearchTypes
                                : PortfolioSearchCreditLineTypes
                        }
                        usedOn={SearchUsedOn.portfolio}
                    />
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={portfolioList}
                        extraData={portfolioList}
                        onEndReached={() => {
                            if (!loading) {
                                if (
                                    pageNumber <
                                    Math.floor(totalCount / 10) + 1
                                ) {
                                    callPortfolioApi(
                                        allocationMonth,
                                        searchQuery,
                                        pageNumber + 1
                                    );
                                    setPageNumber((a) => a + 1);
                                }
                            }
                        }}
                        ListEmptyComponent={
                            !loading ? (
                                <ErrorPlaceholder
                                    type="empty"
                                    message={
                                        companyType === CompanyType.credit_line
                                            ? 'No Customers found!'
                                            : 'No Loans found!'
                                    }
                                />
                            ) : null
                        }
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={ListFooterComponenet}
                        contentContainerStyle={{
                            flexGrow: 1,
                            backgroundColor: LIGHT_BLUE,
                            padding: RFPercentage(0.5)
                        }}
                        refreshControl={
                            <RefreshControl
                                enabled
                                progressViewOffset={10}
                                refreshing={loading}
                                onRefresh={() => {
                                    reloadData();
                                }}
                                colors={[BLUE_DARK]}
                            />
                        }
                        refreshing={loading}
                        renderItem={({ item, index }) => {
                            const present = selected[item.loan_id];

                            const onCheckboxClicked = () => {
                                if (!present) {
                                    setSelected({
                                        ...selected,
                                        [item.loan_id]: !present
                                    });
                                } else {
                                    delete selected[item.loan_id];
                                    setSelected({ ...selected });
                                }
                            };

                            const onItemClicked = () => {
                                setSelectedLoanData({
                                    ...item,
                                    ['allocation_month']: allocationMonth
                                });
                                navigation.navigate('PortfolioDetailScreen');
                            };

                            const onCallClicked = () => {
                                setSelectedLoanData({
                                    ...item,
                                    ['allocation_month']: allocationMonth
                                });
                                getLoanAndSaveInState(item);
                            };

                            return (
                                <PortfolioRow
                                    key={item.loan_id}
                                    onCallClicked={onCallClicked}
                                    onItemClicked={onItemClicked}
                                    onCheckboxClicked={onCheckboxClicked}
                                    checked={!!present}
                                    rowData={item}
                                    details={detailsMap.get(item.loan_id)}
                                />
                            );
                        }}
                    />
                    {allocationMonth != Overall && actionButton}
                </>
            )}
        </>
    );
}
