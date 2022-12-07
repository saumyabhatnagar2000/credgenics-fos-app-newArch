import React from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ResetPassword from '../../components/auth/ResetPassword';
import CustomAppBar from '../../components/common/AppBar';

export default function ResetPasswordScreen() {
    return (
        <>
            <CustomAppBar
                inverted
                title={''}
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
                    <ResetPassword style={styles.body} />
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
