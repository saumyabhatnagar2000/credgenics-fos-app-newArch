import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { TaskType } from '../../types';

export interface TaskState {
    taskList: Array<TaskType>;
}

const initialState: TaskState = {
    taskList: []
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        updateTaskList: (state, action: PayloadAction<Array<TaskType>>) => {
            state.taskList = action.payload;
        }
    }
});

export const { updateTaskList } = taskSlice.actions;

export const selectTaskList = (state: RootState) => state.task.taskList;

export default taskSlice.reducer;
