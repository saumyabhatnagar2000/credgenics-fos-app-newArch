import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { HistoryScreenTabType } from '../../../enums';
import CustomAppBar from '../../components/common/AppBar';
import DepositPendingList from '../../components/deposit/DepositPendingList';
import Typography, { TypographyVariants } from '../../components/ui/Typography';

export default function DepositPendingScreen() {
    const navigation = useNavigation();

    function ViewCollectionsLink() {
        const onNavigationTextClicked = () => {
            navigation.navigate('HistoryScreen', {
                initialRoute: HistoryScreenTabType.deposits
            });
        };
        return (
            <TouchableOpacity onPress={() => onNavigationTextClicked()}>
                <Typography
                    variant={TypographyVariants.caption}
                    style={styles.navigationText}
                >
                    View Past Collections
                </Typography>
            </TouchableOpacity>
        );
    }

    return (
        <>
            <CustomAppBar
                title="Collections"
                search={false}
                options={false}
                calendar={false}
                notifications={false}
                backButton={false}
                menuButton={true}
                add={false}
                sort={false}
                filter={false}
                rightActionComponent={<ViewCollectionsLink />}
            />
            <DepositPendingList />
        </>
    );
}

const styles = StyleSheet.create({
    navigationText: {
        color: '#fff',
        paddingHorizontal: RFPercentage(1),
        textDecorationLine: 'underline'
    }
});
