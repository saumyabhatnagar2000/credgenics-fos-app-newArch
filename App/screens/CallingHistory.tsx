import React from 'react';
import { Text, View } from 'react-native';
import CustomAppBar from '../components/common/AppBar';
import ExpandableCard from '../components/common/ExpandableCard/ExpandableCard';
import { ScrollView } from 'react-native-gesture-handler';

export const CallingHistory = ({ route }: { route: any }) => {
    const { calling_history } = route.params;

    return (
        <>
            <CustomAppBar
                title={'Calling History'}
                filter={false}
                sort={false}
                calendar={false}
                search={false}
                backButton={true}
                add={false}
                notifications={false}
                options={false}
            />
            <ScrollView
                style={{ flex: 1, backgroundColor: '#F6F8FB' }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View>
                    {calling_history.length ? (
                        calling_history.map(
                            (history: object, index: number) => {
                                let extraData = {
                                    call_disposition: history.status,
                                    created: history.created
                                };
                                return (
                                    <ExpandableCard
                                        dataList={history}
                                        type="call"
                                        key={index}
                                        extraData={extraData}
                                    />
                                );
                            }
                        )
                    ) : (
                        <Text
                            style={{ padding: 10, fontSize: 14, color: '#000' }}
                        >
                            No Calling History found!
                        </Text>
                    )}
                </View>
            </ScrollView>
        </>
    );
};
