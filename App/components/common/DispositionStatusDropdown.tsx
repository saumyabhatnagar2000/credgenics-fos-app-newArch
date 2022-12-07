import React, { useEffect, useState } from 'react';
import {
    BackHandler,
    StyleSheet,
    TextInput,
    ToastAndroid,
    View
} from 'react-native';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors, { BLUE_DARK } from '../../constants/Colors';
import { CustomRadioButton } from '../ui/CustomRadioButton';
import DateTimeInputBox from '../common/DateTimePicker';
import {
    DispositionFormErrorType,
    DispositionType,
    DropDownType
} from '../../../types';
import { CustomDropDown } from '../common/DropDown';
import useOfflineVisitData from '../../hooks/useOfflineVisitData';
import OnlineOnly from '../OnlineOnly';
import useCommon from '../../hooks/useCommon';
import { getTommorowDateTime } from '../../services/utils';

const tommorowDate = getTommorowDateTime();

const getDipositionObject = (id: string, list: Array<DispositionType>) => {
    let dummmyObject;
    list.map((status) => {
        if (status.id == id) {
            dummmyObject = status;
        }
    });
    return dummmyObject;
};
import { DispositionServiceType } from '../../../enums';

const tommorrowDate = getTommorowDateTime();

export const DispositionDropdown = ({
    selectedDispositionOne,
    selectedDispositionTwo,
    disposition,
    subDispositionOne,
    subDispositionTwo,
    dispositionDropdown,
    subDispositionOneDropdown,
    subDispositionTwoDropdown,
    reminderRequired,
    amountRequired,
    amount,
    setReminderDate,
    setReminderTime,
    setAmountRequired,
    setReminderRequired,
    setSelectedDisposition,
    setSelectedDispositionOne,
    setSelectedDispositionTwo,
    setSubDispositionOneDropdown,
    setSubDispositionTwoDropdown,
    setDispositonDropdown,
    setDisposition,
    setSubDispostionOne,
    setSubDispostionTwo,
    setAmount,
    checkedStep,
    setCheckedStep,
    setSubDispositionOneReq,
    setSubDispositionTwoReq,
    remarkRequired,
    setRemarkRequired
}: {
    selectedDispositionOne: any;
    selectedDispositionTwo: any;
    disposition: any;
    subDispositionOne: any;
    subDispositionTwo: any;
    dispositionDropdown: any;
    subDispositionOneDropdown: any;
    subDispositionTwoDropdown: any;
    reminderRequired: any;
    amountRequired: any;
    amount: any;
    setAmountRequired: any;
    setReminderRequired: any;
    setReminderDate: any;
    setReminderTime: any;
    setSelectedDisposition: any;
    setSelectedDispositionOne: any;
    setSelectedDispositionTwo: any;
    setDispositonDropdown: any;
    setSubDispositionOneDropdown: any;
    setSubDispositionTwoDropdown: any;
    setDisposition: any;
    setSubDispostionOne: any;
    setSubDispostionTwo: any;
    setAmount: any;
    checkedStep: any;
    setCheckedStep: any;
    setSubDispositionOneReq: any;
    setSubDispositionTwoReq: any;
    remarkRequired: any;
    setRemarkRequired: any;
}) => {
    const { dispositionStatus } = useOfflineVisitData();
    const { continueIfOnline } = useCommon();
    const [dispositionOpen, setDispositionOpen] = useState(false);
    const [subDispositionOneOpen, setSubDispositionOneOpen] = useState(false);
    const [subDispositionTwoOpen, setSubDispositionTwoOpen] = useState(false);

    const RadioButtonArray = ['Visit', 'Call'];
    const [dispositionID, setDispositionID] = useState('');
    const [dispositionList, setDispositionList] = useState<
        Array<DispositionType>
    >([]);
    const [subDispositionOneList, setSubDipositionOneList] = useState<
        Array<DispositionType>
    >([]);
    const [subDispositionTwoList, setSubDipositionTwoList] = useState<
        Array<DispositionType>
    >([]);

    const [errorObject, setErrorsObject] = useState<DispositionFormErrorType>(
        {}
    );

    const handleDispositionChange = async (id: string) => {
        const tempSelected: DispositionType = getDipositionObject(
            id,
            dispositionList
        );

        setSelectedDisposition(tempSelected);
        setDispositionID(id);
        setAmountRequired(tempSelected.committed_amount_required);
        setReminderRequired(tempSelected.reminder_required);
        setSubDispositionOneReq(tempSelected.sub_disposition_required);
        setRemarkRequired(tempSelected.remark_required);
        if (selectedDispositionTwo) setSelectedDispositionTwo({});
        if (selectedDispositionOne) setSelectedDispositionOne({});

        try {
            if (tempSelected) {
                if (tempSelected?.subdispositions?.length > 0) {
                    setSubDipositionOneList(tempSelected.subdispositions);
                    let dummySubDispositon: Array<DropDownType> = [];
                    tempSelected.subdispositions.map(
                        (item: DispositionType) => {
                            dummySubDispositon.push({
                                label: item.text,
                                value: item.id
                            });
                        }
                    );

                    setSubDispositionOneDropdown(dummySubDispositon);
                } else {
                    setSubDispositionOneDropdown([]);
                    setSubDispositionTwoDropdown([]);
                }
            }
        } catch (e) {
            ToastAndroid.show('Error fetching status', ToastAndroid.SHORT);
        }
    };

    const handleSubDispositionOneChange = async (id: string) => {
        setSelectedDispositionOne(
            getDipositionObject(id, subDispositionOneList)
        );
        const tempSelected: DispositionType = getDipositionObject(
            id,
            subDispositionOneList
        );

        if (!amountRequired)
            setAmountRequired(tempSelected.committed_amount_required);
        if (!reminderRequired)
            setReminderRequired(tempSelected.reminder_required);
        if (!remarkRequired) setRemarkRequired(tempSelected.remark_required);

        setSubDispositionTwoReq(tempSelected.sub_disposition_required);
        if (selectedDispositionTwo) setSelectedDispositionTwo({});
        try {
            if (tempSelected) {
                if (tempSelected?.subdispositions?.length > 0) {
                    setSubDipositionTwoList(tempSelected?.subdispositions);
                    let dummyDisposition: Array<DropDownType> = [];
                    tempSelected.subdispositions.map(
                        (item: DispositionType) => {
                            dummyDisposition.push({
                                label: item.text,
                                value: item.id
                            });
                        }
                    );
                    setSubDispositionTwoDropdown(dummyDisposition);
                } else setSubDispositionTwoDropdown([]);
            }
        } catch (e) {
            ToastAndroid.show('Error fetching status', ToastAndroid.SHORT);
        }
    };

    const handleSubdispositionTwoChange = (id: string) => {
        setSelectedDispositionTwo(
            getDipositionObject(id, subDispositionTwoList)
        );
        const tempSelected: DispositionType = getDipositionObject(
            id,
            subDispositionTwoList
        );
        if (!amountRequired)
            setAmountRequired(tempSelected.committed_amount_required);
        if (!reminderRequired)
            setReminderRequired(tempSelected.reminder_required);
        if (!remarkRequired) setRemarkRequired(tempSelected.remark_required);
    };

    useEffect(() => {
        getDispositionStatuses();
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => true
        );
        return () => backHandler.remove();
    }, []);

    const getDispositionStatuses = async () => {
        try {
            if (dispositionStatus) {
                if (dispositionID.length == 0) {
                    setDispositionList(dispositionStatus?.dispositions);
                    let dummyDisposition: Array<DropDownType> = [];
                    dispositionStatus?.dispositions?.map(
                        (item: DispositionType) => {
                            dummyDisposition.push({
                                label: item.text,
                                value: item.id
                            });
                        }
                    );
                    setDispositonDropdown(dummyDisposition);
                }
            }
        } catch (e) {
            ToastAndroid.show('Error fetching status', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={{ flexDirection: 'column' }}>
            <View style={[styles.formRowContainer]}>
                <View style={[styles.inputBox]}>
                    <View style={{ width: RFPercentage(22) }}>
                        <CustomDropDown
                            listMode="SCROLLVIEW"
                            open={dispositionOpen}
                            setOpen={setDispositionOpen}
                            items={dispositionDropdown}
                            setItems={setDispositonDropdown}
                            values={disposition}
                            setValues={setDisposition}
                            onChangeValue={(value: string) => {
                                if (value.length > 0)
                                    handleDispositionChange(value);
                            }}
                            style={styles.backgroundStyle}
                            placeholder="Select a Status"
                            containerStyle={{
                                paddingHorizontal: 0
                            }}
                            dropDownContainerStyle={styles.dropDownContainer}
                            listItemContainerStyle={{
                                paddingVertical: RFPercentage(0.7)
                            }}
                            zIndex={3000}
                            zIndexInverse={1000}
                            onOpen={() => {
                                setSubDispositionOneOpen(false);
                                setSubDispositionTwoOpen(false);
                            }}
                        />
                    </View>
                </View>
            </View>
            {subDispositionOneDropdown.length > 0 ? (
                <View
                    style={[
                        styles.formRowContainer,
                        {
                            marginTop: RFPercentage(1.5)
                        }
                    ]}
                >
                    <View style={[styles.inputBox]}>
                        <View
                            style={{
                                width: RFPercentage(22),
                                marginHorizontal: RFPercentage(5)
                            }}
                        >
                            <CustomDropDown
                                listMode="SCROLLVIEW"
                                open={subDispositionOneOpen}
                                setOpen={setSubDispositionOneOpen}
                                items={subDispositionOneDropdown}
                                setItems={setDispositonDropdown}
                                values={subDispositionOne}
                                setValues={setSubDispostionOne}
                                onChangeValue={(value: string) => {
                                    if (value.length > 0)
                                        handleSubDispositionOneChange(value);
                                }}
                                placeholder="Select a Status"
                                containerStyle={{
                                    paddingHorizontal: 0
                                }}
                                style={styles.backgroundStyle}
                                dropDownContainerStyle={
                                    styles.dropDownContainer
                                }
                                listItemContainerStyle={{
                                    paddingVertical: RFPercentage(0.7)
                                }}
                                onOpen={() => {
                                    setDispositionOpen(false);
                                    setSubDispositionTwoOpen(false);
                                }}
                                zIndex={2000}
                                zIndexInverse={2000}
                            />
                        </View>
                    </View>
                </View>
            ) : null}
            {subDispositionTwoDropdown.length > 0 ? (
                <View
                    style={[
                        styles.formRowContainer,
                        {
                            marginTop: RFPercentage(1.5),
                            marginBottom: RFPercentage(1)
                        }
                    ]}
                >
                    <View style={[styles.inputBox]}>
                        <View
                            style={{
                                width: RFPercentage(22),
                                marginHorizontal: RFPercentage(10)
                            }}
                        >
                            <CustomDropDown
                                listMode="SCROLLVIEW"
                                open={subDispositionTwoOpen}
                                setOpen={setSubDispositionTwoOpen}
                                items={subDispositionTwoDropdown}
                                setItems={setSubDispositionTwoDropdown}
                                values={subDispositionTwo}
                                placeholder="Select a Status"
                                setValues={setSubDispostionTwo}
                                style={styles.backgroundStyle}
                                onChangeValue={(value: string) => {
                                    if (value.length > 0)
                                        handleSubdispositionTwoChange(value);
                                }}
                                dropDownContainerStyle={
                                    styles.dropDownContainer
                                }
                                containerStyle={{
                                    paddingHorizontal: 0
                                }}
                                listItemContainerStyle={{
                                    paddingVertical: RFPercentage(0.7)
                                }}
                                onOpen={() => {
                                    setDispositionOpen(false);
                                    setSubDispositionOneOpen(false);
                                }}
                                zIndex={1000}
                                zIndexInverse={3000}
                            />
                        </View>
                    </View>
                </View>
            ) : null}

            <OnlineOnly>
                <View style={[styles.formRowContainer]}>
                    <View style={styles.formLabelContainer}>
                        <Typography style={styles.formLabel}>
                            {`Reminder Date${reminderRequired ? '*' : ''}`}
                        </Typography>
                    </View>
                    <View
                        style={[
                            styles.inputBox,
                            { marginVertical: RFPercentage(1.5) }
                        ]}
                    >
                        <View>
                            <DateTimeInputBox
                                placeholder={'dd/mm/yy'}
                                type={'date'}
                                setText={setReminderDate}
                                containerStyle={styles.datePickerContainer}
                                wrapper={{ marginHorizontal: 0 }}
                                minimumDate={tommorowDate}
                                selectedDate={tommorowDate}
                            />
                            {errorObject?.reminder_date_required ? (
                                <Typography
                                    style={styles.error}
                                    variant={TypographyVariants.caption2}
                                >
                                    {errorObject?.reminder_date_required}
                                </Typography>
                            ) : null}
                        </View>
                    </View>
                </View>
            </OnlineOnly>
            <OnlineOnly>
                <View style={styles.formRowContainer}>
                    <View style={styles.formLabelContainer}>
                        <Typography style={styles.formLabel}>
                            {`Reminder Time${
                                continueIfOnline(reminderRequired) ? '*' : ''
                            }`}
                        </Typography>
                    </View>
                    <View
                        style={[
                            styles.inputBox,
                            { marginVertical: RFPercentage(1.5) }
                        ]}
                    >
                        <View>
                            <DateTimeInputBox
                                placeholder={'00:00'}
                                type={'time'}
                                setText={setReminderTime}
                                containerStyle={styles.datePickerContainer}
                                wrapper={{ marginHorizontal: 0 }}
                            />
                        </View>
                    </View>
                </View>
            </OnlineOnly>

            <View
                style={[
                    styles.formRowContainer,
                    { marginTop: RFPercentage(0.8) }
                ]}
            >
                <View style={styles.formLabelContainer}>
                    <Typography style={styles.formLabel}>
                        {`Committed Amount${amountRequired ? '*' : ''}`}
                    </Typography>
                </View>
                <View style={[styles.inputBox, { marginTop: RFPercentage(1) }]}>
                    <View>
                        <TextInput
                            textAlign="left"
                            keyboardType="numeric"
                            style={[
                                styles.inputContainer,
                                { marginVertical: 0 }
                            ]}
                            value={amount}
                            onChangeText={setAmount}
                        />
                        {errorObject?.amount_required ? (
                            <Typography
                                style={styles.error}
                                variant={TypographyVariants.caption2}
                            >
                                {errorObject?.amount_required}
                            </Typography>
                        ) : null}
                    </View>
                </View>
            </View>
            <OnlineOnly>
                <CustomRadioButton
                    buttons={RadioButtonArray}
                    checked={checkedStep}
                    setChecked={setCheckedStep}
                    containerStyle={{
                        marginVertical: RFPercentage(2),
                        paddingRight: RFPercentage(7)
                    }}
                    label="Next Step:"
                />
            </OnlineOnly>
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: '#F6F8FB',
        borderColor: '#043E90',
        minHeight: RFPercentage(5)
    },
    commentBox: {
        backgroundColor: Colors.table.grey,
        borderColor: Colors.common.blue,
        borderRadius: 8,
        borderWidth: 1,
        fontFamily: TypographyFontFamily.medium,
        margin: 0,
        marginVertical: RFPercentage(1.5),
        minWidth: RFPercentage(20),
        paddingHorizontal: RFPercentage(4)
    },
    container: {
        paddingHorizontal: RFPercentage(0.5),
        paddingVertical: RFPercentage(2)
    },
    datePickerContainer: {
        marginVertical: 0,
        minHeight: RFPercentage(5),
        paddingHorizontal: RFPercentage(3),
        padding: 0
    },
    doneButton: {
        alignSelf: 'center',
        backgroundColor: BLUE_DARK,
        borderRadius: 4,
        marginVertical: RFPercentage(2),
        width: RFPercentage(20)
    },
    dropDownContainer: {
        borderColor: '#043E90',
        marginHorizontal: 0
    },
    error: {
        color: 'red',
        marginTop: RFPercentage(0.2)
    },
    formLabel: {
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(2)
    },
    formLabelContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start'
    },
    formRowContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: RFPercentage(3)
    },
    inputBox: {
        flexDirection: 'row',
        flex: 1
    },
    inputContainer: {
        backgroundColor: Colors.table.grey,
        borderColor: Colors.common.blue,
        borderRadius: 8,
        borderWidth: 1,
        fontFamily: TypographyFontFamily.medium,
        height: 40,
        margin: 0,
        marginVertical: RFPercentage(1.5),
        minWidth: RFPercentage(19),
        paddingHorizontal: RFPercentage(1)
    },
    loader: {
        backgroundColor: '#F6F8FB',
        flex: 1,
        justifyContent: 'center'
    }
});
