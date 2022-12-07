import React, { useState } from 'react';
import {
    LayoutAnimation,
    Linking,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ExpandableHelpCardType } from '../../../../types';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, { TypographyVariants } from '../../ui/Typography';
import Colors, {
    BACKGROUND_COLOR,
    BLUE_2,
    GREY_2
} from '../../../constants/Colors';
import { ChevronDown } from '../Icons/ChevronDown';
import { ChevronUp } from '../Icons/ChevronUp';
import { SelectedBranchListItem } from '../../deposit/SelectedBranchListItem';
import { BankBranchType, ExpandableCardTypes } from '../../../../enums';
import { SideChevron } from '../Icons/SideChevron';
import { useAuth } from '../../../hooks/useAuth';
import { capitalizeFirstLetter } from '../../../services/utils';

export default function ExpandableCardHelpSection(
    config: ExpandableHelpCardType
) {
    const [isExpanded, setIsExpanded] = useState(config.isOpened);
    const data = config?.dataList;
    const { depositBranch, setDepositBranch } = useAuth();

    const toggleExpand = () => {
        if (Platform.OS == 'android') {
            LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
            );
            setIsExpanded(!isExpanded);
        }
    };

    const handleDepositPress = () => {
        config?.extraData?.handlePress(data?.title);
        if (data?.title != BankBranchType.airtel) {
            setIsExpanded(true);
            config?.setIsOpened && config?.setIsOpened(true);
        }
    };

    const convertData = () => {
        return (
            <View
                style={
                    config?.type === ExpandableCardTypes.depositLocation ||
                    config?.type === ExpandableCardTypes.bankTransfer
                        ? styles.firstdepositContentWrapper
                        : styles.firstContentWrapper
                }
            >
                {config?.type === ExpandableCardTypes.depositLocation ||
                config?.type === ExpandableCardTypes.bankTransfer ? (
                    <>
                        {depositBranch?.branch_id &&
                            depositBranch?.branch_type == data?.title && (
                                <SelectedBranchListItem
                                    dataDict={
                                        depositBranch?.branch_details ?? {}
                                    }
                                />
                            )}
                    </>
                ) : (
                    <View style={styles.ansContainer}>
                        <Typography
                            variant={TypographyVariants.body2}
                            style={styles.answerText}
                        >
                            {data?.ans ?? ''}
                        </Typography>
                        {data?.url ? (
                            <TouchableOpacity
                                onPress={async () => {
                                    (await Linking.canOpenURL(data?.url)) &&
                                        Linking.openURL(data?.url);
                                }}
                                style={styles.watchVideo}
                            >
                                <Typography
                                    variant={TypographyVariants.body2}
                                    style={{
                                        textDecorationLine: 'underline',
                                        color: BLUE_2
                                    }}
                                >
                                    Watch Video
                                </Typography>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View
            style={
                config?.type === ExpandableCardTypes.depositLocation
                    ? styles.depositContainer
                    : styles.container
            }
        >
            {config?.type === ExpandableCardTypes.depositLocation ||
            config?.type === ExpandableCardTypes.bankTransfer ? (
                <>
                    <TouchableOpacity
                        activeOpacity={0.3}
                        style={
                            depositBranch?.branch_type === data?.title &&
                            config?.type === ExpandableCardTypes.depositLocation
                                ? styles.selectedInnerDropdown
                                : config?.type ===
                                  ExpandableCardTypes.bankTransfer
                                ? styles.innerDropdownbank
                                : styles.innerDropdown
                        }
                        onPress={handleDepositPress}
                    >
                        <View style={styles.innerListContainer}>
                            {data?.icon}
                            <Typography
                                variant={TypographyVariants.subHeading2}
                                style={styles.dropdownItem}
                            >
                                {capitalizeFirstLetter(data?.title) + ' Branch'}
                            </Typography>
                        </View>
                        {data?.title?.toLowerCase() !=
                            BankBranchType.airtel.toLowerCase() && (
                            <SideChevron height={9} width={9} />
                        )}
                    </TouchableOpacity>
                </>
            ) : (
                <View style={styles.headerWhite}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={toggleExpand}
                        style={styles.headerTouchable}
                    >
                        <Typography
                            variant={TypographyVariants.body2}
                            style={styles.headerWhiteText}
                        >
                            {config.dataList?.ques ?? ''}
                        </Typography>
                        {isExpanded ? (
                            <ChevronUp color={'#d6d5d2'} />
                        ) : (
                            <ChevronDown color={'#d6d5d2'} />
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {isExpanded && convertData()}
        </View>
    );
}

const styles = StyleSheet.create({
    ansContainer: {
        paddingVertical: RFPercentage(1.3),
        width: '100%'
    },
    answerText: {
        color: Colors.table.key,
        lineHeight: 18,
        paddingBottom: 7,
        textAlign: 'justify'
    },
    container: {
        backgroundColor: '#FFFFFF'
    },
    dateTimeWrapper: {
        flexDirection: 'row'
    },
    depositContainer: {
        backgroundColor: '#FFFFFF',
        borderColor: BACKGROUND_COLOR,
        borderTopWidth: 1
    },
    dropdownItem: {
        marginLeft: RFPercentage(2),
        padding: RFPercentage(1)
    },
    dropdownItemGrey: {
        color: GREY_2,
        marginLeft: RFPercentage(2),
        padding: RFPercentage(1)
    },
    firstContentWrapper: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.table.grey,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: RFPercentage(1.6)
    },
    firstdepositContentWrapper: {
        borderColor: BACKGROUND_COLOR,
        borderTopWidth: 1
    },
    headerTouchable: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerWhite: {
        backgroundColor: '#fff',
        borderBottomColor: Colors.table.grey,
        borderBottomWidth: 1,
        paddingHorizontal: RFPercentage(1.6),
        paddingVertical: RFPercentage(1.1)
    },
    headerWhiteText: {
        color: Colors.light.text,
        flex: 0.9,
        lineHeight: 20
    },
    innerDropdown: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: RFPercentage(2)
    },
    innerDropdownbank: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: RFPercentage(2),
        padding: RFPercentage(0.7)
    },
    innerListContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: RFPercentage(1),
        paddingVertical: RFPercentage(0.5)
    },
    selectedInnerDropdown: {
        alignItems: 'center',
        backgroundColor: '#E5F0FF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: RFPercentage(2)
    },
    watchVideo: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    }
});
