import React, { createContext, useEffect, useState } from 'react';
import {
    DepositTypes,
    FilterTaskTypesText,
    SortTaskTypes,
    SortValue,
    TaskCreatorType,
    TaskHistoryFilterType,
    TaskOptions,
    TaskRecoveryType,
    TaskSortAndFilterActiveType
} from '../../enums';
import { SortBy, TaskHistoryFilterContextData } from '../../types';
import { useMixpanel } from './MixpanelContext';
import { EventScreens, Events } from '../constants/Events';

const TaskHistoryFilterContext = createContext<TaskHistoryFilterContextData>(
    {} as TaskHistoryFilterContextData
);

export const TaskHistoryFiltersObject = {
    [TaskHistoryFilterType.submitted]: [
        FilterTaskTypesText.today,
        FilterTaskTypesText.yesterday,
        FilterTaskTypesText.this_week,
        FilterTaskTypesText.this_month
    ],
    [TaskHistoryFilterType.visit_purpose]: [
        TaskOptions.ptp,
        TaskOptions.surprise_visit
    ],
    [TaskHistoryFilterType.visit_creator]: [
        TaskCreatorType.agent,
        TaskCreatorType.manager
    ],
    [TaskHistoryFilterType.recovery_done]: [
        TaskRecoveryType.yes,
        TaskRecoveryType.no
    ],
    [TaskHistoryFilterType.recovery_mode]: [
        DepositTypes.cash,
        DepositTypes.cheque,
        DepositTypes.online
    ]
};

const TaskHistoryFilterProvider: React.FC = ({ children }) => {
    const { logEvent } = useMixpanel();

    const [taskSortType, setTaskSortType] = useState<SortBy>({
        type: SortTaskTypes.visit_date,
        value: SortValue.descending
    });
    const [taskFilterType, setTaskFilterType] = useState(
        FilterTaskTypesText.today
    );

    const [activeType, setActiveType] =
        useState<TaskSortAndFilterActiveType | null>(null);

    const [visitHistorySearchType, setVisitHistorySearchType] =
        useState('applicant_name');

    const [activeFilterTab, setActiveFilterTab] = useState(
        TaskHistoryFilterType.submitted
    );

    const [finalTaskHistoryFilterData, setFinalTaskHistoryFilterData] =
        useState<any>({});
    const [selectedTaskFilterData, setSelectedTaskFilterData] = useState<any>(
        {}
    );
    const [filterActive, setFilterActive] = useState(false);

    const checkBoxClicked = (tab: any, status: any) => {
        if (
            tab == TaskHistoryFilterType.recovery_mode &&
            (selectedTaskFilterData?.[TaskHistoryFilterType.recovery_done]?.[
                TaskRecoveryType.no
            ] ||
                !selectedTaskFilterData?.[TaskHistoryFilterType.recovery_done])
        )
            return;

        let selected;

        if (selectedTaskFilterData?.[tab]?.[status]) {
            delete selectedTaskFilterData?.[tab]?.[status];
            setSelectedTaskFilterData({
                ...selectedTaskFilterData
            });
            selected = false;
        } else {
            setSelectedTaskFilterData({
                ...selectedTaskFilterData,
                [tab]: {
                    ...selectedTaskFilterData[tab],
                    [status]: !selectedTaskFilterData?.[tab]?.[status]
                }
            });
            selected = true;
        }
        logEvent(Events.filter, EventScreens.task_list, {
            type: tab,
            value: status,
            select: selected
        });
    };

    const radioButtonClicked = (tab: any, status: any) => {
        let selected;

        if (selectedTaskFilterData?.[tab]?.[status]) {
            delete selectedTaskFilterData?.[tab]?.[status];
            setSelectedTaskFilterData({
                ...selectedTaskFilterData
            });
            selected = false;
        } else {
            setSelectedTaskFilterData({
                ...selectedTaskFilterData,
                [tab]: {
                    [status]: !selectedTaskFilterData?.[tab]?.[status]
                }
            });
            selected = true;
        }
        logEvent(Events.filter, EventScreens.task_history_list, {
            type: tab,
            value: status,
            select: selected
        });
    };

    const clearAllFilters = () => {
        logEvent(Events.filter, EventScreens.task_history_list, {
            type: 'reset'
        });
        setSelectedTaskFilterData({});
    };

    const setFilters = () => {
        logEvent(Events.filter, EventScreens.task_history_list, {
            type: 'apply'
        });
        setActiveType(null);
        setFilterActive(false);
        if (
            selectedTaskFilterData?.[TaskHistoryFilterType.recovery_done]?.[
                TaskRecoveryType.no
            ]
        ) {
            setFinalTaskHistoryFilterData({
                ...selectedTaskFilterData,
                [TaskHistoryFilterType.recovery_mode]: {}
            });
        } else setFinalTaskHistoryFilterData(selectedTaskFilterData);
    };

    useEffect(() => {
        const isFiltersActive =
            activeType == TaskSortAndFilterActiveType.filter;
        if (isFiltersActive)
            setSelectedTaskFilterData(finalTaskHistoryFilterData);
    }, [activeType, finalTaskHistoryFilterData]);

    return (
        <TaskHistoryFilterContext.Provider
            value={{
                taskFilterType,
                setTaskFilterType,
                taskSortType,
                setTaskSortType,
                activeType,
                setActiveType,
                activeFilterTab,
                setActiveFilterTab,
                selectedTaskFilterData,
                setSelectedTaskFilterData,
                finalTaskHistoryFilterData,
                setFinalTaskHistoryFilterData,
                checkBoxClicked,
                visitHistorySearchType,
                setVisitHistorySearchType,
                clearAllFilters,
                setFilters,
                filterActive,
                setFilterActive,
                radioButtonClicked
            }}
        >
            {children}
        </TaskHistoryFilterContext.Provider>
    );
};

export { TaskHistoryFilterProvider, TaskHistoryFilterContext };
