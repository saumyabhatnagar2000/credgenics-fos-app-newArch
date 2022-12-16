import React, { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@rneui/base';
import { Divider } from '@rneui/base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Dialog, Portal } from 'react-native-paper';
import {
    cameraPermissionContent,
    cameraPermissionTitle,
    mediaPermissionContent,
    mediaPermissionTitle
} from '../../../constants/constants';
import {
    cameraPermissionChecker,
    mediaPermissionChecker,
    openCamera,
    openMedia,
    requestCameraPermission,
    requestMediaPermission
} from '../../../services/imageUtils';
import { SimpleAlertDialog } from './SimplerAlertDialog';

export const FileSelectorDialog = ({
    visible,
    setVisible,
    setImageData
}: {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setImageData: Function;
}) => {
    const hideDialog = () => setVisible(false);
    const [dialogTitle, setDialogTitle] = useState<string>('');
    const [dialogContent, setDialogContent] = useState<string>('');
    const [showDialog, setShowDialog] = useState(false);

    const openCameraHelper = async () => {
        cameraPermissionChecker().then((result) => {
            if (!result) {
                requestCameraPermission().then((result) => {
                    if (!result) {
                        setDialogTitle(cameraPermissionTitle);
                        setDialogContent(cameraPermissionContent);
                        setShowDialog(true);
                    } else {
                        setShowDialog(false);
                        openCamera(setImageData);
                    }
                });
            } else {
                openCamera(setImageData);
            }
            hideDialog();
        });
    };

    const openGalleryHelper = async () => {
        mediaPermissionChecker().then((result) => {
            if (!result) {
                requestMediaPermission().then((result) => {
                    if (!result) {
                        setDialogTitle(mediaPermissionTitle);
                        setDialogContent(mediaPermissionContent);
                        setShowDialog(true);
                    } else {
                        setShowDialog(false);
                        openMedia(setImageData);
                    }
                });
            } else {
                openMedia(setImageData);
            }
            hideDialog();
        });
    };

    const FileSelectorOptionItem = ({
        icon,
        value,
        onPress
    }: {
        icon: string;
        value: string;
        onPress: Function;
    }) => (
        <TouchableOpacity activeOpacity={0.5} onPress={() => onPress()}>
            <View style={styles.container}>
                <Icon
                    name={icon}
                    type="material"
                    size={20}
                    color="#3E7BFA"
                    raised
                    reverse
                />
                <Text style={styles.titleStyle}>{value}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <SimpleAlertDialog
                title={dialogTitle}
                content={dialogContent}
                visible={showDialog}
                dismissable={true}
                negativeButtonLabel="Open Settings"
                positiveButtonLabel="close"
                negativeAction={() => {
                    Linking.openSettings();
                    setShowDialog(false);
                }}
                positiveAction={() => {
                    setShowDialog(false);
                }}
                setVisible={setVisible}
            />
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Choose an action</Dialog.Title>
                    <Divider style={{ height: 0.5, backgroundColor: '#ccc' }} />
                    <Dialog.Content>
                        <FileSelectorOptionItem
                            icon="photo-camera"
                            value="Open Camera"
                            onPress={openCameraHelper}
                        />
                        <FileSelectorOptionItem
                            icon="folder"
                            value="Select from Gallery"
                            onPress={openGalleryHelper}
                        />
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: 10
    },
    titleStyle: {
        color: 'black',
        fontFamily: 'poppins',
        fontSize: 16,
        marginHorizontal: 20
    }
});
