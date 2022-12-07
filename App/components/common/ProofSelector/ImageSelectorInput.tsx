import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { FileSelectorDialog } from '../Dialogs/FileSelectorDialog';
import { ImageInputType } from '../../../../types';
import { useTaskAction } from '../../../hooks/useTaskAction';
import { Asset } from 'react-native-image-picker';
import { ImageUploadIcon } from '../Icons/ImageUpload';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Typography, { TypographyVariants } from '../../ui/Typography';
import Colors, { BLUE_DARK } from '../../../constants/Colors';
import { RFPercentage } from 'react-native-responsive-fontsize';

export default function ImageInput({ title, imageTag, show }: ImageInputType) {
    const { imageProvider, imageSetterProvider } = useTaskAction();
    const [openFileSelectorDialog, setOpenFileSelectorDialog] = useState(false);

    const setImageData = (imagePath: string) => {
        imageSetterProvider(imageTag)(imagePath);
    };

    const imageLoader = () => {
        const imageData: Asset = imageProvider(imageTag);
        if (imageData) {
            return (
                <Image
                    source={{
                        uri: imageData.uri,
                        height: 300,
                        width: 300
                    }}
                />
            );
        }
        return <ImageUploadIcon size={50} />;
    };

    return (
        <>
            <FileSelectorDialog
                visible={openFileSelectorDialog}
                setVisible={setOpenFileSelectorDialog}
                setImageData={setImageData}
            />
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setOpenFileSelectorDialog(true)}
                style={styles.container}
            >
                <Typography
                    variant={TypographyVariants.title1}
                    style={styles.textStyle}
                >
                    {title}
                </Typography>
                {imageLoader()}

                <Typography
                    variant={TypographyVariants.caption1}
                    style={styles.browseText}
                >
                    Browse Document
                </Typography>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    browseText: {
        color: '#3889E9',
        marginTop: RFPercentage(0.6)
    },
    container: {
        alignItems: 'center',
        backgroundColor: Colors.table.grey,
        borderColor: BLUE_DARK,
        borderRadius: RFPercentage(1),
        borderStyle: 'dashed',
        borderWidth: 1,
        justifyContent: 'center',
        marginVertical: RFPercentage(1),
        minHeight: RFPercentage(18),
        minWidth: '100%',
        paddingVertical: RFPercentage(1)
    },
    textStyle: {
        color: BLUE_DARK,
        marginBottom: 10
    }
});
