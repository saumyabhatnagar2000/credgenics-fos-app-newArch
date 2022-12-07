import * as React from 'react';
import HistoryList from '../../components/history/HistoryList';
import TaskHistorySortAndFilter from '../../components/tasks/TaskHistorySortAndFilter';

export default function TaskHistoryScreen() {
    return (
        <>
            <TaskHistorySortAndFilter />
            <HistoryList />
        </>
    );
}
