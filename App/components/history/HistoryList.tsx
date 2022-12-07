import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { TaskType } from '../../../types';
import { loadTaskList } from '../../services/taskService';
import TaskHistoryRow from './TaskHistoryRow';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import ListFooterLoader from '../common/ListFooterLoader';
import { useTaskAction } from '../../hooks/useTaskAction';
import { CompanyType, SearchUsedOn, TaskStatusTypes } from '../../../enums';
import { BLUE_DARK } from '../../constants/Colors';
import { useLocation } from '../../hooks/useLocation';
import { useTaskHistoryFilter } from '../../hooks/useTaskHistoryFilter';
import TaskHistoryFilters from '../tasks/TaskHistoryFilters';
import CustomSearchBar from '../common/CustomSearchBar';
import { debounce } from 'lodash';
import {
    VisitSearchCreditLineTypes,
    VisitSearchTypes
} from '../../constants/constants';
import { useIsFocused } from '@react-navigation/native';

const keyExtractor = (item: any, index: number) => index.toString();

export default function HistoryList() {
    const [visits, setVisits] = useState<Array<TaskType>>([]);
    const { authData, companyType } = useAuth();
    const { updateTaskDetails } = useTaskAction();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [visitTotalCount, setVisitTotalCount] = useState(0);
    const { checkLocation, allowLocationAccess } = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const reloadData = () => {
        resetData();
        callHistoryListAPI(1, '');
    };

    const resetData = () => {
        setSearchQuery('');
        setPageNumber(1);
        setVisitTotalCount(0);
        setVisits([]);
    };

    const debouncedSearch = debounce((newQuery: string) => {
        callHistoryListAPI(1, newQuery);
    }, 800);

    const updateValue = (newQuery: string) => {
        setSearchQuery(newQuery);
        setPageNumber(1);
        debouncedSearch(newQuery);
    };

    const {
        filterActive,
        taskSortType,
        taskFilterType,
        finalTaskHistoryFilterData,
        setSelectedTaskFilterData,
        visitHistorySearchType
    } = useTaskHistoryFilter();

    const callHistoryListAPI = async (
        newPageNumber: number = 1,
        newQuery: string = ''
    ) => {
        const apiPageNumber = newPageNumber;
        setLoading(true);
        try {
            const locationObject = await allowLocationAccess();
            if (!locationObject.access) {
                if (loading) setLoading(false);
                return;
            }
            const { isMocked, ...loc } = locationObject.location;
            const apiResponse = await loadTaskList(
                taskSortType,
                apiPageNumber,
                10,
                authData,
                loc,
                `${TaskStatusTypes.closed},${TaskStatusTypes.cancelled},${TaskStatusTypes.pending}`,
                taskFilterType,
                newQuery,
                visitHistorySearchType,
                finalTaskHistoryFilterData
            );
            if (apiResponse) {
                const data = apiResponse.data;
                let tasks = [];
                let totalCount = 0;
                try {
                    tasks = data.visits;
                    totalCount = data.total_records;
                } catch (e) {}
                setVisitTotalCount(totalCount);

                if (apiPageNumber == 1) setVisits(tasks);
                else setVisits(visits.concat(tasks));
            }
        } catch (e) {
            resetData();
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isFocused) {
            reloadData();
            if (finalTaskHistoryFilterData) {
                setSelectedTaskFilterData({ ...finalTaskHistoryFilterData });
            }
        }
    }, [
        updateTaskDetails,
        taskSortType,
        finalTaskHistoryFilterData,
        visitHistorySearchType,
        isFocused
    ]);

    const ListFooterComponenet = () => {
        if (visits?.length < visitTotalCount - 1) return <ListFooterLoader />;
        return null;
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F6F8FB' }}>
            {filterActive ? (
                <TaskHistoryFilters />
            ) : (
                <>
                    <CustomSearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={updateValue}
                        searchType={
                            companyType == CompanyType.loan
                                ? VisitSearchTypes
                                : VisitSearchCreditLineTypes
                        }
                        usedOn={SearchUsedOn.history}
                    />
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={visits}
                        extraData={visits}
                        onEndReached={() => {
                            if (!loading) {
                                if (
                                    pageNumber <
                                    Math.floor(visitTotalCount / 10) + 1
                                ) {
                                    callHistoryListAPI(
                                        pageNumber + 1,
                                        searchQuery
                                    );
                                    setPageNumber((a) => a + 1);
                                }
                            }
                        }}
                        ListEmptyComponent={
                            !loading ? (
                                <ErrorPlaceholder
                                    type="empty"
                                    message="No History!"
                                />
                            ) : null
                        }
                        ListFooterComponent={ListFooterComponenet}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={{ flexGrow: 1 }}
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
                        renderItem={({ item }) => (
                            <TaskHistoryRow rowData={item as TaskType} />
                        )}
                    />
                </>
            )}
        </View>
    );
}
