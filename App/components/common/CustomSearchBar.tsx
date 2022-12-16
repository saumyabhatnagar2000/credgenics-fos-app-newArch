import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Input } from '@rneui/base';
import { Icon } from '@rneui/base';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from '../ui/Typography';
import Colors, { BLUE_DARK } from '../../constants/Colors';
import { Menu } from 'react-native-paper';
import { useAction } from '../../hooks/useAction';
import { ChevronDown } from './Icons/ChevronDown';
import { keyConverter } from '../../services/utils';
import { SearchUsedOn } from '../../../enums';
import { useTaskFilter } from '../../hooks/useTaskFilter';
import { useTaskHistoryFilter } from '../../hooks/useTaskHistoryFilter';

export default function CustomSearchBar({
    searchQuery,
    setSearchQuery,
    searchType,
    usedOn,
    searchTypeName,
    setSearchTypeName
}: {
    searchQuery: string;
    setSearchQuery: any;
    searchType: Object;
    usedOn?: string;
    searchTypeName?: string;
    setSearchTypeName?: any;
}) {
    const { portfolioSearchType, setPortfolioSearchType } = useAction();
    const { setVisitSearchType, visitSearchType } = useTaskFilter();
    const { setVisitHistorySearchType, visitHistorySearchType } =
        useTaskHistoryFilter();
    const [searchMenuVisible, setSearchMenuVisible] = React.useState(false);
    const onMenuPress = (item: string) => {
        if (usedOn == SearchUsedOn.portfolio) setPortfolioSearchType(item);
        else if (usedOn == SearchUsedOn.visit) setVisitSearchType(item);
        else if (usedOn == SearchUsedOn.history)
            setVisitHistorySearchType(item);
        else setSearchTypeName(item);
        setSearchMenuVisible(false);
    };

    const getSearchTypesName = () => {
        if (usedOn == SearchUsedOn.portfolio)
            return keyConverter(
                String(
                    Object.keys(searchType).find(
                        (key) => searchType[key] === portfolioSearchType
                    )
                )
            );
        else if (usedOn == SearchUsedOn.visit)
            return keyConverter(
                String(
                    Object.keys(searchType).find(
                        (key) => searchType[key] === visitSearchType
                    )
                )
            );
        else if (usedOn == SearchUsedOn.history)
            return keyConverter(
                String(
                    Object.keys(searchType).find(
                        (key) => searchType[key] === visitHistorySearchType
                    )
                )
            );
        else
            return keyConverter(
                String(
                    Object.keys(searchType).find(
                        (key) => searchType[key] === searchTypeName
                    )
                )
            );
    };
    return (
        <View style={styles.container}>
            <Input
                placeholder="Search"
                placeholderTextColor="#074193"
                containerStyle={styles.inputOuterContainer}
                inputContainerStyle={styles.inputContainer}
                value={searchQuery}
                onChangeText={setSearchQuery}
                inputStyle={{
                    fontFamily: TypographyFontFamily.normal,
                    fontSize: RFPercentage(1.8)
                }}
                leftIcon={
                    <Icon
                        name="search-outline"
                        type="ionicon"
                        color={BLUE_DARK}
                        size={RFPercentage(2)}
                    />
                }
                rightIcon={() => {
                    return (
                        <View style={styles.rightIconContainer}>
                            <View style={styles.verticalDivider} />
                            <Menu
                                visible={searchMenuVisible}
                                onDismiss={() => setSearchMenuVisible(false)}
                                contentStyle={{
                                    backgroundColor: '#F6F8FB'
                                }}
                                anchor={
                                    <TouchableOpacity
                                        onPress={() =>
                                            setSearchMenuVisible(true)
                                        }
                                        style={styles.menuAnchorButton}
                                    >
                                        <Typography
                                            variant={TypographyVariants.caption}
                                            style={{ marginRight: 5 }}
                                        >
                                            {getSearchTypesName()}
                                        </Typography>
                                        <ChevronDown height={5} width={10} />
                                    </TouchableOpacity>
                                }
                            >
                                {Object.entries(searchType)?.map((item) => (
                                    <>
                                        <Menu.Item
                                            key={item[0]}
                                            title={keyConverter(item[0])}
                                            titleStyle={styles.menuTitle}
                                            onPress={() => onMenuPress(item[1])}
                                        />
                                    </>
                                ))}
                            </Menu>
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.table.grey,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: RFPercentage(0.5)
    },
    inputContainer: {
        alignSelf: 'center',
        backgroundColor: Colors.light.background,
        borderColor: Colors.light.background,
        borderRadius: 8,
        borderWidth: 1,
        height: RFPercentage(5),
        paddingLeft: RFPercentage(1),
        paddingRight: RFPercentage(0.5),
        width: '100%'
    },
    inputOuterContainer: {
        flexDirection: 'row',
        width: '100%'
    },
    menuAnchorButton: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: RFPercentage(5),
        justifyContent: 'center',
        margin: RFPercentage(0.2),
        width: RFPercentage(12)
    },
    menuTitle: {
        color: BLUE_DARK,
        fontFamily: TypographyFontFamily.medium,
        fontSize: RFPercentage(1.6)
    },
    rightIconContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    verticalDivider: {
        backgroundColor: Colors.light.blueBackground,
        height: '100%',
        marginRight: RFPercentage(1),
        width: '0.45%'
    }
});
