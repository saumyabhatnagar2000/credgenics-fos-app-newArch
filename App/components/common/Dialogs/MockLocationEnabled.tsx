import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { MOCK_LOCATION_ENABLED } from '../../../constants/constants';
import { SimpleAlertDialog } from './SimplerAlertDialog';
import { KillAppProcess } from '../../../services/utils';

export const MockLocationEnabledModal = ({
    visible,
    setVisible
}: {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <SimpleAlertDialog
            title={MOCK_LOCATION_ENABLED.title}
            content={MOCK_LOCATION_ENABLED.body}
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