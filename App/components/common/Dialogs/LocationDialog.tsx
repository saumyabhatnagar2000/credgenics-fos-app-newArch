import React from 'react';
import { Linking, View } from 'react-native';
import { LocationAccessType, PermissionType } from '../../../../enums';
import {
    locationPermissionContent,
    locationPermissionPartialContent,
    locationPermissionTitle
} from '../../../constants/constants';
import { useAuth } from '../../../hooks/useAuth';
import { SimpleAlertDialog } from './SimplerAlertDialog';
import { useLocation } from '../../../hooks/useLocation';

export const LocationDialog = ({
    visible,
    setVisible,
    currentPermission
}: {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    currentPermission: PermissionType | undefined;
}) => {
    const { locationAccess } = useAuth();
    const { checkLocation, requestLocation, locationPermission } =
        useLocation();

    return currentPermission == PermissionType.BLOCKED ||
        locationAccess == LocationAccessType.enable_all ? (
        <View>
            <SimpleAlertDialog
                title={locationPermissionTitle}
                content={locationPermissionContent}
                visible={visible}
                dismissable={false}
                negativeButtonLabel="Allow"
                positiveButtonLabel="Skip"
                showOnlyNegative
                negativeAction={async () => {
                    Linking.openSettings();
                }}
                positiveAction={() => {
                    setVisible(false);
                }}
                setVisible={setVisible}
            />
        </View>
    ) : (
        <View>
            <SimpleAlertDialog
                title={locationPermissionTitle}
                content={locationPermissionPartialContent}
                visible={visible}
                dismissable={false}
                negativeButtonLabel="Allow"
                positiveButtonLabel="Skip"
                negativeAction={async () => {
                    setVisible(false);
                    requestLocation();
                }}
                positiveAction={() => {
                    setVisible(false);
                }}
                setVisible={setVisible}
            />
        </View>
    );
};
