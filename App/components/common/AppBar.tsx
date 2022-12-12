import * as React from 'react';
import { Appbar, Divider, Menu } from 'react-native-paper';
import {
    Image,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AppBarType } from '../../../types';

import { useAuth } from '../../hooks/useAuth';
import ClockInOutStatus from '../auth/ClockInOutStatus';
import { RFPercentage } from 'react-native-responsive-fontsize';
import ImageView from 'react-native-image-viewing';
import { TalkingPointIcon } from './Icons/TalkingPoint';
import { TalkingPointsContainer } from './Dialogs/TalkingPointsContainer';
import { BLUE, BLUE_DARK, LINEAR_GRADIENT_2 } from '../../constants/Colors';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import MenuIcon from '../../assets/MenuIcon';
import { ChevronLeft } from './Icons/ChevronLeft';
import TitleAvatar from '../TitleAvatar';
import moment from 'moment';
import { NewMonthPicker } from './MonthPicker/NewMonthPicker';
import { ToDoIconWithText } from './Icons/ToDoWithText';
import { CalendarIcon } from './Icons/CalendarIcon';
import { CompanyType } from '../../../enums';
import { ChevronDown } from './Icons/ChevronDown';
import { getAllocationMonthText } from '../../services/utils';
import { Overall } from '../../constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import useCommon from '../../hooks/useCommon';
import OnlineOnly from '../OnlineOnly';

export default function CustomAppBar(config: AppBarType) {
    const navigation = useNavigation();
    const {
        allocationMonth,
        setAllocationMonth,
        setIsRightDrawer,
        companyType
    } = useAuth();
    const menuAnchor = React.createRef<any>();
    const [visible, setVisible] = React.useState(false);
    const { isInternetAvailable } = useCommon();
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const [showMonthPicker, setShowMonthPicker] = React.useState(false);
    const [isImageVisible, setIsImageVisible] = React.useState(false);
    const [calendarMenuVisible, setCalendarMenuVisible] = React.useState(false);
    const openSearch = React.useCallback(() => {
        navigation.navigate('Search', { title: config.title });
    }, []);
    const [showTalking, setshowTalking] = React.useState(false);
    const toggleOverlay = () => setshowTalking(!showTalking);

    const openDepositAdd = React.useCallback(() => {
        navigation.navigate('DepositSelections');
    }, []);

    const openDrawer = React.useCallback(() => {
        navigation.dispatch(DrawerActions.openDrawer());
    }, []);

    const handleOpenDrawer = (isRight: boolean) => {
        setIsRightDrawer(isRight);
        openDrawer();
    };

    const openLeftDrawer = () => {
        if (isInternetAvailable) handleOpenDrawer(false);
    };
    const openRightDrawer = () => handleOpenDrawer(true);

    var talkingPoints = config.talkingPoints;

    const onHeaderImageClicked = () => {
        if (companyType == CompanyType.credit_line) return;
        navigation.navigate('CustomerProfileScreen', {
            loan_id: config.subtitle?.split(':')[1]?.trim(),
            headerImageUrl: config.headerImage
        });
    };

    const getHeaderImage = () => {
        return config.headerImage === 'default' ? (
            <TitleAvatar
                title={config.title}
                size={40}
                style={{
                    backgroundColor: '#fff',
                    borderColor: '#043E90',
                    marginBottom: 2
                }}
                textStyle={{
                    color: '#043E90',
                    fontSize: 16
                }}
            />
        ) : config.headerImage && config.headerImage.length > 1 ? (
            <Image
                source={{ uri: config.headerImage }}
                style={styles.headerImageStyles}
            />
        ) : config.headerImage === 'default' ? (
            <TitleAvatar
                title={config.title}
                size={40}
                style={{
                    backgroundColor: '#fff',
                    borderColor: '#043E90',
                    marginBottom: 2
                }}
                textStyle={{
                    color: '#043E90',
                    fontSize: 16
                }}
            />
        ) : null;
    };
    const hideImageView = () => setIsImageVisible(false);
    const hideMonthPicker = () => setShowMonthPicker(false);
    const inverted = !!config.inverted;

    return (
        <>
            <View>
                <View
                    style={{
                        height: StatusBar.currentHeight,
                        backgroundColor: '#1373cb'
                    }}
                >
                    <StatusBar
                        translucent
                        backgroundColor={'#1373cb'}
                        barStyle={'light-content'}
                    />
                </View>
                <NewMonthPicker
                    visible={showMonthPicker}
                    hideMonthPicker={hideMonthPicker}
                    selectedDate={allocationMonth}
                    setSelectedDate={setAllocationMonth}
                    maxDate={moment()}
                    header="Allocation Month"
                />
                <LinearGradient
                    colors={LINEAR_GRADIENT_2}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Appbar.Header
                        style={[
                            styles.top,
                            {
                                backgroundColor: inverted
                                    ? '#fff'
                                    : 'transparent',
                                elevation: 0,
                                shadowOffset: {
                                    width: 0,
                                    height: 0 // for iOS
                                }
                            }
                        ]}
                    >
                        {config.backButton && (
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={
                                    config?.onBackClicked ?? navigation.goBack
                                }
                            >
                                <ChevronLeft
                                    color={inverted ? BLUE_DARK : undefined}
                                    size={18}
                                />
                            </TouchableOpacity>
                        )}
                        {config.menuButton && (
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={openLeftDrawer}
                            >
                                <MenuIcon />
                            </TouchableOpacity>
                        )}
                        <OnlineOnly>
                            <TouchableOpacity onPress={onHeaderImageClicked}>
                                {getHeaderImage()}
                            </TouchableOpacity>
                        </OnlineOnly>

                        <Appbar.Content
                            style={{ paddingHorizontal: 0 }}
                            titleStyle={styles.title}
                            subtitleStyle={styles.subTitle}
                            title={config.title}
                            subtitle={config.subtitle}
                        />
                        {config.clockInStatus && <ClockInOutStatus />}
                        {config.search && (
                            <Appbar.Action
                                icon="magnify"
                                onPress={openSearch}
                            />
                        )}
                        {config.notifications && (
                            <Appbar.Action icon="bell-outline" />
                        )}
                        {config.filter && (
                            <Appbar.Action icon="filter-outline" />
                        )}
                        {config.add && (
                            <Appbar.Action
                                icon="plus-circle-outline"
                                onPress={openDepositAdd}
                            />
                        )}
                        {config.reminders && (
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={openRightDrawer}
                            >
                                <ToDoIconWithText />
                            </TouchableOpacity>
                        )}
                        {config.calendar && (
                            <>
                                <TouchableOpacity
                                    style={styles.monthPickerContainer}
                                    onPress={() => {
                                        setShowMonthPicker(!showMonthPicker);
                                    }}
                                >
                                    <View style={styles.monthPickerView}>
                                        <Typography
                                            style={styles.monthText}
                                            variant={TypographyVariants.title1}
                                        >
                                            {getAllocationMonthText(
                                                allocationMonth
                                            )}
                                        </Typography>
                                        <ChevronDown color="#fff" />
                                    </View>
                                </TouchableOpacity>
                                {/* <Menu
                                    visible={calendarMenuVisible}
                                    onDismiss={() =>
                                        setCalendarMenuVisible(false)
                                    }
                                    contentStyle={{
                                        backgroundColor: '#F6F8FB'
                                    }}
                                    anchor={
                                        <TouchableOpacity
                                            style={styles.monthPickerContainer}
                                            onPress={() => {
                                                setCalendarMenuVisible(
                                                    !calendarMenuVisible
                                                );
                                            }}
                                        >
                                            <View
                                                style={styles.monthPickerView}
                                            >
                                                <Typography
                                                    style={styles.monthText}
                                                    variant={
                                                        TypographyVariants.title1
                                                    }
                                                >
                                                    {getAllocationMonthText(
                                                        allocationMonth
                                                    )}
                                                </Typography>
                                                <ChevronDown color="#fff" />
                                            </View>
                                        </TouchableOpacity>
                                    }
                                >
                                    <Menu.Item
                                        onPress={() => {
                                            setCalendarMenuVisible(false);
                                            setAllocationMonth(Overall);
                                        }}
                                        titleStyle={styles.menuTitle}
                                        title={Overall}
                                    />
                                    <Divider />
                                    <Menu.Item
                                        onPress={() => {
                                            setCalendarMenuVisible(false);
                                            setShowMonthPicker(
                                                !showMonthPicker
                                            );
                                        }}
                                        titleStyle={styles.menuTitle}
                                        title={'Select Month'}
                                        icon={() => (
                                            <CalendarIcon color={'#043E90'} />
                                        )}
                                    />
                                </Menu> */}
                            </>
                        )}
                        {config?.rightActionComponent}
                        {config.options && (
                            <Menu
                                visible={visible}
                                onDismiss={closeMenu}
                                anchor={
                                    <Appbar.Action
                                        ref={menuAnchor}
                                        icon="dots-vertical"
                                        onPress={openMenu}
                                    />
                                }
                            >
                                <Menu.Item
                                    onPress={() => {
                                        setVisible(false);
                                        setShowMonthPicker(!showMonthPicker);
                                    }}
                                    title={moment(
                                        allocationMonth,
                                        'YYYY-M-DD'
                                    ).format('MM, YYYY')}
                                    icon="calendar"
                                />
                                <Divider />
                                <Menu.Item
                                    onPress={() => {}}
                                    title="Sort"
                                    icon="sort"
                                />
                                <Menu.Item
                                    onPress={() => {}}
                                    title="Filter"
                                    icon="filter"
                                />
                            </Menu>
                        )}

                        {!!(Number(config.talkingPoints?.length) > 0) && (
                            <TouchableOpacity
                                onPress={toggleOverlay}
                                style={styles.talkingpointicon}
                            >
                                <TalkingPointIcon size={15} />
                            </TouchableOpacity>
                        )}
                    </Appbar.Header>
                </LinearGradient>
            </View>
            <TalkingPointsContainer
                isVisible={showTalking}
                setisVisible={setshowTalking}
                content={talkingPoints}
            />
            {!!config.headerImage && (
                <ImageView
                    images={[{ uri: config.headerImage }]}
                    imageIndex={0}
                    visible={isImageVisible}
                    onRequestClose={hideImageView}
                    swipeToCloseEnabled={false}
                    backgroundColor="white"
                    presentationStyle="overFullScreen"
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#3E7BFA',
        width: 100
    },
    buttonTitleStyle: {
        color: 'white',
        paddingHorizontal: 5
    },
    headerImageStyles: {
        backgroundColor: '#ccc',
        borderRadius: 10,
        height: RFPercentage(5),
        marginHorizontal: 0,
        paddingHorizontal: 0,
        resizeMode: 'cover',
        width: RFPercentage(5)
    },
    menuButton: {
        marginHorizontal: RFPercentage(1)
    },
    menuTitle: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2)
    },
    monthPickerContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginVertical: RFPercentage(1)
    },
    monthPickerView: {
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 10
    },
    monthText: {
        color: '#fff',
        marginRight: 5
    },
    rbSheetContainer: {
        alignItems: 'flex-start',
        backgroundColor: 'white',
        borderColor: '#fafafa',
        borderRadius: 10,
        borderWidth: 1,
        elevation: 10,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 45,
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 10,
        width: '100%'
    },
    subTitle: {
        color: '#ccc',
        fontFamily: TypographyFontFamily.normal,
        fontSize: RFPercentage(1.6)
    },
    talkingpointicon: {
        borderColor: 'white',
        borderRadius: 25,
        borderWidth: 1,
        marginRight: 5,
        padding: 7
    },
    textStyle: {
        fontSize: 16,
        margin: 10
    },
    title: {
        color: 'white',
        fontFamily: TypographyFontFamily.heavy,
        fontSize: RFPercentage(2.2),
        textTransform: 'uppercase'
    },
    top: {
        height: RFPercentage(6)
    }
});
