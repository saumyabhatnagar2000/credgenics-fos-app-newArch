import React, { createContext, useState } from 'react';
import { TaskContextData, TaskType } from '../../types';

const TaskContext = createContext<TaskContextData>({} as TaskContextData);

const TaskProvider: React.FC = ({ children }) => {
    const [visitImage, setVisitImage] = useState();
    const [recoveryImage, setRecoveryImage] = useState();
    const [depositImage, setDepositImage] = useState();
    const [updateTaskDetails, setUpdateTaskDetails] = useState<
        TaskType | undefined
    >();
    const [visitSubmitted, setVisitSubmitted] = useState(false);
    const [newVisitCreated, setNewVisitCreated] = useState<boolean>(false);
    const [updatedAddressIndex, setUpdatedAddressIndex] = useState(null);
    const [updatedContactDetails, setUpdatedContactDetails] = useState(false);
    const [onlineTabChangeIdx, setOnlineTabChangeIdx] = useState(0);

    const imageProvider = (type: string) => {
        if (type === 'visit') {
            return visitImage;
        }
        if (type === 'recovery') {
            return recoveryImage;
        }
        if (type === 'deposit') {
            return depositImage;
        }
    };
    const imageSetterProvider = (type: string) => {
        if (type === 'visit') {
            return setVisitImage;
        }
        if (type === 'recovery') {
            return setRecoveryImage;
        }
        if (type === 'deposit') {
            return setDepositImage;
        }
    };
    return (
        <TaskContext.Provider
            value={{
                imageProvider,
                imageSetterProvider,
                updateTaskDetails,
                setUpdateTaskDetails,
                newVisitCreated,
                setNewVisitCreated,
                updatedAddressIndex,
                setUpdatedAddressIndex,
                updatedContactDetails,
                setUpdatedContactDetails,
                visitSubmitted,
                setVisitSubmitted,
                onlineTabChangeIdx,
                setOnlineTabChangeIdx
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export { TaskContext, TaskProvider };
