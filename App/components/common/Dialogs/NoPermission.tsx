import React from 'react';
import { BackHandler } from 'react-native';
import { NO_PERMISSION_CONTENT } from '../../../constants/constants';
import { KillAppProcess } from '../../../services/utils';
import { SimpleAlertDialog } from './SimplerAlertDialog';

export const NoPermissonModal = ({
    visible,
    setVisible
}: {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <SimpleAlertDialog
            title={NO_PERMISSION_CONTENT.title}
            content={NO_PERMISSION_CONTENT.body}
            visible={visible}
            dismissable={false}
            negativeButtonLabel="Close App"
            showOnlyNegative
            negativeAction={() => {
                BackHandler.exitApp();
            }}
            positiveAction={() => {
                setVisible(false);
            }}
            setVisible={setVisible}
        />
    );
};
