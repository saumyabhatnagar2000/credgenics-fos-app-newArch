import React from 'react';
import { View } from '../../Themed';
import { StyleSheet } from 'react-native';
import ImageInput from './ImageSelectorInput';
import { ImageInputType, ProofSelectorType } from '../../../../types';
import { RFPercentage } from 'react-native-responsive-fontsize';

export default function ProofSelectorContainer({ proofs }: ProofSelectorType) {
    return (
        <View style={styles.container}>
            {proofs.map((item: ImageInputType) => {
                if (item.show) {
                    return (
                        <ImageInput
                            key={item.imageTag}
                            title={item.title}
                            imageTag={item.imageTag}
                            show={item.show}
                        />
                    );
                }
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: RFPercentage(1),
        marginVertical: RFPercentage(1),
        padding: 0
    },
    headerContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    }
});
