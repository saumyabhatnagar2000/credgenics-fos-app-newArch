// import { Ionicons } from '@expo/vector-icons';
// import * as Font from 'expo-font';
// // import * as SplashScreen from 'expo-splash-screen';
// import * as React from 'react';

// export default function useCachedResources() {
//     const [isLoadingComplete, setLoadingComplete] = React.useState(false);

//     // Load any resources or data that we need prior to rendering the app
//     React.useEffect(() => {
//         async function loadResourcesAndDataAsync() {
//             try {
//                 SplashScreen.preventAutoHideAsync();

//                 // Load fonts
//                 await Font.loadAsync({
//                     ...Ionicons.font,
//                     AvenirLTProBlack: require('../../assets/fonts/AvenirLTProBlack.ttf'),
//                     AvenirLTProBlackOblique: require('../../assets/fonts/AvenirLTProBlackOblique.ttf'),
//                     AvenirLTProHeavy: require('../../assets/fonts/AvenirLTProHeavy.ttf'),
//                     AvenirLTProHeavyOblique: require('../../assets/fonts/AvenirLTProHeavyOblique.ttf'),
//                     AvenirLTProMedium: require('../../assets/fonts/AvenirLTProMedium.ttf'),
//                     AvenirLTProMediumOblique: require('../../assets/fonts/AvenirLTProMediumOblique.ttf'),
//                     AvenirLTProRoman: require('../../assets/fonts/AvenirLTProRoman.ttf'),
//                     AvenirLTProOblique: require('../../assets/fonts/AvenirLTProOblique.ttf'),
//                     AvenirLTProBook: require('../../assets/fonts/AvenirLTProBook.ttf'),
//                     AvenirLTProBookOblique: require('../../assets/fonts/AvenirLTProBookOblique.ttf'),
//                     AvenirLTProLight: require('../../assets/fonts/AvenirLTProLight.ttf'),
//                     AvenirLTProLightOblique: require('../../assets/fonts/AvenirLTProLightOblique.ttf')
//                 });
//             } catch (e) {
//                 // We might want to provide this error information to an error reporting service
//                 console.warn(e);
//             } finally {
//                 setLoadingComplete(true);
//                 SplashScreen.hideAsync();
//             }
//         }

//         loadResourcesAndDataAsync();
//     }, []);

//     return isLoadingComplete;
// }
