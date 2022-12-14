import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Image } from 'react-native';

import useColorScheme from './App/hooks/useColorScheme';
import Navigation from './App/navigation';
import { AuthProvider } from './App/contexts/Auth';
import { Provider as PaperProvider } from 'react-native-paper';
import { ActionProvider } from './App/contexts/ActionContext';
import { TaskProvider } from './App/contexts/TaskContext';
import CodePush from 'react-native-code-push';
import config from './App/config';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from './App/components/ui/Typography';
import { ClockInStatusContextProvider } from './App/contexts/ClockInStatusContext';
import * as Sentry from '@sentry/react-native';
import packageJson from './package.json';
import { SENTRY_DSN } from './App/constants/Sentry';
import useDeviceVerification from './App/hooks/useDeviceVerification';
import { TaskFilterProvider } from './App/contexts/TaskFilterContext';
import { TaskHistoryFilterProvider } from './App/contexts/TaskHistoryFilterContext';
import { LocationProvider } from './App/contexts/LocationContext';
import { MixpanelProvider } from './App/contexts/MixpanelContext';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ProgressBar } from './App/components/common/ProgressBar';
import ErrorBoundary from './App/components/ErrorBoundary';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './App/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const logoImage = require('./assets/images/cg-collect-logo.png');

function App() {
    const [isDeviceVerifyLoading, isDeviceVerified] = useDeviceVerification();
    const colorScheme = useColorScheme();
    const [showIsUpdatedModal, setShowIsUpdatedModal] = useState(false);
    const [bytesDownloaded, setBytesDownloaded] = useState(0);
    const [totalBytesDown, setTotalBytesDown] = useState(0);

    const isLoadingComplete = !isDeviceVerifyLoading;

    var onError = function (error: any) {
        Sentry.captureMessage('Codepush error');
    };

    const onDownloadProgress = ({
        receivedBytes,
        totalBytes
    }: {
        receivedBytes: number;
        totalBytes: number;
    }) => {
        CodePush.disallowRestart();
        if (!showIsUpdatedModal) {
            setShowIsUpdatedModal(true);
        }
        if (totalBytesDown == 0) setTotalBytesDown(totalBytes);

        setBytesDownloaded(receivedBytes);
        if (receivedBytes >= totalBytes) {
            setShowIsUpdatedModal(false);
            CodePush.allowRestart();
        }
    };
    const onSyncStatusChange = function (SyncStatus: CodePush.SyncStatus) {
        switch (SyncStatus) {
            case 2:
                setShowIsUpdatedModal(true);
                break;
        }
    };

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        __DEV__ ||
            CodePush.sync(
                {
                    rollbackRetryOptions: {
                        delayInHours: 0.05,
                        maxRetryAttempts: 20
                    },
                    deploymentKey: config.CODEPUSH.deploymentKey.android,
                    installMode: CodePush.InstallMode.IMMEDIATE
                },
                onSyncStatusChange,
                onDownloadProgress,
                onError
            );
    }, []);

    if (!isLoadingComplete) {
        return null;
        // show no loader when loading resources
    } else {
        if (!isDeviceVerified) {
            return (
                <View style={styles.rootedDeviceContainer}>
                    <Typography style={styles.rootedText}>
                        {`Trouble verifying the device.`}
                    </Typography>
                </View>
            );
        } else if (showIsUpdatedModal) {
            return (
                <View style={styles.updateScreenContainer}>
                    <View>
                        <Image
                            resizeMode="contain"
                            style={styles.logoStyle}
                            source={logoImage}
                        />
                    </View>
                    <View style={styles.containerStyle}>
                        <Typography
                            variant={TypographyVariants.body}
                            style={{
                                fontFamily: TypographyFontFamily.heavy,
                                marginBottom: RFPercentage(1)
                            }}
                        >
                            Update in Progress
                        </Typography>
                        <Typography
                            style={styles.modalText}
                            variant={TypographyVariants.caption}
                        >
                            {` Please do not close the app during\n the update.`}
                        </Typography>
                        <ProgressBar
                            title="Bytes"
                            progress={bytesDownloaded}
                            total={totalBytesDown}
                            showPercentage
                        />
                    </View>
                </View>
            );
        }

        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ErrorBoundary>
                    <SafeAreaProvider>
                        <Provider store={store}>
                            <PersistGate loading={null} persistor={persistor}>
                                <MixpanelProvider>
                                    <AuthProvider>
                                        <ClockInStatusContextProvider>
                                            <LocationProvider>
                                                <ActionProvider>
                                                    <TaskFilterProvider>
                                                        <TaskHistoryFilterProvider>
                                                            <TaskProvider>
                                                                <PaperProvider>
                                                                    <Navigation
                                                                        colorScheme={
                                                                            colorScheme
                                                                        }
                                                                    />
                                                                </PaperProvider>
                                                            </TaskProvider>
                                                        </TaskHistoryFilterProvider>
                                                    </TaskFilterProvider>
                                                </ActionProvider>
                                            </LocationProvider>
                                        </ClockInStatusContextProvider>
                                    </AuthProvider>
                                </MixpanelProvider>
                            </PersistGate>
                        </Provider>
                    </SafeAreaProvider>
                </ErrorBoundary>
            </GestureHandlerRootView>
        );
    }
}

const styles = StyleSheet.create({
    rootedDeviceContainer: {
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 20,
        top: '70%'
    },
    rootedText: {
        textAlign: 'center',
        color: 'red',
        fontSize: 16,
        lineHeight: 26
    },
    containerStyle: {
        backgroundColor: '#fff',
        width: '80%',
        alignSelf: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: RFPercentage(3),
        paddingHorizontal: RFPercentage(2),
        marginBottom: RFPercentage(7)
    },
    modalText: {
        textAlign: 'center',
        lineHeight: RFPercentage(2),
        marginBottom: RFPercentage(1)
    },
    updateScreenContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logoStyle: {
        marginTop: RFPercentage(33),
        height: 200,
        width: 200
    }
});

const codepushOptions = {
    checkFrequency: CodePush.CheckFrequency.MANUAL,
    deploymentKey: config.CODEPUSH.deploymentKey.android
};

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
    enabled: !__DEV__,
    dsn: SENTRY_DSN,
    integrations: [new Sentry.ReactNativeTracing({ routingInstrumentation })],
    environment: config.ENV,
    release: `com.credgenics.fos@${packageJson.version}+codepush:${packageJson.codepushDistVersion}`,
    dist: packageJson.codepushDistVersion
});

const prodApp = CodePush(codepushOptions)(Sentry.wrap(App));

export default __DEV__ ? App : prodApp;
