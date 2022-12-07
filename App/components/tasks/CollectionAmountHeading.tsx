import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Typography, { TypographyVariants } from '../ui/Typography';

type CollectionAmountHeadingType = {
    isBifurcatedCollection: boolean;
    showBifurcation: boolean;
    setIsBifurcatedCollection: (updatedIsBifColl: boolean) => void;
};

const CollectionAmountHeading = ({
    showBifurcation,
    isBifurcatedCollection,
    setIsBifurcatedCollection
}: CollectionAmountHeadingType) => {
    return (
        <View style={styles.container}>
            <Typography variant={TypographyVariants.title1}>
                Collection Amount
            </Typography>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
        paddingHorizontal: RFPercentage(2)
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row'
    }
});

export default CollectionAmountHeading;
