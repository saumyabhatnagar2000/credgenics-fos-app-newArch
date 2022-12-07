import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useAuth } from '../../hooks/useAuth';
import TitleAvatar from '../TitleAvatar';
import { CircularProgress } from '../ui/CircularProgress';
import Typography, { TypographyVariants } from '../ui/Typography';

export const Card = ({ data, children }: { data: any; children: any }) => {
    const { authData } = useAuth();

    const [showChildren, setShowChildren] = useState(false);

    const getPercentage = (num: number = 1, den: number = 1) => {
        return (num / den) * 100;
    };
    return (
        <View style={styles.wrapper}>
            <View style={styles.nameWrapper}>
                <TitleAvatar
                    title={authData?.name || ''}
                    style={{ borderRadius: 16 }}
                />
                <View
                    style={{
                        marginLeft: 16,
                        paddingHorizontal: RFPercentage(0.5)
                    }}
                >
                    <Typography
                        variant={TypographyVariants.title}
                        style={styles.nameText}
                    >
                        {authData?.name}
                    </Typography>
                    <Typography variant={TypographyVariants.caption}>
                        Welcome Back!
                    </Typography>
                </View>
            </View>
            <View style={styles.progressWrapper}>
                <CircularProgress
                    percent={100}
                    value={data?.max_limit}
                    label="Max. Limit"
                />
                <CircularProgress
                    percent={getPercentage(
                        data?.collection_in_hand,
                        data?.max_limit
                    )}
                    value={data?.collection_in_hand}
                    label="Collection in Hand"
                />
                <CircularProgress
                    percent={getPercentage(
                        data?.available_limit,
                        data?.max_limit
                    )}
                    value={data?.available_limit}
                    label="Available Limit"
                />
            </View>
            {!!showChildren && children}
            <TouchableOpacity
                style={styles.expand}
                onPress={() => setShowChildren((t) => !t)}
            >
                <Typography variant={TypographyVariants.body2}>
                    {showChildren ? 'See Less' : 'See More'}
                </Typography>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    expand: {
        alignItems: 'flex-end'
    },
    nameText: {
        fontWeight: 'bold',
        marginTop: 8,
        textTransform: 'uppercase',
        flexWrap: 'wrap',
        marginRight: RFPercentage(6)
    },
    nameWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    progressWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingTop: 16
    },
    wrapper: {
        backgroundColor: '#d7e4f5',
        borderColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        elevation: 3,
        paddingBottom: 10,
        paddingHorizontal: 18,
        paddingTop: 15,
        width: '100%'
    }
});
