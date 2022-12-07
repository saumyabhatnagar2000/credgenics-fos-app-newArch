import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TabType } from '../../../types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Typography, { TypographyVariants } from './Typography';
import Colors, { GREY_3 } from '../../constants/Colors';

export const Tab = ({
    tabs,
    handleTabChange,
    containerStyle,
    tabStyle,
    tabLabelStyle = TypographyVariants.title1
}: {
    tabs: Array<TabType>;
    handleTabChange: Function;
    containerStyle?: object;
    tabStyle?: object;
    tabLabelStyle?: any;
}) => {
    return (
        <View>
            <ScrollView
                contentContainerStyle={[styles.container, containerStyle]}
                horizontal
            >
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.tabWrapper,
                            !tab.active
                                ? { borderColor: '#fff' }
                                : { borderColor: '#043E90' },
                            tabStyle
                        ]}
                        onPress={() => handleTabChange(tab.label)}
                    >
                        <Typography
                            variant={tabLabelStyle}
                            style={[
                                styles.text,
                                !tab.active && { color: GREY_3 }
                            ]}
                        >
                            {tab.label}
                        </Typography>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.table.grey,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    tabWrapper: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: Colors.common.blue,
        borderRadius: 8,
        borderWidth: 1,
        height: 34,
        justifyContent: 'center',
        marginRight: 10,
        minWidth: '23%',
        paddingHorizontal: 5
    },
    text: {
        paddingVertical: 2
    }
});
