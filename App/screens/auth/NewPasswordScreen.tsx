import React from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NewPassword from '../../components/auth/NewPassword';
import CustomAppBar from '../../components/common/AppBar';

export default function NewPasswordScreen({ route }) {
    const { request_id, forgot_username } = route.params;

    return (
        <>
            <CustomAppBar
                title={''}
                inverted
                filter={false}
                sort={false}
                calendar={false}
                search={false}
                backButton={true}
                add={false}
                notifications={false}
                options={false}
            />
            <ScrollView contentContainerStyle={styles.container}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={styles.container}
                >
                    <NewPassword
                        style={styles.body}
                        requestID={request_id}
                        forgotUserName={forgot_username}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    body: { flex: 2, justifyContent: 'center' },
    container: {
        backgroundColor: 'white',
        flexGrow: 1,
        justifyContent: 'space-between'
    }
});
