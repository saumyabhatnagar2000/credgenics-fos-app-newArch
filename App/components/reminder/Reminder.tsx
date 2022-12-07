import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ToDoIcon } from '../common/Icons/ToDo';
import Typography, { TypographyVariants } from '../ui/Typography';
import { Switch } from 'react-native-paper';
import { PendingList } from './PendingList';
import { ToDoList } from './ToDoList';
import Colors, { BLUE_DARK, GREY } from '../../constants/Colors';
import { Reminder, ReminderListType } from '../../../enums';
import { StatusBar } from 'react-native';
import { Tab } from '../ui/Tab';
import { NewMonthPicker } from '../common/MonthPicker/NewMonthPicker';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ChevronDown } from '../common/Icons/ChevronDown';
import { useAuth } from '../../hooks/useAuth';
import { CallingList } from './CallingList';

export const ReminderScreen = () => {
    const [showPendingTasks, setShowPendingTasks] = useState(true);
    const [tabs, setTabs] = useState([
        {
            label: 'Visits',
            active: true
        },
        {
            label: 'Call',
            active: false
        }
    ]);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [currentDate, setCurrentDate] = useState(moment());
    const [reminderType, setReminderType] = useState(Reminder.ptp);
    const { authData } = useAuth();

    const hideMonthPicker = () => {
        setShowMonthPicker(false);
    };

    const handleTabChange = (label: string) => {
        let tabDummy = tabs;
        tabDummy.map((tab) => {
            tab.active = false;
            if (tab.label === label) {
                setReminderType(tab.label.toLowerCase());
                tab.active = true;
            }
        });
        setTabs([...tabDummy]);
    };

    return (
        <>
            <NewMonthPicker
                visible={showMonthPicker}
                hideMonthPicker={hideMonthPicker}
                selectedDate={currentDate}
                setSelectedDate={setCurrentDate}
                minDate={moment()}
                maxDate={moment([2100])}
                header="Month"
            />
            <View style={styles.container}>
                <View
                    style={{
                        marginVertical: RFPercentage(0.7),
                        marginHorizontal: RFPercentage(1.1)
                    }}
                >
                    <View style={styles.headerContainer}>
                        <View style={styles.row}>
                            <ToDoIcon />
                            <Typography
                                variant={TypographyVariants.heading3}
                                style={{ marginLeft: RFPercentage(0.6) }}
                            >
                                To-Do List
                            </Typography>
                        </View>
                        <View style={styles.row}>
                            <Typography
                                variant={TypographyVariants.caption1}
                                style={{ color: GREY }}
                            >
                                Missed Tasks
                            </Typography>
                            <Switch
                                value={showPendingTasks}
                                onValueChange={() =>
                                    setShowPendingTasks(!showPendingTasks)
                                }
                                color={BLUE_DARK}
                                style={styles.switchStyle}
                            />
                        </View>
                    </View>
                    <View style={styles.subHeaderContainer}>
                        <Tab
                            tabs={tabs}
                            handleTabChange={handleTabChange}
                            containerStyle={styles.tabContainer}
                            tabStyle={{
                                height: RFPercentage(3.5)
                            }}
                            tabLabelStyle={TypographyVariants.caption3}
                        />
                        {!showPendingTasks && (
                            <TouchableOpacity
                                onPress={() => {
                                    setShowMonthPicker(!showMonthPicker);
                                }}
                                style={styles.calendarContainer}
                            >
                                <Typography
                                    variant={TypographyVariants.body2}
                                    style={{ marginRight: RFPercentage(0.7) }}
                                >
                                    {moment(currentDate, 'YYYY-M-DD').format(
                                        'MMMM'
                                    )}
                                </Typography>
                                <ChevronDown />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                {showPendingTasks ? (
                    reminderType == Reminder.ptp ? (
                        <PendingList
                            ListType={reminderType}
                            type={ReminderListType.pending}
                        />
                    ) : (
                        <CallingList
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            ListType={reminderType}
                            type={ReminderListType.pending}
                        />
                    )
                ) : reminderType == Reminder.ptp ? (
                    <ToDoList
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        ListType={reminderType}
                        type={ReminderListType.to_do}
                    />
                ) : (
                    <CallingList
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        ListType={reminderType}
                        type={ReminderListType.to_do}
                    />
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    calendarContainer: {
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        borderRadius: 4,
        flexDirection: 'row',
        paddingHorizontal: RFPercentage(1.5),
        paddingVertical: RFPercentage(0.1)
    },
    container: {
        backgroundColor: Colors.table.grey,
        flex: 1,
        paddingTop: StatusBar.currentHeight
    },
    headerContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    subHeaderContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: RFPercentage(1),
        paddingTop: RFPercentage(2)
    },
    switchStyle: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
    },
    tabContainer: {
        borderBottomWidth: 1,
        borderWidth: 0,
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
        paddingVertical: RFPercentage(0)
    }
});
