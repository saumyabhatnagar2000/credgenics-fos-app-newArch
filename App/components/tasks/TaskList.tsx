import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import {
    useFocusEffect,
    useIsFocused,
    useNavigation
} from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { LoansArrayType, TaskType } from '../../../types';
import { loadTaskList } from '../../services/taskService';
import { ErrorPlaceholder } from '../common/ErrorPlaceholder';
import ListFooterLoader from '../common/ListFooterLoader';
import { useTaskAction } from '../../hooks/useTaskAction';
import TaskRow from './TaskRow';
import {
    CompanyType,
    FilterTaskTypesText,
    LocationAccessType,
    PermissionType,
    SearchUsedOn,
    SortTaskTypes,
    TaskSortAndFilterActiveType,
    TaskStatusTypes,
    TaskTypes
} from '../../../enums';
import CustomSearchBar from '../common/CustomSearchBar';
import debounce from 'lodash.debounce';
import Colors, { BLUE_DARK } from '../../constants/Colors';
import {
    CLOCK_IN_BEFORE_VISIT,
    ROUTE_PLANNING_NOT_ALLOWED,
    VisitSearchCreditLineTypes,
    VisitSearchTypes
} from '../../constants/constants';
import { useTaskFilter } from '../../hooks/useTaskFilter';
import { useLocation } from '../../hooks/useLocation';
import TaskSortAndFilter from './TaskSortAndFilter';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { useClockIn } from '../../hooks/useClockIn';
import TaskFilters from './TaskFilters';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { getStorageData, setStorageData } from '../../utils/Storage';
import {
    ROUTE_PLANNING_RESUME_KEY,
    VISIT_COMPLETE_STORAGE_KEY
} from '../../constants/Storage';
import { resetRoute } from '../../services/routeService';
import useTask from '../../hooks/useTask';
import useLoanDetails from '../../hooks/useLoanData';
import OnlineOnly from '../OnlineOnly';
import useCommon from '../../hooks/useCommon';

const keyExtractor = (item: TaskType, index: number) => {
    return item?.visit_id;
};

export default function TaskList({ taskType }: { taskType: TaskTypes }) {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { authData, companyType, locationAccess, isRoutePlanningEnabled } =
        useAuth();
    const {
        taskSortType,
        taskFilterType,
        visitSearchType,
        finalTaskFilterData,
        activeType,
        filterActive,
        setSelectedTaskFilterData
    } = useTaskFilter();
    const { isInternetAvailable } = useCommon();
    const [searchQuery, setSearchQuery] = useState('');

    const [isStartRouteClickedAlready, setStartRouteClickedAlready] =
        useState(false);

    const {
        updateTaskDetails,
        newVisitCreated,
        setNewVisitCreated,
        setUpdateTaskDetails,
        updatedAddressIndex
    } = useTaskAction();
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [visitTotalCount, setVisitTotalCount] = useState(0);
    const [selected, setSelected] = useState<any>({});
    const {
        checkLocation,
        allowLocationAccess,
        getCurrentPermission,
        requestLocation
    } = useLocation();
    const { clockInStatus, showNudge } = useClockIn();
    const [routePlanningResume, setRoutePlanningResume] = useState(false);
    const [isVisitAlreadyClicked, setIsVisitAlreadyClicked] = useState(false);

    const { taskList, updateTaskList } = useTask();
    const setTaskList = (items: Array<TaskType>) => {
        updateTaskList(items);
    };

    const { setSelectedLoanData, getLoanDetails, getAddressData } =
        useLoanDetails();

    const onTaskSelected = (item: TaskType, action: string) => {
        if (companyType == CompanyType.loan) setSelectedLoanData({ ...item });
        else if (companyType == CompanyType.credit_line) {
            const addressData = getAddressData(
                item.allocation_month,
                item?.loan_id
            );
            setSelectedLoanData({ ...item, ...addressData });
        }
        if (!clockInStatus && isInternetAvailable) {
            ToastAndroid.show(CLOCK_IN_BEFORE_VISIT, ToastAndroid.SHORT);
            showNudge();
            setIsVisitAlreadyClicked(true);
            return;
        }
        let navigateScreen =
            companyType == CompanyType.loan
                ? 'TaskDetailScreen'
                : 'CreditTaskDetails';
        navigation.navigate(navigateScreen, {
            taskType: taskType
        });
    };

    useEffect(() => {
        if (isFocused) {
            if (isVisitAlreadyClicked && clockInStatus) {
                setIsVisitAlreadyClicked(false);
                let navigateScreen =
                    companyType == CompanyType.loan
                        ? 'TaskDetailScreen'
                        : 'CreditTaskDetails';
                navigation.navigate(navigateScreen, {
                    taskType: taskType
                });
            }
        } else setIsVisitAlreadyClicked(false);
    }, [isVisitAlreadyClicked, clockInStatus, isFocused]);

    const reloadData = () => {
        resetData();
        callVisitListApi('', undefined, 1);
    };

    const resetData = () => {
        setSearchQuery('');
        setVisitTotalCount(0);
        //setTaskList([])
        setSelected({});
        setPageNumber(1);
    };

    const debouncedSearch = useCallback(
        debounce((newQuery: string) => {
            callVisitListApi(newQuery, taskFilterType, 1);
        }, 800),
        [visitSearchType]
    );

    const updateValue = (newQuery: string) => {
        setSearchQuery(newQuery);
        setPageNumber(1);
        debouncedSearch(newQuery);
    };

    useFocusEffect(
        useCallback(() => {
            (async () => {
                if (locationAccess != LocationAccessType.disable_all)
                    await checkLocation();
            })();
        }, [])
    );
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const res = await getStorageData(ROUTE_PLANNING_RESUME_KEY);
                setRoutePlanningResume(JSON.parse(res) ?? false);
            })();
        }, [getStorageData])
    );
    useFocusEffect(
        useCallback(() => {
            if (newVisitCreated) {
                reloadData();
                setNewVisitCreated(false);
            }
            if (updateTaskDetails) {
                const indexVisit = taskList.indexOf(
                    updateTaskDetails as TaskType
                );
                if (indexVisit !== -1) {
                    taskList.splice(indexVisit, 1);
                    setTaskList(taskList);
                    setVisitTotalCount(visitTotalCount - 1);
                }
                setUpdateTaskDetails(undefined);
            }
        }, [newVisitCreated, updateTaskDetails, updatedAddressIndex])
    );
    useFocusEffect(
        useCallback(() => {
            if (finalTaskFilterData) {
                setSelectedTaskFilterData({ ...finalTaskFilterData });
            }
            reloadData();
        }, [taskSortType, taskFilterType, visitSearchType, finalTaskFilterData])
    );

    const callVisitListApi = async (
        newValue: string = searchQuery,
        newFilter: FilterTaskTypesText = taskFilterType,
        newPageNumber: number = 1
    ) => {
        if (isInternetAvailable) setLoading(true);
        const locationObject = await allowLocationAccess();
        if (!locationObject.access) {
            setLoading(false);
            return;
        }

        if (taskSortType.type == SortTaskTypes.distance) {
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
        try {
            const apiResponse = await loadTaskList(
                taskSortType,
                apiPageNumber,
                10,
                authData,
                loc,
                TaskStatusTypes.open,
                newFilter,
                newValue,
                visitSearchType,
                finalTaskFilterData
            );
            if (apiResponse) {
                const data = apiResponse.data;
                let tasks = [];
                let totalCount = 0;
                try {
                    tasks = data.visits;
                    const loanArray: Array<LoansArrayType> = [];
                    if (tasks) {
                        tasks.forEach((_loan: TaskType) => {
                            loanArray.push({
                                loan_id: _loan.loan_id!,
                                allocation_month: _loan.allocation_month!
                            });
                        });
                        if (loanArray.length > 0) getLoanDetails(loanArray);
                    }
                    totalCount = data.total_records;
                } catch (e) {}
                setVisitTotalCount(totalCount);

                if (apiPageNumber == 1) {
                    setTaskList(tasks);
                } else {
                    setTaskList(taskList.concat(tasks));
                }
            }
        } catch (e) {
            resetData();
        }

        setLoading(false);
    };

    const ListFooterComponenet = () => {
        if (taskList?.length < visitTotalCount - 1) return <ListFooterLoader />;
        return null;
    };

    const isRoutePlanningAllowed =
        Object.keys(selected).length > 1 || routePlanningResume;
    const canSelectNewItem = Object.keys(selected).length < 10;
    const isFiltersSelected = activeType == TaskSortAndFilterActiveType.filter;

    const onStartRoute = async () => {
        if (!isRoutePlanningAllowed && !routePlanningResume) {
            ToastAndroid.show(
                'Please select at least two visits to plan a route',
                ToastAndroid.SHORT
            );
            return;
        }
        if (!clockInStatus) {
            ToastAndroid.show(
                `Please clock in before ${
                    !routePlanningResume ? 'plannning' : 'resuming'
                } a route`,
                ToastAndroid.SHORT
            );
            showNudge();
            setStartRouteClickedAlready(true);
            return;
        }
        let newSelectedVisits = {};
        Object.values(selected).forEach((_item: any) => {
            const addressData = getAddressData(
                _item.allocation_month,
                _item.loan_id
            );
            newSelectedVisits = {
                ...newSelectedVisits,
                [_item.visit_id]: { ...addressData, ..._item }
            };
        });

        if (routePlanningResume) {
            navigation.navigate('MapScreen', {
                visits: newSelectedVisits,
                routePlanningResume
            });
            return;
        }
        if (
            locationAccess == LocationAccessType.disable_all &&
            !(await getCurrentPermission())
        ) {
            ToastAndroid.show(
                'This functionality is supported only with location access',
                ToastAndroid.SHORT
            );
            return;
        }
        if (
            locationAccess == LocationAccessType.enable_hard_prompt ||
            locationAccess == LocationAccessType.enable_soft_prompt
        ) {
            const permission = await requestLocation();
            if (permission != PermissionType.GRANTED) {
                ToastAndroid.show(
                    'This functionality is supported only with location access',
                    ToastAndroid.SHORT
                );
                return;
            }
        }

        setStorageData(VISIT_COMPLETE_STORAGE_KEY, JSON.stringify({}));
        navigation.navigate('MapScreen', {
            visits: newSelectedVisits,
            routePlanningResume
        });
    };

    const onResetRoute = async () => {
        if (!routePlanningResume) {
            ToastAndroid.show('Please start a new route', ToastAndroid.SHORT);
            return;
        }
        setSelected({});
        try {
            const apiResponse = await resetRoute(authData);
            ToastAndroid.show(apiResponse?.message, ToastAndroid.SHORT);
            setRoutePlanningResume(false);
            await setStorageData(
                ROUTE_PLANNING_RESUME_KEY,
                JSON.stringify(false)
            );
        } catch (e) {
            //
        }
    };

    const resetStartClickTrigger = () => setStartRouteClickedAlready(false);

    useEffect(() => {
        (async () => {
            if (isFocused) {
                if (
                    isStartRouteClickedAlready &&
                    clockInStatus &&
                    (selected || routePlanningResume)
                ) {
                    await setStorageData(
                        VISIT_COMPLETE_STORAGE_KEY,
                        JSON.stringify({})
                    );
                    resetStartClickTrigger();
                    navigation.navigate('MapScreen', {
                        visits: selected,
                        routePlanningResume
                    });
                }
            } else resetStartClickTrigger();
        })();
    }, [isStartRouteClickedAlready, clockInStatus, selected, isFocused]);
    let content = <TaskFilters />;

    if (!isFiltersSelected) {
        content = (
            <View style={{ flex: 1, backgroundColor: Colors.table.grey }}>
                <OnlineOnly>
                    <CustomSearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={updateValue}
                        searchType={
                            companyType == CompanyType.loan
                                ? VisitSearchTypes
                                : VisitSearchCreditLineTypes
                        }
                        usedOn={SearchUsedOn.visit}
                    />
                </OnlineOnly>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={taskList}
                    extraData={taskList}
                    onEndReached={() => {
                        if (!loading) {
                            if (
                                pageNumber <
                                Math.floor(visitTotalCount / 10) + 1
                            ) {
                                callVisitListApi(
                                    searchQuery,
                                    taskFilterType,
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
                                message={`No visits found!`}
                            />
                        ) : null
                    }
                    ListFooterComponent={ListFooterComponenet}
                    onEndReachedThreshold={0.5}
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl
                            enabled
                            colors={[BLUE_DARK]}
                            progressViewOffset={10}
                            refreshing={loading}
                            onRefresh={() => {
                                reloadData();
                            }}
                        />
                    }
                    refreshing={loading}
                    renderItem={({ item, index }) => {
                        const onClick = () => onTaskSelected(item, 'noaction');

                        const present = selected[item.visit_id];

                        const onCheckboxClicked = () => {
                            if (routePlanningResume) {
                                ToastAndroid.show(
                                    ROUTE_PLANNING_NOT_ALLOWED,
                                    ToastAndroid.LONG
                                );
                                return;
                            }
                            if (!present) {
                                if (!canSelectNewItem) {
                                    ToastAndroid.show(
                                        'At max 10 visits can be used to plan route',
                                        ToastAndroid.SHORT
                                    );
                                    return;
                                }
                                setSelected({
                                    ...selected,
                                    [item.visit_id]: item
                                });
                            } else {
                                delete selected[item.visit_id];
                                setSelected({ ...selected });
                            }
                            resetStartClickTrigger();
                        };

                        return (
                            <TaskRow
                                checked={!!present}
                                onCheckboxClicked={onCheckboxClicked}
                                onClick={onClick}
                                rowData={item as TaskType}
                            />
                        );
                    }}
                />
            </View>
        );
    }

    return (
        <>
            <OnlineOnly>
                <View style={styles.wrapper}>
                    <TaskSortAndFilter />
                    {companyType == CompanyType.loan &&
                        !filterActive &&
                        isRoutePlanningEnabled && (
                            <View style={styles.routeButtonContainer}>
                                {routePlanningResume && (
                                    <TouchableOpacity
                                        style={[
                                            styles.startRouteButton,
                                            {
                                                backgroundColor: 'transparent',
                                                marginHorizontal: 0,
                                                marginLeft: RFPercentage(3)
                                            }
                                        ]}
                                        activeOpacity={1}
                                        onPress={onResetRoute}
                                        disabled={!routePlanningResume}
                                    >
                                        <Typography
                                            variant={TypographyVariants.caption}
                                            style={{
                                                color: BLUE_DARK
                                            }}
                                        >
                                            {'Reset'}
                                        </Typography>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={[
                                        styles.startRouteButton,
                                        {
                                            backgroundColor:
                                                isRoutePlanningAllowed
                                                    ? BLUE_DARK
                                                    : '#E3E6E8'
                                        }
                                    ]}
                                    activeOpacity={1}
                                    onPress={onStartRoute}
                                >
                                    <Typography
                                        variant={TypographyVariants.caption}
                                        style={{
                                            color: !isRoutePlanningAllowed
                                                ? '#9FA6AD'
                                                : '#fff'
                                        }}
                                    >
                                        {`${
                                            !routePlanningResume
                                                ? 'Start'
                                                : 'Resume'
                                        } route`}
                                    </Typography>
                                </TouchableOpacity>
                            </View>
                        )}
                </View>
            </OnlineOnly>

            {content}
        </>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#043E90',
        padding: RFPercentage(0.7),
        paddingHorizontal: RFPercentage(1.2)
    },
    buttonTitle: {
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.6),
        paddingHorizontal: RFPercentage(0.3)
    },
    deactiveButtonContainer: {
        backgroundColor: '#f6f8fb',
        marginRight: RFPercentage(0.5),
        padding: RFPercentage(0.7),
        paddingHorizontal: RFPercentage(1.2)
    },
    routeButtonContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    startRouteButton: {
        borderRadius: 4,
        justifyContent: 'center',
        marginHorizontal: RFPercentage(0.7),
        marginVertical: RFPercentage(0.7),
        maxHeight: RFPercentage(4),
        paddingHorizontal: RFPercentage(0.8),
        paddingVertical: RFPercentage(1)
    },
    wrapper: {
        backgroundColor: '#F6F8FB',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 4
    }
});
