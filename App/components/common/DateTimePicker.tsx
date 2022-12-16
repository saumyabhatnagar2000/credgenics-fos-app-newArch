import React, { useState } from 'react';
import { Text, View } from '../Themed';
import { Pressable, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import Colors, {
    BLUE_DARK,
    DARK_GREY,
    GREY,
    RED
} from '../../constants/Colors';
import moment from 'moment';

export default function DateTimeInputBox({
    placeholder,
    type,
    icon,
    setText,
    containerStyle = {},
    textStyle = {},
    label,
    wrapper = { marginHorizontal: '5%' },
    inputTextColor,
    minimumDate,
    selectedDate,
    maximumDate,
    errorMsg,
    showError
}: any) {
    const [date, setDate] = useState(selectedDate ?? new Date());
    const [show, setShow] = useState(false);
    const [dateText, setDateText] = useState(placeholder);
    const isInit = dateText === placeholder && !moment(placeholder).isValid();

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        let value = currentDate;
        if (type == 'date') {
            value = currentDate.toISOString().slice(0, 10);
            setDateText(value);
        } else {
            value = moment(currentDate).format('HH:mm:00');
            setDateText(value);
        }
        setText(value);
    };

    return (
        <Pressable
            onPress={() => {
                setShow((_t) => !_t);
            }}
            style={wrapper}
        >
            <>
                {label ? (
                    <Typography
                        variant={TypographyVariants.body3}
                        style={styles.labelStyle}
                    >
                        {label}
                    </Typography>
                ) : null}
                <View style={[styles.container, containerStyle]}>
                    <Text
                        style={[
                            styles.textStyle,
                            isInit
                                ? { color: GREY }
                                : inputTextColor
                                ? { color: inputTextColor }
                                : { color: DARK_GREY },
                            textStyle
                        ]}
                    >
                        {dateText}
                    </Text>
                    <FontAwesome5 name={icon} size={16} color={BLUE_DARK} />
                </View>
                {showError ? (
                    <Typography
                        variant={TypographyVariants.caption3}
                        style={styles.dateError}
                    >
                        {errorMsg}
                    </Typography>
                ) : null}
                {React.useMemo(() => {
                    return (
                        show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={type}
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                                minimumDate={minimumDate ?? new Date()}
                                minuteInterval={5}
                                maximumDate={maximumDate ?? null}
                            />
                        )
                    );
                }, [show, date, type, minimumDate, maximumDate])}
            </>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.table.grey,
        borderColor: BLUE_DARK,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        minHeight: 50,
        padding: 10
    },
    labelStyle: {
        marginBottom: -4
    },
    textStyle: {
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(2)
    },
    wrapper: {
        marginHorizontal: '5%'
    },
    dateError: {
        color: RED,
        marginBottom: RFPercentage(1),
        marginTop: RFPercentage(-0.8),
        marginLeft: RFPercentage(0.5)
    }
});
