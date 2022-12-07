import momentDefault from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Button from './Button';
import Day from './Day';
import Header from './Header';
import { SideChevron } from '../common/Icons/SideChevron';
import { Portal } from 'react-native-paper';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { LinearGradientHOC } from '../ui/LinearGradientHOC';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

const DateRangePicker = ({
    moment,
    startDate,
    endDate,
    onChange,
    displayedDate,
    minDate,
    date,
    maxDate,
    range,
    dayHeaderTextStyle,
    dayHeaderStyle,
    backdropStyle,
    containerStyle,
    selectedStyle,
    selectedTextStyle,
    disabledStyle,
    dayStyle,
    dayTextStyle,
    disabledTextStyle,
    headerTextStyle,
    monthButtonsStyle,
    headerStyle,
    monthPrevButton,
    monthNextButton,
    buttonContainerStyle,
    buttonStyle,
    buttonTextStyle,
    presetButtons,
    isOpen,
    setIsOpen,
    open,
    setDate,
    setStartDate,
    setEndDate
}: any) => {
    const [weeks, setWeeks] = useState([]);
    const [selecting, setSelecting] = useState(false);
    const [dayHeaders, setDayHeaders] = useState([]);
    const _moment = moment || momentDefault;
    const mergedStyles = {
        backdrop: {
            ...styles.backdrop,
            ...backdropStyle
        },
        container: {
            ...styles.container,
            ...containerStyle
        },
        header: {
            ...styles.header,
            ...headerStyle
        },
        headerText: {
            ...styles.headerText,
            ...headerTextStyle
        },
        monthButtons: {
            ...styles.monthButtons,
            ...monthButtonsStyle
        },
        buttonContainer: {
            ...styles.buttonContainer,
            ...buttonContainerStyle
        }
    };

    const onOpen = () => {
        setIsOpen(true);
    };

    const onClickCancel = () => {
        setStartDate(date.first_date);
        setEndDate(date.last_date);
        setIsOpen(false);
        setSelecting(false);
    };

    const onClickDone = () => {
        setDate({ first_date: startDate, last_date: endDate });
        setIsOpen(false);
        setSelecting(false);
        if (!endDate) {
            onChange({
                endDate: startDate
            });
        }
    };

    const previousMonth = () => {
        onChange({
            displayedDate: _moment(displayedDate).subtract(1, 'months'),
            startDate: startDate ? _moment(startDate) : undefined,
            endDate: endDate ? _moment(endDate) : undefined
        });
    };

    const nextMonth = () => {
        if (_moment(displayedDate).format('MMM') === _moment().format('MMM'))
            return;
        onChange({
            displayedDate: _moment(displayedDate).add(1, 'months'),
            startDate: startDate ? _moment(startDate) : undefined,
            endDate: endDate ? _moment(endDate) : undefined
        });
    };

    const selected = useCallback(
        (_date, _startDate, _endDate, __date) => {
            return (
                (_startDate &&
                    _endDate &&
                    _date.isBetween(
                        _startDate,
                        _moment(_endDate),
                        null,
                        '[]'
                    )) ||
                (_startDate && _date.isSame(_startDate, 'day')) ||
                (_endDate && _date.isSame(_endDate, 'day'))
            );
        },
        [_moment]
    );

    const disabled = useCallback((_date, _minDate, _maxDate) => {
        return (
            (_minDate && _date.isBefore(_minDate, 'day')) ||
            (_maxDate && _date.isAfter(_maxDate, 'day'))
        );
    }, []);

    const today = () => {
        if (range) {
            setSelecting(true);
            onChange({
                date: null,
                startDate: _moment(),
                endDate: null,
                selecting: true,
                displayedDate: _moment()
            });
        } else {
            setSelecting(false);
            onChange({
                date: _moment(),
                startDate: null,
                endDate: null,
                displayedDate: _moment()
            });
        }
    };

    const thisWeek = () => {
        setSelecting(false);
        onChange({
            date: null,
            startDate: _moment().startOf('week'),
            endDate: _moment().endOf('week'),
            displayedDate: _moment()
        });
    };

    const thisMonth = () => {
        setSelecting(false);
        onChange({
            date: null,
            startDate: _moment().startOf('month'),
            endDate: _moment().endOf('month'),
            displayedDate: _moment()
        });
    };

    const select = useCallback(
        (day) => {
            let _date = _moment(displayedDate);
            _date.set('date', day);
            if (range) {
                if (selecting) {
                    if (_date.isBefore(startDate, 'day')) {
                        setSelecting(true);
                        onChange({ startDate: _date });
                    } else {
                        setSelecting(!selecting);
                        onChange({ endDate: _date });
                    }
                } else {
                    setSelecting(!selecting);
                    onChange({
                        date: null,
                        endDate: null,
                        startDate: _date
                    });
                }
            } else {
                onChange({
                    date: _date,
                    startDate: null,
                    endDate: null
                });
            }
        },
        [_moment, displayedDate, onChange, range, selecting, startDate]
    );

    useEffect(() => {
        if (typeof open === 'boolean') {
            if (open && !isOpen) onOpen();
        }
    }, [open]);

    useEffect(() => {
        function populateHeaders() {
            let _dayHeaders = [];
            for (let i = 0; i <= 6; ++i) {
                let day = _moment(displayedDate).weekday(i).format('ddd');
                _dayHeaders.push(
                    <Header
                        key={`dayHeader-${i}`}
                        day={day}
                        index={i}
                        dayHeaderTextStyle={{
                            fontFamily: TypographyFontFamily.heavy,
                            color: '#043E90',
                            fontSize: RFPercentage(1.75)
                        }}
                        dayHeaderStyle={dayHeaderStyle}
                    />
                );
            }
            return _dayHeaders;
        }

        function populateWeeks() {
            let _weeks = [];
            let week: any = [];
            let daysInMonth = displayedDate.daysInMonth();
            let startOfMonth = _moment(displayedDate).set('date', 1);
            let offset = startOfMonth.weekday();
            week = week.concat(
                Array.from({ length: offset }, (x, i) => (
                    <Day empty key={'empty-' + i} />
                ))
            );
            for (let i = 1; i <= daysInMonth; ++i) {
                let _date = _moment(displayedDate).set('date', i);
                let _selected = selected(_date, startDate, endDate, date);
                let _displayedSelected =
                    _moment(displayedDate).isSame(_moment(), 'month') &&
                    _moment(_moment(displayedDate).format('YYYY-MM-DD')).isSame(
                        _moment(_date).format('YYYY-MM-DD')
                    );

                let _disabled = disabled(_date, minDate, maxDate);
                week.push(
                    <Day
                        key={`day-${i}`}
                        selectedStyle={selectedStyle}
                        selectedTextStyle={selectedTextStyle}
                        disabledStyle={disabledStyle}
                        dayStyle={dayStyle}
                        dayTextStyle={{
                            fontFamily: TypographyFontFamily.normal
                        }}
                        disabledTextStyle={disabledTextStyle}
                        index={i}
                        selected={_selected}
                        disabled={_disabled}
                        select={select}
                        displayedSelected={_displayedSelected}
                    />
                );
                if ((i + offset) % 7 === 0 || i === daysInMonth) {
                    if (week.length < 7) {
                        week = week.concat(
                            Array.from(
                                { length: 7 - week.length },
                                (x, index) => (
                                    <Day empty key={'empty-' + index} />
                                )
                            )
                        );
                    }
                    _weeks.push(
                        <View key={'weeks-' + i} style={styles.week}>
                            {week}
                        </View>
                    );
                    week = [];
                }
            }
            return _weeks;
        }
        function populate() {
            let _dayHeaders = populateHeaders();
            let _weeks = populateWeeks();
            setDayHeaders(_dayHeaders);
            setWeeks(_weeks);
        }
        populate();
    }, [
        startDate,
        endDate,
        date,
        _moment,
        displayedDate,
        dayHeaderTextStyle,
        dayHeaderStyle,
        selected,
        disabled,
        minDate,
        maxDate,
        selectedStyle,
        selectedTextStyle,
        disabledStyle,
        dayStyle,
        dayTextStyle,
        disabledTextStyle,
        select
    ]);

    return isOpen ? (
        <Portal>
            <View style={mergedStyles.backdrop}>
                <TouchableWithoutFeedback style={styles.closeTrigger}>
                    <View style={styles.closeContainer} />
                </TouchableWithoutFeedback>
                <View>
                    <View style={mergedStyles.container}>
                        <LinearGradientHOC>
                            <View style={styles.header}>
                                <TouchableOpacity
                                    style={styles.chevronContainer}
                                    onPress={previousMonth}
                                >
                                    {monthPrevButton || (
                                        <SideChevron
                                            height={8}
                                            width={14}
                                            color="#fff"
                                            rotate={90}
                                        />
                                    )}
                                </TouchableOpacity>
                                <Typography
                                    variant={TypographyVariants.body1}
                                    style={{ color: '#fff' }}
                                >
                                    {displayedDate?.format('MMMM') +
                                        displayedDate?.format('YYYY')}
                                </Typography>

                                <TouchableOpacity
                                    style={styles.chevronContainer}
                                    onPress={nextMonth}
                                >
                                    {monthNextButton || (
                                        <SideChevron
                                            height={8}
                                            width={14}
                                            color="#fff"
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </LinearGradientHOC>
                        <View style={styles.calendar}>
                            {dayHeaders && (
                                <View style={styles.dayHeaderContainer}>
                                    {dayHeaders}
                                </View>
                            )}
                            {weeks}
                        </View>
                        <View style={styles.doneButtonContainer}>
                            <TouchableOpacity
                                onPress={onClickCancel}
                                style={[
                                    styles.button,
                                    { paddingVertical: RFPercentage(0.6) }
                                ]}
                            >
                                <Typography
                                    style={{ textAlign: 'center' }}
                                    variant={TypographyVariants.caption}
                                >
                                    Cancel
                                </Typography>
                            </TouchableOpacity>
                            <LinearGradientHOC
                                style={[styles.button, { borderWidth: 0 }]}
                            >
                                <TouchableOpacity onPress={onClickDone}>
                                    <Typography
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center'
                                        }}
                                        variant={TypographyVariants.caption}
                                    >
                                        Done
                                    </Typography>
                                </TouchableOpacity>
                            </LinearGradientHOC>
                        </View>

                        {presetButtons && (
                            <View style={mergedStyles.buttonContainer}>
                                <Button
                                    buttonStyle={buttonStyle}
                                    buttonTextStyle={buttonTextStyle}
                                    onPress={today}
                                >
                                    Today
                                </Button>
                                {range && (
                                    <>
                                        <Button
                                            buttonStyle={buttonStyle}
                                            buttonTextStyle={buttonTextStyle}
                                            onPress={thisWeek}
                                        >
                                            This Week
                                        </Button>
                                        <Button
                                            buttonStyle={buttonStyle}
                                            buttonTextStyle={buttonTextStyle}
                                            onPress={thisMonth}
                                        >
                                            This Month
                                        </Button>
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Portal>
    ) : (
        <></>
    );
};

export default DateRangePicker;

DateRangePicker.defaultProps = {
    dayHeaders: true,
    range: false,
    buttons: false,
    presetButtons: false
};

const styles = StyleSheet.create({
    backdrop: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        height: height,
        justifyContent: 'center',
        position: 'absolute',
        width: width,
        zIndex: 2147483647
    },
    button: {
        borderColor: '#043E90',
        borderRadius: 5,
        borderWidth: 1,
        marginRight: RFPercentage(1),
        paddingVertical: RFPercentage(0.75),
        width: RFPercentage(10)
    },
    buttonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10
    },
    calendar: {
        paddingBottom: 20,
        paddingTop: 20,
        padding: 10,
        width: '100%'
    },
    chevronContainer: {
        alignItems: 'center',
        height: 25,
        justifyContent: 'center',
        width: 40
    },
    closeContainer: {
        height: '100%',
        position: 'absolute',
        width: '100%'
    },
    closeTrigger: {
        height: height,
        width: width
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: width * 0.85
    },
    dayHeaderContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        paddingBottom: 10
    },
    doneButtonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: RFPercentage(1.5)
    },
    header: {
        alignItems: 'center',
        borderBottomColor: '#efefef',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 15,
        paddingHorizontal: 10,
        paddingTop: 20
    },
    headerText: {
        color: 'black',
        fontSize: 16
    },
    monthButtons: {
        color: 'black',
        fontSize: 16
    },
    week: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    }
});
