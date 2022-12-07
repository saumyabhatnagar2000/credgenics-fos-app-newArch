import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';

interface ConnectingClickToCallModalProps {
    visible: boolean;
}

export default function ConnectingClickToCallModal({
    visible
}: ConnectingClickToCallModalProps) {
    return (
        <Portal>
            <Modal
                visible={visible}
                dismissable={false}
                contentContainerStyle={styles.containerStyle}
            >
                <Text style={styles.heading}>Connecting you to the user</Text>
                <ActivityIndicator size="large" color="#3E7BFA" />
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'flex-start',
        padding: 20,
        width: '90%'
    },
    heading: {
        alignSelf: 'center',
        color: '#3E7BFA',
        flexWrap: 'wrap',
        fontFamily: 'poppins',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: 'bold',
        margin: 10,
        paddingVertical: 2
    }
});
