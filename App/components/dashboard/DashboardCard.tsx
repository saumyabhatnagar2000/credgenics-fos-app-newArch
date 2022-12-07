import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { CollectionLimitDetails } from '../../../types';
import { useAuth } from '../../hooks/useAuth';
import {
    getCollectionLimits,
    getDashboardMatrices
} from '../../services/dashboardService';
import { View } from '../Themed';
import { useIsFocused } from '@react-navigation/native';
import { SummaryCard } from '../ui/SummaryCard';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, { TypographyVariants } from '../ui/Typography';
import { Card } from './Card';
import { Tab } from '../ui/Tab';
import moment, { Moment } from 'moment';
import { Chevron } from './Chevron';
import { CustomActivityIndicator } from '../placeholders/CustomActivityIndicator';
import DateRangePicker from '../DateRangePicker/DateRagePicker';
import useConfig from '../../hooks/useConfig';

const getToday = () => moment().format('YYYY-MM-DD');

export default function DashboardCard() {
    const { authData, getCurrencyString, updateCollectionLimitsDetails } =
        useAuth();
    const { collectionLimitsDetails } = useConfig();
    const isFocused = useIsFocused();
    const [dashboardMatrices, setDashboardMatrices] = useState<any>({});
    const [startDate, setStartDate] = useState<string | undefined>(getToday());
    const [endDate, setEndDate] = useState<string | undefined>(getToday());
    const [openDateRange, setOpenDateRange] = useState(false);
    const [displayedDate, setDisplayedDate] = useState<Moment | null>(moment());
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState({
        first_date: getToday(),
        last_date: getToday()
    });
    const [tab, setTab] = useState([
        {
            label: 'Collections',
            active: true
        },
        {
            label: 'Visits',
            active: false
        }
    ]);

    const getDetails = useCallback(() => {
        setLoading(true);
        updateCollectionLimitsDetails();
        setLoading(false);
    }, []);

    const getDashboardData = useCallback(
        (type: string) => {
            getDashboardMatrices(
                type,
                moment(date.first_date).format('YYYY-MM-DD'),
                moment(
                    date.last_date ? date.last_date : date.first_date
                ).format('YYYY-MM-DD'),
                authData,
                ''
            )
                .then((response) => {
                    setDashboardMatrices(response?.data ?? {});
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        },
        [authData, setDashboardMatrices, setLoading, date]
    );

    const onChangeDateRange = (dates: any) => {
        if (startDate && endDate) {
            setStartDate(undefined);
            setEndDate(undefined);
        }
        if (dates.startDate != undefined) {
            setStartDate((prev) => {
                return dates.startDate;
            });
        }

        if (dates.displayedDate != undefined) {
            setDisplayedDate(dates.displayedDate);
        }

        if (dates.endDate != undefined) {
            setEndDate((prev) => dates.endDate);
        }
    };

    useEffect(() => {
        if (isFocused) {
            let active = 'collections';
            tab.map((t) => {
                if (t.active === true) active = t.label.toLowerCase();
            });
            getDetails();
            getDashboardData(active);
        }
    }, [getDetails, getDashboardData, tab, isFocused]);

    const getFilterRange = () => {
        if (!date.last_date || date.first_date === date.last_date)
            return moment(date.first_date).format('DD MMM, YYYY');
        return `${moment(date.first_date).format('DD MMM')}-${moment(
            date.last_date
        ).format('DD MMM')}`;
    };

    if (loading) {
        return (
            <View style={styles.loaderStyle}>
                <CustomActivityIndicator />
            </View>
        );
    }

    const handleTabChange = (label: string) => {
        let tabDummy = tab;
        tabDummy.map((tab) => {
            tab.active = false;
            if (tab.label === label) {
                getDashboardData(tab.label.toLowerCase());
                tab.active = true;
            }
        });
        setTab([...tabDummy]);
    };

    return (
        <>
            <View style={styles.container}>
                <Card data={collectionLimitsDetails}>
                    <View style={styles.filterByContainer}>
                        <Typography
                            variant={TypographyVariants.caption}
                            style={styles.filterBy}
                        >
                            Filter By:
                        </Typography>
                        <TouchableOpacity
                            style={[styles.filterContainer]}
                            onPress={() => setOpenDateRange(true)}
                        >
                            <Typography
                                variant={TypographyVariants.caption4}
                                style={[
                                    styles.filterBy,
                                    { paddingHorizontal: 0 }
                                ]}
                            >
                                {getFilterRange()}
                            </Typography>
                            <Chevron />
                        </TouchableOpacity>
                    </View>

                    <DateRangePicker
                        onChange={onChangeDateRange}
                        isOpen={openDateRange}
                        setIsOpen={setOpenDateRange}
                        endDate={endDate}
                        startDate={startDate}
                        displayedDate={displayedDate}
                        maxDate={moment()}
                        setDate={setDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        date={date}
                        range
                    />
                    <Tab
                        tabs={tab}
                        handleTabChange={handleTabChange}
                        containerStyle={{
                            width: '100%',
                            backgroundColor: 'transparent'
                        }}
                        tabStyle={{ minWidth: '49%' }}
                    />

                    <View style={styles.summaryCardWrapper}>
                        {dashboardMatrices &&
                        Object.keys(dashboardMatrices).length
                            ? Object.keys(dashboardMatrices)?.map((item) => (
                                  <SummaryCard
                                      key={item}
                                      value={item}
                                      number={
                                          item.includes('Amount')
                                              ? getCurrencyString(
                                                    dashboardMatrices[
                                                        item
                                                    ]?.toFixed(2)
                                                )
                                              : dashboardMatrices[item]
                                      }
                                      notCapitalize={true}
                                  />
                              ))
                            : null}
                    </View>
                </Card>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F6F8FB',
        padding: RFPercentage(1.2)
    },
    filterBy: {
        paddingHorizontal: 10
    },
    filterByContainer: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },
    filterContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#043E90',
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: RFPercentage(1),
        paddingVertical: RFPercentage(0.5)
    },
    headerCard: {
        alignItems: 'center',
        backgroundColor: '#F6F8FB',
        flexDirection: 'row',
        paddingVertical: 15
    },
    loaderStyle: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center'
    },
    summaryCardWrapper: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    }
});
