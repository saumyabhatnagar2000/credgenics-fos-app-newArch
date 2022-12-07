import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomAppBar from '../components/common/AppBar';
import ExpandableCard from '../components/common/ExpandableCard/ExpandableCard';
import { ScrollView } from 'react-native-gesture-handler';
import { Tab } from '../components/ui/Tab';
import Typography, { TypographyVariants } from '../components/ui/Typography';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ExpandableCardTypes } from '../../enums';
import ExpandableView from '../components/common/ExpandableView/ExpandableView';
import useLoanDetails from '../hooks/useLoanData';

export const CombineHistory = ({ route }: { route: any }) => {
    const {
        visit_history,
        calling_history,
        loan_id,
        loan_data,
        digital_notice,
        speed_post
    } = route.params;
    const [tab, setTab] = useState([
        {
            label: 'Visit',
            active: true
        },
        {
            label: 'Calling',
            active: false
        },
        {
            label: 'Legal',
            active: false
        }
    ]);

    const getExtraData = (history: any) => {
        return {
            type: 'TASK',
            loan_id: loan_id,
            loan_data: loan_data,
            amount_recovered: history.amount_recovered,
            short_collection_receipt_url: history.collection_receipt,
            visit_date: history.visit_date
        };
    };

    const handleTabChange = (label: string) => {
        let tabDummy = tab;
        tabDummy.map((tab) => {
            tab.active = false;
            if (tab.label === label) {
                tab.active = false;
                if (tab.label === label) {
                    tab.active = true;
                }
                tab.active = true;
            }
        });
        setTab([...tabDummy]);
    };

    const getContent = () => {
        let activetab = '';
        try {
            if (tab[0].active) {
                activetab = tab[0].label;
                if (visit_history?.length)
                    return (
                        <View>
                            {visit_history.map(
                                (history: object, index: number) => (
                                    <ExpandableCard
                                        dataList={history}
                                        type="visit"
                                        extraData={getExtraData(history)}
                                    />
                                )
                            )}
                        </View>
                    );
                throw new Error();
            } else if (tab[1].active) {
                activetab = tab[1].label;
                if (calling_history?.length)
                    return (
                        <View>
                            {calling_history.map(
                                (history: object, index: number) => {
                                    let extraData = {
                                        call_disposition: history.status,
                                        created: history.created
                                    };
                                    return (
                                        <ExpandableCard
                                            dataList={history}
                                            type={ExpandableCardTypes.call}
                                            extraData={extraData}
                                        />
                                    );
                                }
                            )}
                        </View>
                    );
                throw new Error();
            } else if (tab[2].active) {
                activetab = tab[2].label;
                if (digital_notice?.length || speed_post?.length)
                    return (
                        <View>
                            {digital_notice?.length > 0 && (
                                <ExpandableView
                                    name="Digital Notice"
                                    dataList={digital_notice}
                                    hasChevron={false}
                                    extraData={
                                        ExpandableCardTypes.digitalNotice
                                    }
                                    showCards
                                    expanded
                                />
                            )}
                            {speed_post?.length > 0 && (
                                <ExpandableView
                                    name="Speed Post"
                                    dataList={speed_post}
                                    hasChevron={false}
                                    extraData={ExpandableCardTypes.speedPost}
                                    showCards
                                    expanded
                                />
                            )}
                        </View>
                    );
                throw new Error();
            }
        } catch {
            return (
                <View style={{ flex: 1 }}>
                    <Typography
                        style={styles.noDataText}
                        variant={TypographyVariants.body2}
                    >
                        {` No ${activetab} history found`}
                    </Typography>
                </View>
            );
        }
    };
    return (
        <>
            <CustomAppBar
                title={'History'}
                filter={false}
                sort={false}
                calendar={false}
                search={false}
                backButton={true}
                add={false}
                notifications={false}
                options={false}
            />
            <Tab
                tabs={tab}
                handleTabChange={handleTabChange}
                containerStyle={styles.customerTabContainer}
                tabStyle={{ borderRadius: 4 }}
            />
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                {getContent()}
            </ScrollView>
        </>
    );
};
const styles = StyleSheet.create({
    customerTabContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        width: '100%'
    },
    noDataText: {
        marginVertical: RFPercentage(5),
        textAlign: 'center'
    }
});
