import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../../../constants/Colors';
import { SideChevron } from '../Icons/SideChevron';
import Typography, { TypographyVariants } from '../../ui/Typography';
import { useNavigation } from '@react-navigation/native';
import { HelpSectionList } from '../../../constants/HelpSectionList';
import { useAuth } from '../../../hooks/useAuth';
import ExpandableCardHelpSection from '../ExpandableCard/ExpandableCardHelpSection';

const keyExtractor = (item: any, index: number) => index.toString();

export default function HelpSectionComponent() {
    const { navigate } = useNavigation();
    const { authData } = useAuth();

    const HelpSectionItem = ({
        item,
        index
    }: {
        item: object;
        index: number;
    }) => {
        return (
            <View style={{ marginBottom: 15 }}>
                <TouchableOpacity
                    onPress={() =>
                        navigate('HelpSectionDetailsScreen', {
                            headerName: item?.heading ?? '',
                            questionsList: item?.questions ?? ''
                        })
                    }
                    style={styles.headingView}
                >
                    <Typography
                        variant={TypographyVariants.body2}
                        style={{ color: Colors.light.text }}
                    >
                        {item?.heading ?? ''}
                    </Typography>
                    <SideChevron color={Colors.common.chevronColor} />
                </TouchableOpacity>
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.questionContainer}>
                        {item?.questions?.length ? (
                            item.questions?.map(
                                (questions: object, index: number) => {
                                    return (
                                        <ExpandableCardHelpSection
                                            dataList={questions}
                                            key={index}
                                            isOpened={false}
                                        />
                                    );
                                }
                            )
                        ) : (
                            <Typography
                                variant={TypographyVariants.body2}
                                style={{
                                    padding: 10,
                                    fontSize: 14,
                                    color: '#000'
                                }}
                            >
                                No questions available in this section!
                            </Typography>
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    };

    if (!authData) {
        return (
            <View style={styles.container}>
                <HelpSectionItem item={HelpSectionList[0]} index={0} />
            </View>
        );
    }
    return (
        <View style={styles.mainContainer}>
            <FlatList
                data={HelpSectionList}
                keyExtractor={keyExtractor}
                renderItem={({ item, index }) => (
                    <HelpSectionItem item={item} index={index} />
                )}
                style={styles.container}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingBottom: 15,
        paddingHorizontal: 10,
        paddingTop: 5
    },
    headerWhiteText: {
        color: Colors.light.text,
        flex: 0.9
    },
    headingView: {
        alignItems: 'center',
        backgroundColor: Colors.table.grey,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        color: Colors.light.text,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        padding: 7,
        paddingHorizontal: 14
    },
    itemseparator: {
        height: 10
    },
    mainContainer: {
        backgroundColor: '#fff',
        flex: 1
    },
    questionContainer: {
        backgroundColor: Colors.light.background,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderColor: Colors.light.background,
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    questionText: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.table.grey,
        color: Colors.light.text,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    scrollContainer: {
        borderColor: Colors.table.grey,
        borderLeftWidth: 1,
        borderRightWidth: 1
    }
});
