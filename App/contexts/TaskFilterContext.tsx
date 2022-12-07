import React, { createContext, useEffect, useState } from 'react';
import {
    FilterTaskTypesText,
    SortTaskTypes,
    SortValue,
    TaskCreatorType,
    TaskFilterType,
    TaskOptions,
    TaskSortAndFilterActiveType
} from '../../enums';
import { SortBy, TaskFilterContextData } from '../../types';
import { useMixpanel } from './MixpanelContext';
import { EventScreens, Events } from '../constants/Events';

const TaskFilterContext = createContext<TaskFilterContextData>(
    {} as TaskFilterContextData
);

export const TaskFiltersObject = {
    [TaskFilterType.scheduled_date]: [
        FilterTaskTypesText.today,
        FilterTaskTypesText.tomorrow,
        FilterTaskTypesText.this_week,
        FilterTaskTypesText.this_month
    ],
    [TaskFilterType.visit_purpose]: [
        TaskOptions.ptp,
        TaskOptions.surprise_visit
    ],
    [TaskFilterType.visit_creator]: [
        TaskCreatorType.agent,
        TaskCreatorType.manager
    ]
};

const TaskFilterProvider: React.FC = ({ children }) => {
    const { logEvent } = useMixpanel();

    const [taskSortType, setTaskSortType] = useState<SortBy>({
        type: SortTaskTypes.distance,
        value: SortValue.ascending
    });
    const [taskFilterType, setTaskFilterType] = useState(
        FilterTaskTypesText.today
    );

    const [activeType, setActiveType] =
        useState<TaskSortAndFilterActiveType | null>(null);

    const [visitSearchType, setVisitSearchType] = useState('applicant_name');

    const [activeFilterTab, setActiveFilterTab] = useState(
        TaskFilterType.scheduled_date
    );

    const [finalTaskFilterData, setFinalTaskFilterData] = useState<any>({});
    const [selectedTaskFilterData, setSelectedTaskFilterData] = useState<any>(
        {}
    );
    const [filterActive, setFilterActive] = useState(false);

    const checkBoxClicked = (tab, status) => {
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

    const radioButtonClicked = (tab, status) => {
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
        logEvent(Events.filter, EventScreens.task_list, {
            type: tab,
            value: status,
            select: selected
        });
    };

    const clearAllFilters = () => {
        logEvent(Events.filter, EventScreens.task_list, {
            type: 'reset'
        });
        setSelectedTaskFilterData({});
    };

    const setFilters = () => {
        logEvent(Events.filter, EventScreens.task_list, {
            type: 'apply'
        });
        setActiveType(null);
        setFilterActive(false);
        setFinalTaskFilterData(selectedTaskFilterData);
    };

    useEffect(() => {
        const isFiltersSelected =
            activeType == TaskSortAndFilterActiveType.filter;
        if (isFiltersSelected) setSelectedTaskFilterData(finalTaskFilterData);
    }, [activeType, finalTaskFilterData]);

    return (
        <TaskFilterContext.Provider
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
                finalTaskFilterData,
                setFinalTaskFilterData,
                checkBoxClicked,
                visitSearchType,
                setVisitSearchType,
                clearAllFilters,
                setFilters,
                filterActive,
                setFilterActive,
                radioButtonClicked
            }}
        >
            {children}
        </TaskFilterContext.Provider>
    );
};

export { TaskFilterProvider, TaskFilterContext };
