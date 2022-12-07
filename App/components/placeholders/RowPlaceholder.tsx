import React from 'react';
import { StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function RowPlaceholder() {
    return (
        <View
            style={{
                marginVertical: 3,
                backgroundColor: 'white'
            }}
        >
            <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                    width="100%"
                    height={80}
                    justifyContent="space-evenly"
                    alignItems="center"
                    flexDirection="row"
                >
                    <SkeletonPlaceholder.Item
                        width={60}
                        height={60}
                        borderRadius={100}
                        alignSelf="flex-start"
                        position="relative"
                        margin={10}
                    />
                    <SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item
                            width={250}
                            height={10}
                            alignSelf="flex-start"
                            marginBottom={5}
                        />
                        <SkeletonPlaceholder.Item
                            width={200}
                            height={8}
                            alignSelf="flex-start"
                            marginBottom={5}
                        />
                        <SkeletonPlaceholder.Item
                            width={150}
                            height={6}
                            alignSelf="flex-start"
                            marginBottom={10}
                        />
                        <SkeletonPlaceholder.Item
                            flexDirection="row"
                            justifyContent="flex-end"
                        >
                            <SkeletonPlaceholder.Item
                                width={40}
                                height={20}
                                borderRadius={20}
                                marginHorizontal={10}
                                alignSelf="flex-end"
                            />
                            <SkeletonPlaceholder.Item
                                width={40}
                                height={20}
                                borderRadius={20}
                                marginHorizontal={10}
                                alignSelf="flex-end"
                            />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        height: 320,
        justifyContent: 'center',
        width: '100%'
    }
});
