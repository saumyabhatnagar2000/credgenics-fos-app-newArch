import React from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OneTimePassword from '../../components/auth/OneTimePassword';
import CustomAppBar from '../../components/common/AppBar';

export default function EnterOTPScreen({ route }) {
    const { otpType, password, username } = route.params;
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
                <KeyboardAvoidingView style={styles.container}>
                    <OneTimePassword
                        style={styles.body}
                        otpType={otpType}
                        password={password}
                        username={username}
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
