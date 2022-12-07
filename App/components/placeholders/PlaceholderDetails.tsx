import React from 'react';
import { StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const HeaderPlaceholder = () => (
    <View style={{ marginVertical: 5, backgroundColor: 'white' }}>
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
                width="100%"
                height={80}
                paddingHorizontal={10}
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
            >
                <SkeletonPlaceholder.Item
                    width={50}
                    height={50}
                    borderRadius={100}
                    marginVertical={12}
                    marginHorizontal={10}
                />
                <SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item
                        width={100}
                        height={8}
                        alignSelf="flex-start"
                        marginBottom={10}
                    />
                    <SkeletonPlaceholder.Item
                        width={80}
                        height={8}
                        alignSelf="flex-start"
                        marginBottom={10}
                    />
                    <SkeletonPlaceholder.Item
                        width={60}
                        height={8}
                        alignSelf="flex-start"
                        marginBottom={10}
                    />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item
                        width={120}
                        height={10}
                        alignSelf="flex-start"
                        marginBottom={10}
                    />
                    <SkeletonPlaceholder.Item
                        width={100}
                        height={10}
                        alignSelf="flex-start"
                        marginBottom={10}
                    />
                    <SkeletonPlaceholder.Item
                        width={80}
                        height={10}
                        alignSelf="flex-start"
                        marginBottom={10}
                    />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    </View>
);

const DropDownHolder = () => (
    <View
        style={{
            backgroundColor: 'white'
        }}
    >
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
                width="100%"
                height={100}
                paddingHorizontal={10}
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
            >
                <SkeletonPlaceholder.Item
                    width={50}
                    height={50}
                    borderRadius={100}
                    marginVertical={12}
                    marginHorizontal={10}
                />
                <SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item
                        width={200}
                        height={8}
                        alignSelf="flex-start"
                        marginBottom={10}
                    />
                    <SkeletonPlaceholder.Item
                        width={180}
                        height={8}
                        alignSelf="flex-start"
                        marginBottom={10}
                    />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                    width={20}
                    height={20}
                    borderRadius={100}
                    marginVertical={12}
                    marginHorizontal={10}
                />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    </View>
);

export default function PlaceholderDetails() {
    return (
        <>
            <HeaderPlaceholder />
            <DropDownHolder />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        justifyContent: 'center'
    }
});
