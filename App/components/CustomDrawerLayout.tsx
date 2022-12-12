import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ToastAndroid, View } from 'react-native';
import { Icon } from '@rneui/base';
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList
} from '@react-navigation/drawer';
import { useAuth } from '../hooks/useAuth';
import UserProfileIcon from './auth/UserProfileIcon';
import config from '../config';
import { SimpleAlertDialog } from './common/Dialogs/SimplerAlertDialog';
import { logoutContent, logoutTitle } from '../constants/constants';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from './ui/Typography';
import { BLUE_DARK, BLUE_LIGHT } from '../constants/Colors';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ReminderScreen } from './reminder/Reminder';
import { useNavigation } from '@react-navigation/native';
import { QuestionIcon } from './common/Icons/QuestionIcon';
import { ProgressDialog } from './common/Dialogs/ProgessDialog';

const CustomDrawerMenu = (props: any) => {
    const { authData, signOut, setIsRightDrawer, isRightDrawer, companyName } =
        useAuth();
    const [visible, setVisible] = React.useState(false);
    const { navigate } = useNavigation();
    const drawerLabelStyle = {
        fontFamily: TypographyFontFamily.medium,
        color: BLUE_DARK,
        fontSize: RFPercentage(1.8)
    };
    const [logoutLoading, setLogoutLoading] = useState(false);

    const toggleDrawerSide = () => {
        setIsRightDrawer((a) => !a);
    };

    if (isRightDrawer) return <ReminderScreen />;

    if (logoutLoading)
        return <ProgressDialog title="Logging Out" visible={logoutLoading} />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ebebeb' }}>
            <View style={styles.header}>
                <SimpleAlertDialog
                    title={logoutTitle}
                    content={logoutContent}
                    visible={visible}
                    dismissable={true}
                    positiveButtonLabel="Yes"
                    negativeButtonLabel="Close"
                    negativeAction={() => {
                        setVisible(false);
                    }}
                    positiveAction={async () => {
                        setLogoutLoading(true);
                        try {
                            if (authData?.authenticationtoken) {
                                await signOut();
                                setVisible(false);
                            } else {
                                throw Error('Auth token not found');
                            }
                        } catch (e) {
                            ToastAndroid.show(
                                'Error logging out',
                                ToastAndroid.SHORT
                            );
                        }
                        setLogoutLoading(false);
                    }}
                    setVisible={setVisible}
                />

                <UserProfileIcon background="#F6F8FB" />

                <TouchableOpacity onPress={toggleDrawerSide}>
                    <Typography
                        variant={TypographyVariants.heading}
                        style={styles.heading}
                    >
                        {authData?.name}
                    </Typography>
                </TouchableOpacity>

                <Typography variant={TypographyVariants.body1}>
                    {companyName ?? ''}
                </Typography>
            </View>
            <DrawerContentScrollView {...props}>
                <DrawerItemList
                    {...props}
                    activeBackgroundColor="#033d8f26"
                    inactiveTintColor="#043E90"
                    labelStyle={{ fontFamily: TypographyFontFamily.heavy }}
                    activeTintColor="#043E90"
                />
                <DrawerItem
                    icon={({ size }) => (
                        <Icon
                            size={size}
                            type="material"
                            name="logout"
                            color={BLUE_LIGHT}
                        />
                    )}
                    label="Logout"
                    labelStyle={drawerLabelStyle}
                    onPress={() => setVisible(true)}
                    activeBackgroundColor="#033d8f26"
                    inactiveTintColor="#043E90"
                    labelStyle={{ fontFamily: TypographyFontFamily.heavy }}
                    activeTintColor="#043E90"
                />
                <DrawerItem
                    icon={({ size, color }) => (
                        <QuestionIcon color={BLUE_LIGHT} size={size} />
                    )}
                    label="Help"
                    labelStyle={drawerLabelStyle}
                    onPress={() => navigate('HelpSectionScreen')}
                    activeBackgroundColor="#033d8f26"
                    inactiveTintColor="#043E90"
                    labelStyle={{ fontFamily: TypographyFontFamily.heavy }}
                    activeTintColor="#043E90"
                />
            </DrawerContentScrollView>
            <View style={styles.versionWrapper}>
                <Typography variant={TypographyVariants.caption1}>
                    {`v${config.VERSION}`}
                </Typography>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        backgroundColor: '#fff',
        height: RFPercentage(36),
        justifyContent: 'center'
    },
    versionWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 10,
        padding: 10
    },
    heading: {
        margin: RFPercentage(2),
        textTransform: 'capitalize',
        lineHeight: RFPercentage(4.5)
    }
});

export default CustomDrawerMenu;
