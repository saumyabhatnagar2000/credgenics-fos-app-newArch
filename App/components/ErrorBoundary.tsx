import React from 'react';
import { StyleSheet, View } from 'react-native';
import CodePush from 'react-native-code-push';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ErrorAssets } from '../assets/ErrorAssets';
import { SOMETHING_WENT_WRONG } from '../constants/constants';
import { sendContactUsEmail } from '../services/utils';
import CustomButton from './ui/CustomButton';
import { LinearGradientHOC } from './ui/LinearGradientHOC';
import Typography, { TypographyVariants } from './ui/Typography';
import * as Sentry from '@sentry/react-native';

export class ErrorBoundary extends React.Component<any, any> {
    state = {
        error: false
    };

    static getDerivedStateFromError(error: any) {
        return { error: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        Sentry.captureMessage(
            `${error?.message ?? ''} Redirected to error boundary`
        );
    }

    render() {
        if (this.state.error) {
            return (
                <View style={styles.container}>
                    <View>
                        <Typography
                            variant={TypographyVariants.heading3}
                            style={{
                                marginBottom: RFPercentage(1),
                                textAlign: 'center'
                            }}
                        >
                            Oops!
                        </Typography>
                        <Typography
                            style={{
                                textAlign: 'center',
                                marginBottom: RFPercentage(2.5)
                            }}
                            variant={TypographyVariants.body3}
                        >
                            {SOMETHING_WENT_WRONG}
                        </Typography>
                        <ErrorAssets />
                        <LinearGradientHOC style={styles.linearGradient}>
                            <CustomButton
                                style={styles.buttonContainer}
                                title="Try again"
                                onPress={() => {
                                    CodePush.restartApp();
                                }}
                            />
                        </LinearGradientHOC>

                        <Typography
                            variant={TypographyVariants.caption1}
                            style={styles.contactUsText}
                            onPress={sendContactUsEmail}
                        >
                            Contact Us?
                        </Typography>
                    </View>
                </View>
            );
        } else {
            return this.props.children;
        }
    }
}
const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        height: RFPercentage(2.75)
    },
    contactUsText: {
        color: '#3889E9',
        marginVertical: RFPercentage(2),
        textAlign: 'center'
    },
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: RFPercentage(2.5)
    },
    linearGradient: {
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: RFPercentage(1)
    }
});
export default ErrorBoundary;
