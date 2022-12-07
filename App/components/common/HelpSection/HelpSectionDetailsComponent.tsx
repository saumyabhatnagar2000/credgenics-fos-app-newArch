import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../../../constants/Colors';
import Typography, { TypographyVariants } from '../../ui/Typography';
import ExpandableCardHelpSection from '../ExpandableCard/ExpandableCardHelpSection';

export default function HelpSectionDetailsComponent({
    headerName,
    questionsList,
    indexOpened
}: {
    headerName: string;
    questionsList: string;
    indexOpened: number;
}) {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.questionContainer}>
                {questionsList.length ? (
                    questionsList?.map((questions: object, index: number) => (
                        <View>
                            <ExpandableCardHelpSection
                                dataList={questions}
                                key={index}
                                isOpened={index === indexOpened ? true : false}
                            />
                        </View>
                    ))
                ) : (
                    <Typography
                        variant={TypographyVariants.body2}
                        style={{ padding: 10, fontSize: 14, color: '#000' }}
                    >
                        No questions available in this section!
                    </Typography>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    headingView: {
        backgroundColor: Colors.table.grey,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        color: Colors.light.text,
        marginTop: 10,
        padding: 7,
        paddingLeft: 12
    },
    questionContainer: {
        borderColor: Colors.table.grey,
        borderLeftWidth: 1,
        borderRadius: 5,
        borderRightWidth: 1,
        borderTopWidth: 1,
        margin: 10
    },
    questionText: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.table.grey,
        color: Colors.light.text,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 7
    }
});
