import { StyleSheet } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

export default StyleSheet.create({
    container: {
        backgroundColor: colors.background1,
        flex: 1
    },
    exampleContainer: {
        paddingVertical: 0
    },
    exampleContainerDark: {
        backgroundColor: colors.black
    },
    exampleContainerLight: {
        backgroundColor: 'white'
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    paginationContainer: {
        // paddingVertical: 8
        paddingVertical: 2
        // backgroundColor: 'red'
    },
    paginationDot: {
        borderRadius: 4,
        height: 8,
        marginHorizontal: 8,
        width: 8
    },
    safeArea: {
        backgroundColor: colors.black,
        flex: 1
    },
    scrollview: {
        flex: 1
    },
    slider: {
        // marginTop: 15,
        marginTop: 2,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        // paddingVertical: 10 // for custom animation
        paddingVertical: 0 // for custom animation
    },
    subtitle: {
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        marginTop: 5,
        paddingHorizontal: 30,
        textAlign: 'center'
    },
    title: {
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 30,
        textAlign: 'center'
    },
    titleDark: {
        color: colors.black
    }
});
