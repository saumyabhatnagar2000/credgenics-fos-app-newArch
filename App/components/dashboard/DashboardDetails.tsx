import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MissedTask from './MissedTask';
import DashboardCard from './DashboardCard';
import TodaysCalenderComponent from './TodaysCalenderComponent';
import NextTasksComponent from './NextTasksComponent';
import { RFPercentage } from 'react-native-responsive-fontsize';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F6F8FB',
        paddingBottom: RFPercentage(10)
    }
});

export default function DashboardDetails() {
    return (
        <View
            style={{
                flexGrow: 1,
                backgroundColor: '#F6F8FB'
            }}
        >
            <ScrollView
                nestedScrollEnabled
                contentContainerStyle={styles.container}
            >
                <DashboardCard />
                <MissedTask />
                <TodaysCalenderComponent />
                <NextTasksComponent />
            </ScrollView>
        </View>
    );
}
