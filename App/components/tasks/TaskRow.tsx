import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@rneui/base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
    CompanyType,
    TaskScheduledByType,
    VisitPurposeType
} from '../../../enums';
import { TaskRowType } from '../../../types';
import {
    StringCompare,
    getOnlyDate,
    getOnlyDistance
} from '../../services/utils';
import { BLUE, BLUE_2, GREY, GREY_2 } from '../../constants/Colors';
import DepositStatusCapsule from '../common/Capsules/DepositStatusCapsule';
import Typography, { TypographyVariants } from '../ui/Typography';
import { CheckBox } from '@rneui/base';
import { useAuth } from '../../hooks/useAuth';
import moment from 'moment';
import useCommon from '../../hooks/useCommon';

const getVisitType = (visitType?: string, visitDate?: string) => {
    if (visitType == 'Closed') return 'Closed';
    else {
        if (moment(visitDate) < moment()) return 'Missed';
        return 'Open';
    }
};

export default function TaskRow({
    rowData,
    onClick,
    onCheckboxClicked,
    checked
}: TaskRowType): JSX.Element {
    const { companyType, isRoutePlanningEnabled } = useAuth();
    const { isInternetAvailable } = useCommon();

    return (
        <View style={styles.container}>
            {companyType == CompanyType.loan &&
                isRoutePlanningEnabled &&
                isInternetAvailable && (
                    <TouchableOpacity
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            height: '100%'
                        }}
                        onPress={() => onCheckboxClicked?.()}
                    >
                        <CheckBox
                            uncheckedColor="#90919588"
                            checkedColor={BLUE_2}
                            size={RFPercentage(4)}
                            iconType="material"
                            containerStyle={{
                                paddingHorizontal: 6
                            }}
                            checkedIcon="check-box"
                            uncheckedIcon="check-box-outline-blank"
                            checked={!!checked}
                        />
                    </TouchableOpacity>
                )}
            <View
                style={{
                    flex: 1,
                    flexGrow: 1,
                    paddingLeft: 10
                }}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        flexGrow: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                    onPress={() => onClick?.()}
                >
                    <View style={{ justifyContent: 'space-between' }}>
                        <View style={{ marginBottom: RFPercentage(1) }}>
                            <View style={styles.rowCenter}>
                                <Typography
                                    variant={TypographyVariants.title1}
                                    style={styles.heading}
                                >
                                    {rowData.applicant_name ?? 'NA'}
                                </Typography>
                            </View>
                            <Typography
                                style={styles.textSecondary}
                                variant={TypographyVariants.caption1}
                            >
                                {`ID: ${rowData.loan_id ?? 'NA'}`} {'  '} |
                                {'  '}
                                {getOnlyDate(rowData.visit_date)}
                            </Typography>
                        </View>
                        <View
                            style={[
                                styles.rowCenter,
                                { marginVertical: RFPercentage(0.5) }
                            ]}
                        >
                            <Icon
                                style={{ marginRight: 8 }}
                                size={RFPercentage(1.6)}
                                name="map-marker-alt"
                                type="fontisto"
                                color={GREY_2}
                            />
                            <Typography variant={TypographyVariants.caption}>
                                {getOnlyDistance(rowData.distance)}
                            </Typography>
                            {StringCompare(
                                rowData.visit_purpose,
                                VisitPurposeType.promise_to_pay
                            ) && (
                                <>
                                    <Typography
                                        variant={TypographyVariants.caption3}
                                        style={{ marginHorizontal: 6 }}
                                    >
                                        |
                                    </Typography>
                                    <Typography
                                        variant={TypographyVariants.caption}
                                    >
                                        PTP
                                    </Typography>
                                </>
                            )}
                            <Typography
                                variant={TypographyVariants.caption3}
                                style={{ marginHorizontal: 6 }}
                            >
                                |
                            </Typography>
                            <Typography variant={TypographyVariants.caption}>
                                {rowData.scheduled_by ==
                                TaskScheduledByType.agent
                                    ? 'Self Scheduled'
                                    : 'Manager Scheduled'}
                            </Typography>
                        </View>
                    </View>
                    <View
                        style={{
                            justifyContent: 'space-around',
                            alignItems: 'flex-end'
                        }}
                    >
                        <DepositStatusCapsule
                            status={
                                getVisitType(
                                    rowData?.visit_status,
                                    rowData.visit_date
                                )?.toLowerCase() ?? ''
                            }
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: RFPercentage(0.5),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: RFPercentage(1),
        marginVertical: RFPercentage(0.6),
        paddingHorizontal: RFPercentage(1),
        paddingRight: RFPercentage(2),
        paddingVertical: RFPercentage(1.2)
    },
    distanceText: {
        color: BLUE,
        fontSize: RFPercentage(1.8)
    },
    heading: {
        paddingVertical: 2
    },
    rowCenter: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    textSecondary: {
        color: GREY,
        marginTop: RFPercentage(0.4)
    }
});
