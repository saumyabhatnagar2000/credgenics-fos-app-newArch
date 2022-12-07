import React from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Login from '../../components/auth/Login';
import { View } from '../../components/Themed';
import Logo from '../../assets/Logo';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ScrollView } from 'react-native-gesture-handler';
import { BLUE_DARK } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { QuestionIcon } from '../../components/common/Icons/QuestionIcon';
import Typography, { TypographyVariants } from '../../components/ui/Typography';

export default function LoginScreen() {
    const { navigate } = useNavigation();
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.logo}>
                    <Logo size={RFPercentage(20)} />
                </View>
                <Login />
            </KeyboardAvoidingView>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10
                }}
                onPress={() => navigate('HelpSectionScreen')}
            >
                <Typography
                    variant={TypographyVariants.body2}
                    style={styles.helpText}
                >
                    Help
                </Typography>
                <QuestionIcon size={12} color={BLUE_DARK} />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexGrow: 1,
        justifyContent: 'center'
    },
    helpText: {
        color: BLUE_DARK,
        paddingRight: 5
    },
    logo: {
        alignItems: 'center'
    }
});
