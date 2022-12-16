import React, { useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { EMAIL_REGEX_STRICT } from '../../utils/validators';
import { ApplicantTypes } from '../../../enums';
import { useTaskAction } from '../../hooks/useTaskAction';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Button } from '@rneui/base';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { CheckBox } from '@rneui/base';
import { TextInput } from 'react-native-gesture-handler';
import { updateContactDetails } from '../../services/portfolioService';
const OTP_TYPES = {
    sms: 'SMS',
    email: 'E-mail'
};

export const AddContactNumberComponent = ({
    emailIds,
    mobileNumbers,
    otpType,
    setMobileArray,
    setEmailArray,
    loanDetails,
    loanData
}: any) => {
    const [newContactDetail, setnewContactDetail] = useState('');
    const [saveForLater, setSaveForLater] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState<string | undefined>('');
    const [showAddButton, setShowAddButton] = useState(true);
    const { authData, countryIsdCode } = useAuth();
    const {
        setUpdatedContactDetails,
        updatedContactDetails,
        setOnlineTabChangeIdx
    } = useTaskAction();

    const checkIfAlreadyPresent = (detail: string, type: string) => {
        let flag = false;
        if (type == OTP_TYPES.email) {
            emailIds.filter((email: string) => {
                if (email === detail) {
                    flag = true;
                }
            });
        }
        if (type == OTP_TYPES.sms) {
            mobileNumbers.filter((number: string) => {
                if (number === detail) {
                    flag = true;
                }
            });
        }
        return flag;
    };

    const onError = (text: string | undefined) => {
        setShowError(true);
        setErrorText(text);
        if (text && text.length) setTimeout(() => setShowError(false), 3000);
    };

    const onClickAdd = async () => {
        setOnlineTabChangeIdx(1);
        if (checkIfAlreadyPresent(newContactDetail, otpType)) {
            if (otpType == OTP_TYPES.sms) onError('Number already present');
            if (otpType == OTP_TYPES.email) onError('Email already present');
            return;
        }

        if (
            otpType == OTP_TYPES.sms &&
            countryIsdCode == '+91' &&
            newContactDetail.length != 10
        ) {
            onError('Enter valid phone number');
            return;
        }
        if (
            otpType == OTP_TYPES.email &&
            RegExp(EMAIL_REGEX_STRICT).test(newContactDetail) == false
        ) {
            onError('Enter valid e-mail');
            return;
        }

        if (otpType == OTP_TYPES.sms && !saveForLater)
            setMobileArray([newContactDetail, ...mobileNumbers]);
        else if (otpType == OTP_TYPES.email && !saveForLater)
            setEmailArray([newContactDetail, ...emailIds]);

        if (saveForLater) {
            try {
                let data = {};
                if (loanData?.applicant_type == ApplicantTypes.applicant) {
                    if (otpType == OTP_TYPES.sms) {
                        mobileNumbers.unshift(newContactDetail);
                        data = {
                            applicant_contact_number: mobileNumbers.toString()
                        };
                    } else {
                        emailIds.unshift(newContactDetail);
                        data = {
                            applicant_email: emailIds.toString()
                        };
                    }
                } else if (
                    loanData?.applicant_type == ApplicantTypes.co_applicant
                ) {
                    if (otpType == OTP_TYPES.sms) {
                        mobileNumbers.unshift(newContactDetail);
                        loanDetails.co_applicant[
                            loanData.applicant_index
                        ].co_applicant_contact_number =
                            mobileNumbers.toString();
                    } else {
                        emailIds.unshift(newContactDetail);
                        loanDetails.co_applicant[
                            loanData.applicant_index
                        ].co_applicant_email = emailIds.toString();
                    }
                    data = { co_applicant: loanDetails.co_applicant };
                }
                const apiResponse = await updateContactDetails(
                    loanData.loan_id,
                    data,
                    authData
                );
                if (apiResponse?.data) {
                    setnewContactDetail('');
                    ToastAndroid.show(
                        'Details updated successfully',
                        ToastAndroid.SHORT
                    );
                    setUpdatedContactDetails(!updatedContactDetails);
                }
            } catch (e: any) {
                let message =
                    e?.response?.data?.message ?? 'Some Error Occurred';
                if (
                    e?.response?.data?.data?.error ==
                    'Module access not permitted'
                ) {
                    message = 'Permission denied. Contact your admin';
                }
                ToastAndroid.show(message, ToastAndroid.SHORT);
            }
        }
        setnewContactDetail('');
        setShowAddButton(false);
    };

    return showAddButton ? (
        <View>
            <View style={styles.inputContainer}>
                {otpType == OTP_TYPES.sms ? (
                    <TextInput
                        style={styles.countryCodeContainer}
                        placeholder="+91"
                        placeholderTextColor={'#043E90'}
                        editable={false}
                    />
                ) : null}

                <BottomSheetTextInput
                    style={[
                        styles.contactContainer,
                        {
                            width: otpType == OTP_TYPES.email ? '83%' : '63%'
                        }
                    ]}
                    placeholder={`Enter New ${
                        otpType == OTP_TYPES.email
                            ? 'Email Address'
                            : 'Phone Number'
                    }`}
                    placeholderTextColor={'#043E90'}
                    value={newContactDetail}
                    onChangeText={setnewContactDetail}
                    keyboardType={
                        otpType == OTP_TYPES.sms ? 'numeric' : 'default'
                    }
                />

                <Button
                    buttonStyle={{
                        backgroundColor: '#043E90',
                        borderRadius: 5
                    }}
                    title={'Add'}
                    titleStyle={{
                        fontSize: RFPercentage(1.8),
                        fontFamily: TypographyFontFamily.normal,
                        color: '#fff',
                        textAlign: 'center',
                        paddingHorizontal: RFPercentage(0.6)
                    }}
                    onPress={onClickAdd}
                />
            </View>
            {showError ? (
                <View style={styles.errorContainer}>
                    <Typography
                        variant={TypographyVariants.caption3}
                        style={{ color: 'red' }}
                    >
                        {errorText}
                    </Typography>
                </View>
            ) : null}
            <View>
                <CheckBox
                    left
                    title="Save for Future"
                    checked={saveForLater}
                    onPress={() => setSaveForLater(!saveForLater)}
                    fontFamily={TypographyFontFamily.medium}
                    textStyle={styles.checkboxText}
                    checkedColor="#043E90"
                    containerStyle={styles.checkboxContainer}
                    size={15}
                />
            </View>
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    checkboxContainer: {
        backgroundColor: '#fff',
        borderWidth: 0
    },
    checkboxText: {
        color: '#043E90',
        fontSize: RFPercentage(1.4),
        fontWeight: 'normal'
    },
    contactContainer: {
        backgroundColor: '#C4C4C44D',
        borderRadius: 8,
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.5),
        height: RFPercentage(5),
        marginHorizontal: RFPercentage(2),
        opacity: 0.8,
        paddingHorizontal: RFPercentage(1)
    },
    countryCodeContainer: {
        backgroundColor: '#C4C4C44D',
        borderRadius: 8,
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.5),
        height: RFPercentage(5),
        opacity: 0.8,
        paddingHorizontal: RFPercentage(1),
        textAlign: 'center',
        width: '15%'
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: RFPercentage(0.5)
    },
    inputContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
});
