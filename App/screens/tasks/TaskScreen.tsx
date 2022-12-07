import * as React from 'react';
import CustomAppBar from '../../components/common/AppBar';
import TaskList from '../../components/tasks/TaskList';
import { ClockInNudgeInitPage } from '../../contexts/ClockInStatusContext';
import { useClockIn } from '../../hooks/useClockIn';

export default function TaskScreen({}) {
    const { checkClockInNudge } = useClockIn();

    React.useEffect(() => {
        checkClockInNudge(ClockInNudgeInitPage.visit_list);
    }, []);

    return (
        <>
            <CustomAppBar
                title={'Visits'}
                search={false}
                options={false}
                notifications={false}
                backButton={false}
                menuButton={true}
                filter={false}
                calendar={false}
                add={false}
            />
            <TaskList />
        </>
    );
}
