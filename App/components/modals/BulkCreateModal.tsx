import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import { BulkCreateModalType, BulkVisitDataType } from '../../../types';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../ui/CustomButton';
import {
    CANCEL_RED,
    GREEN,
    GREY_2,
    GREY_HEADING
} from '../../constants/Colors';
import { SuccessTick } from '../common/Icons/SuccessTick';
import { FailureTick } from '../common/Icons/FailureTick';
import Typography, { TypographyVariants } from '../ui/Typography';
import { VISITS_PTPS_OPEN, VISIT_PTP_OPEN } from '../../constants/constants';

function Status({
    id,
    applicantName,
    status
}: {
    id: string;
    applicantName: string;
    status: string;
}) {
    return (
        <View style={styles.statusContainer} key={id}>
            <View style={styles.row}>
                <Typography
                    variant={TypographyVariants.body6}
                    style={styles.nameText}
                >
                    {applicantName}
                </Typography>
                <Typography
                    variant={TypographyVariants.body2}
                    style={styles.loanIdText}
                >
                    {'(#' + id + ')'}
                </Typography>
            </View>
        </View>
    );
}

export default function BulkCreateModal({
    visible,
    hideModal,
    items,
    statuses
}: BulkCreateModalType) {
    const navigation = useNavigation();
    const [failedVisits, setFailedVisits] = useState<Array<BulkVisitDataType>>(
        []
    );
    const [successfulVisits, setSuccessfulVisits] = useState<
        Array<BulkVisitDataType>
    >([]);

    useEffect(() => {
        statuses?.forEach((loan, idx) => {
            const obj: BulkVisitDataType = {
                id: loan?.loan_id,
                applicant_name: loan?.applicant_name,
                status: loan?.message
            };
            if (!loan?.success) {
                setFailedVisits((prev) => [...prev, obj]);
            } else {
                setSuccessfulVisits((prev) => [...prev, obj]);
            }
        });
    }, [statuses]);

    return (
        <Portal>
            <Modal
                visible={visible}
                dismissable={false}
                contentContainerStyle={styles.containerStyle}
            >
                <View style={styles.content}>
                    <Typography
                        variant={TypographyVariants.heading3}
                        style={styles.textStyle}
                    >
                        Visit Status
                    </Typography>
                    <ScrollView contentContainerStyle={{}}>
                        {failedVisits?.length > 0 && (
                            <View style={styles.innerContainer}>
                                <View style={styles.failedContainer}>
                                    <View style={styles.failuretick}>
                                        <FailureTick />
                                    </View>
                                    <View>
                                        <Typography
                                            variant={TypographyVariants.title2}
                                            style={styles.failedHeading}
                                        >
                                            Failed Visits
                                        </Typography>
                                        <Typography
                                            variant={TypographyVariants.body2}
                                            style={styles.statusText}
                                        >
                                            {failedVisits?.length > 1
                                                ? VISITS_PTPS_OPEN
                                                : VISIT_PTP_OPEN}
                                        </Typography>
                                    </View>
                                </View>

                                {failedVisits?.map(
                                    (item: BulkVisitDataType) => (
                                        <Status
                                            id={item.id}
                                            applicantName={item.applicant_name}
                                            status={item.status}
                                        />
                                    )
                                )}
                            </View>
                        )}
                        {successfulVisits?.length > 0 && (
                            <View style={styles.innerContainer}>
                                <View style={styles.failedContainer}>
                                    <SuccessTick />
                                    <Typography
                                        variant={TypographyVariants.title2}
                                        style={styles.successHeading}
                                    >
                                        Successful Visits
                                    </Typography>
                                </View>
                                {successfulVisits?.map(
                                    (item: BulkVisitDataType) => (
                                        <Status
                                            id={item.id}
                                            applicantName={item.applicant_name}
                                            status={item.status}
                                        />
                                    )
                                )}
                            </View>
                        )}
                    </ScrollView>
                </View>
                <CustomButton
                    onPress={() => {
                        hideModal(false);
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        }
                    }}
                    title="DONE"
                />
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        maxHeight: '80%',
        paddingBottom: RFPercentage(2),
        width: '80%'
    },
    content: {
        maxHeight: '90%',
        padding: RFPercentage(2),
        width: '100%'
    },
    failedContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: RFPercentage(1)
    },
    failedHeading: {
        color: CANCEL_RED,
        paddingLeft: RFPercentage(1)
    },
    failuretick: {
        alignSelf: 'flex-start',
        paddingTop: RFPercentage(0.2)
    },
    innerContainer: {
        marginVertical: RFPercentage(2)
    },
    loanIdText: {
        color: GREY_2,
        marginLeft: RFPercentage(1)
    },
    nameText: {
        color: GREY_HEADING
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: RFPercentage(0.5)
    },
    statusContainer: {
        borderBottomWidth: 1,
        borderColor: '#0000000D',
        justifyContent: 'space-between',
        marginVertical: RFPercentage(0.5)
    },
    statusText: {
        color: GREY_HEADING,
        flexShrink: 1,
        marginHorizontal: RFPercentage(1)
    },
    successHeading: {
        color: GREEN,
        paddingHorizontal: RFPercentage(1)
    },
    textStyle: {
        marginVertical: RFPercentage(1),
        textAlign: 'center'
    }
});
