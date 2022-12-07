import React, { useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthData } from '../../../types';
import { useAuth } from '../../hooks/useAuth';
import UserProfileIcon from '../auth/UserProfileIcon';
import Typography, { TypographyVariants } from '../ui/Typography';
import Colors from '../../constants/Colors';
import { PhoneIcon } from '../common/Icons/PhoneIcon';
import { EmailIcon } from '../common/Icons/EmailIcon';
import { AddressIcon } from '../common/Icons/AddressIcon';
import { ProfessionIcon } from '../common/Icons/ProfessionIcon';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { CustomActivityIndicator } from '../placeholders/CustomActivityIndicator';
import { getUserDetails } from '../../services/authService';
import { useMixpanel } from '../../contexts/MixpanelContext';

export default function UserProfile() {
    const { authData, verification } = useAuth();
    const { identify } = useMixpanel();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        callUserDetails();
    }, []);

    const callUserDetails = async () => {
        if (!authData?.authenticationtoken) return;
        setLoading(true);
        try {
            const response = await getUserDetails(
                authData?.authenticationtoken
            );

            if (response) {
                const outputData = response?.data?.data?.user_details;
                let userData: AuthData = {
                    authenticationtoken: authData?.authenticationtoken,
                    userId: outputData?.user_id,
                    company_id: outputData.assigned_companies,
                    name: outputData?.name,
                    role: outputData?.role,
                    mobile: outputData?.mobile ?? '',
                    agent_id: authData?.agent_id
                };

                if (outputData?.user_id) identify(outputData);

                await verification(userData);
            }
        } catch (e) {
            ToastAndroid.show('Some Error Ocurred', ToastAndroid.LONG);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderStyle}>
                <CustomActivityIndicator />
            </View>
        );
    }

    let profileObj: any = {
        'Phone No.': authData?.mobile,
        'Email Id': authData?.agent_id
    };

    let icons = [PhoneIcon, EmailIcon, ProfessionIcon, AddressIcon];

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}
        >
            <UserProfileIcon background="#fff" />
            <Typography
                style={{ textTransform: 'capitalize' }}
                variant={TypographyVariants.heading2}
            >
                {authData?.name}
            </Typography>

            <View style={styles.table}>
                {Object.keys(profileObj)?.map((profile, index) => (
                    <View
                        style={[
                            styles.row,
                            {
                                backgroundColor:
                                    index % 2 === 0
                                        ? Colors.table.white
                                        : Colors.table.grey
                            }
                        ]}
                        key={index}
                    >
                        <View style={styles.keyWrapper}>
                            {React.createElement(icons[index], {})}
                            <Typography
                                variant={TypographyVariants.caption}
                                style={styles.keyText}
                            >
                                {profile}
                            </Typography>
                        </View>
                        <Typography
                            variant={TypographyVariants.caption}
                            style={styles.valueText}
                        >
                            {profileObj[profile] || '.....'}
                        </Typography>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#F6F8FB',
        flexDirection: 'column',
        flexGrow: 1,
        paddingVertical: 30
    },
    keyText: {
        marginLeft: RFPercentage(1.4)
    },
    keyWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 4
    },
    loaderStyle: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center'
    },
    row: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: RFPercentage(5),
        paddingVertical: RFPercentage(2)
    },
    table: {
        paddingTop: 40,
        width: '100%'
    },
    valueText: {
        flex: 5
    }
});
