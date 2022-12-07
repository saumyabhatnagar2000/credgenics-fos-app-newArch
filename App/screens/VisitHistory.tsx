import React from 'react';
import { Text, View } from 'react-native';
import CustomAppBar from '../components/common/AppBar';
import ExpandableCard from '../components/common/ExpandableCard/ExpandableCard';
import { ScrollView } from 'react-native-gesture-handler';

export const VisitHitory = ({ route }: { route: any }) => {
    const { visit_history, loan_id, loanData } = route.params;
    return (
        <>
            <CustomAppBar
                title={'Visit History'}
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
                    {visit_history.length ? (
                        visit_history.map((history: object, index: number) => (
                            <ExpandableCard
                                dataList={history}
                                type="visit"
                                key={index}
                                extraData={{
                                    type: 'TASK',
                                    loan_id: loan_id,
                                    loan_data: loanData
                                }}
                            />
                        ))
                    ) : (
                        <Text
                            style={{ padding: 10, fontSize: 14, color: '#000' }}
                        >
                            No Visit History found!
                        </Text>
                    )}
                </View>
            </ScrollView>
        </>
    );
};
