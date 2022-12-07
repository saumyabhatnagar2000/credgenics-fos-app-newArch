import { TaskType } from '../../types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    updateTaskList as _updateTaskList,
    selectTaskList
} from '../redux/taskSlice';

export default function useTask() {
    const dispatch = useAppDispatch();
    const taskList = useAppSelector(selectTaskList);

    const updateTaskList = (a: TaskType[]) => {
        dispatch(_updateTaskList(a));
    };

    return { taskList, updateTaskList };
}
