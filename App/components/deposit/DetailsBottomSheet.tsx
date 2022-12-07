import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView
} from '@gorhom/bottom-sheet';
import { Loading } from '../common/Loading';
import Layout from '../../constants/Layout';

const DetailsBottomSheet = React.forwardRef((props: any, ref) => {
    const snapPoints = useMemo(() => ['75%'], []);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) props.onClose && props.onClose();
    }, []);

    const renderBackdrop = useCallback(
        (props) => <BottomSheetBackdrop disappearsOnIndex={-1} {...props} />,
        []
    );

    return (
        <BottomSheet
            onChange={handleSheetChanges}
            snapPoints={snapPoints}
            ref={ref}
            index={-1}
            backdropComponent={renderBackdrop}
        >
            <BottomSheetScrollView>
                {props.dataComponent ?? (
                    <View
                        style={{ flex: 1, height: Layout.window.height * 0.7 }}
                    >
                        <Loading />
                    </View>
                )}
            </BottomSheetScrollView>
        </BottomSheet>
    );
});

export default DetailsBottomSheet;
