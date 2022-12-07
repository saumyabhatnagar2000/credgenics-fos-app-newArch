import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TaskType } from '../../types';
import CustomAppBar from '../components/common/AppBar';
import { BLUE_DARK, BLUE_LIGHT, GREEN, RED2 } from '../constants/Colors';
import {
    getOptimizedRoute,
    resetRoute,
    resumeRoute
} from '../services/routeService';
import VisitsSlider from './VisitsSlider';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '../config/ApiKeys';
import { getLocationPromise, startCall } from '../services/utils';
import { useAuth } from '../hooks/useAuth';
import { getStorageData, setStorageData } from '../utils/Storage';
import {
    ROUTE_PLANNING_RESUME_KEY,
    VISIT_COMPLETE_STORAGE_KEY
} from '../constants/Storage';
import CallTypeListModal from '../components/modals/CallTypeListModal';
import { CallingModeTypes } from '../../enums';
import { callUser } from '../services/communicationService';
import ConnectingClickToCallModal from '../components/modals/ConnectingClickToCallModal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Typography, { TypographyVariants } from '../components/ui/Typography';
import MapStyle from '../constants/MapStyles.json';
import { useAction } from '../hooks/useAction';
import useLoanDetails from '../hooks/useLoanData';

export default function Map({ route }: { route: any }) {
    const {
        visits,
        routePlanningResume
    }: { visits: TaskType[]; routePlanningResume: boolean } = route.params;

    const navigation = useNavigation();
    const { authData, callingModes } = useAuth();
    const [isConnectingVisible, setIsConnectingVisible] = useState(false);

    const [data, setData] = useState({});
    const [focussedPoint, setFocussedPoint] = useState({});
    const [completedVisitData, setCompletedVisitData] = useState({});
    const [resumeClosedVisit, setResumeCosedVisits] = useState([]);

    const getAllClosedVisits = useMemo(() => {
        const temp = Object.keys(completedVisitData).concat(resumeClosedVisit);
        return Array.from(new Set(temp));
    }, [completedVisitData, resumeClosedVisit]);

    const [callModalNumber, setCallModalNumber] = useState('');

    const [region, setRegion] = useState({
        latitude: 21.34968566442769,
        latitudeDelta: 29.465720212643205,
        longitude: 79.49734322726727,
        longitudeDelta: 16.946203261613846
    });
    const { selectedLoanData, setSelectedLoanData } = useLoanDetails();

    const map = useRef();
    const markers = useRef([]);
    const handleRegion = useCallback(
        (data) => {
            let firstPoint = data?.destination;
            if (data && data?.waypoints && data?.waypoints.length > 0) {
                firstPoint = data?.waypoints[0];
            }
        },
        [map.current]
    );
    function FinishRouteButton() {
        const navigation = useNavigation();
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={async () => {
                    await resetRoute(authData);
                    await setStorageData(
                        ROUTE_PLANNING_RESUME_KEY,
                        JSON.stringify(false)
                    );
                    navigation.canGoBack?.() && navigation.goBack?.();
                }}
            >
                <Typography color="white" variant={TypographyVariants.body4}>
                    FINISH ROUTE
                </Typography>
            </TouchableOpacity>
        );
    }

    useEffect(() => {
        if (Object.keys(visits).length == 0 && !routePlanningResume) {
            navigation.canGoBack() && navigation.goBack();
            ToastAndroid.show('No visits found', ToastAndroid.SHORT);
            return;
        }

        (async () => {
            let origin;
            try {
                const { isMocked, ...location } = await getLocationPromise();
                origin = location;
            } catch (e) {
                ToastAndroid.show(
                    'Error fetching user location',
                    ToastAndroid.SHORT
                );
                navigation.canGoBack() && navigation.goBack();
            }

            try {
                const visitsArray = Object.values(visits).sort(
                    (a: TaskType, b: TaskType) => a?.distance - b?.distance ?? 0
                );
                let destination;
                let waypoints = [];
                if (visitsArray.length >= 1) {
                    const destinationVisit =
                        visitsArray[visitsArray.length - 1];
                    destination = {
                        ...destinationVisit
                    };
                    waypoints = visitsArray
                        .slice(0, visitsArray.length - 1)
                        .map((visit: TaskType) => {
                            return {
                                ...visit
                            };
                        });
                }
                const body = {
                    origin,
                    destination,
                    waypoints,
                    company_id: authData?.company_id
                };
                let res: any;
                if (routePlanningResume) {
                    res = await resumeRoute(authData);
                    handleRegion(res);
                    if (res?.closed_visits) {
                        setResumeCosedVisits(res?.closed_visits);
                    }
                } else {
                    res = await getOptimizedRoute(body, authData);
                    handleRegion(res);
                    await setStorageData(
                        ROUTE_PLANNING_RESUME_KEY,
                        JSON.stringify(true)
                    );
                }
                const resCopy = { ...res };
                let waypointsArranged = res?.waypoints.sort(
                    (a: TaskType, b: TaskType) => a?.priority - b?.priority
                );
                resCopy.waypoints = waypointsArranged;
                setData(resCopy);
            } catch (e: AxiosError) {
                const message =
                    e?.response?.data?.message ?? 'No route available';
                ToastAndroid.show(message, ToastAndroid.SHORT);
                navigation.canGoBack() && navigation.goBack();
            }
        })();
    }, [visits, handleRegion]);

    const getClosedVisitData = useCallback(() => {
        (async () => {
            try {
                const storageVisitsData = await getStorageData(
                    VISIT_COMPLETE_STORAGE_KEY
                );
                if (storageVisitsData) {
                    const d = await JSON.parse(storageVisitsData);
                    setCompletedVisitData(d);
                }
            } catch (error) {
                setCompletedVisitData({});
            }
        })();
    }, [setCompletedVisitData]);

    useFocusEffect(getClosedVisitData);

    const totalPoints = useMemo(() => {
        if (data?.waypoints && data.waypoints.length > 0) {
            return [...data?.waypoints, data?.destination] ?? [];
        }

        return data?.destination ? [data.destination] : [];
    }, [data]);

    const showConnecting = () => {
        setIsConnectingVisible(true);
        setInterval(() => {
            setIsConnectingVisible(false);
        }, 5000);
    };

    const c2c = async (number: string) => {
        const data = {
            To: number,
            From: authData?.mobile,
            applicant_type: focussedPoint.applicant_type,
            status: 'call_attempted'
        };
        try {
            const apiRepsonse = await callUser(
                selectedLoanData?.loan_id,
                selectedLoanData?.allocation_month,
                data.To,
                data.From,
                data.applicant_type,
                data.status,
                authData
            );
            showConnecting();
            navigation.navigate('DispositionFormScreen', {
                shootId: apiRepsonse?.data?.shoot_id ?? '',
                phoneNumber: data.To
            });
        } catch (e: any) {}
    };

    const onCallClicked = (item) => {
        if (!item.phone) {
            ToastAndroid.show('Phone number not found', ToastAndroid.SHORT);
            return;
        }
        setSelectedLoanData({ ...item });
        const phone = item?.phone?.split(',')[0] ?? [];
        const isC2CAvailable = callingModes.includes(
            CallingModeTypes.click_to_call
        );
        const isManualAvailable = callingModes.includes(
            CallingModeTypes.manual
        );
        if (isC2CAvailable && isManualAvailable) setCallModalNumber(phone);
        else if (isManualAvailable) startCall(phone);
        else if (isC2CAvailable) c2c(phone);
    };

    const onFocusCard = (item: TaskType) => {
        const points = totalPoints.filter(
            (point) => point.visit_id == item.visit_id
        );
        if (points && points.length > 0) {
            const point = points[0];
            setFocussedPoint(point);

            try {
                map?.current?.animateToRegion({
                    latitude: point.latitude - 0.14,
                    longitude: point.longitude,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5
                });
                markers?.current?.[point.visit_id]?.showCallout();
            } catch {}
        }
    };

    const onFocusMarker = (visit_id: number) => {
        const points = totalPoints.filter(
            (point) => point.visit_id == visit_id
        );
        if (points && points.length > 0) setFocussedPoint(points[0]);
    };

    const handleCallTypeSelect = (type: CallingModeTypes) => {
        const number = callModalNumber;
        if (type === CallingModeTypes.manual) startCall(number);
        if (type === CallingModeTypes.click_to_call) c2c(number);
        setCallModalNumber('');
    };

    const markersView = useMemo(() => {
        return (
            totalPoints &&
            totalPoints?.length > 0 &&
            totalPoints?.map((dest: any, index: number) => {
                const coordinate = {
                    latitude: dest.latitude,
                    longitude: dest.longitude
                };

                const isLast = index == totalPoints.length - 1;

                const isVisitCompleted = getAllClosedVisits.find(
                    (_visit) => _visit === dest.visit_id
                )
                    ? true
                    : false;

                const newPoints = [...totalPoints];
                let distance = 0;
                newPoints.slice(0, index + 1).forEach((d) => {
                    if (d.distance) {
                        distance += parseInt(
                            d?.distance?.split?.(' ')?.[0] ?? 0
                        );
                    }
                });

                const backgroundColor = isVisitCompleted
                    ? GREEN
                    : isLast
                    ? RED2
                    : BLUE_DARK;

                const markerText = dest.priority
                    ? dest.priority
                    : isLast
                    ? totalPoints.length
                    : '-';

                return (
                    <Marker
                        ref={(el) => (markers.current[dest.visit_id] = el)}
                        key={dest.visit_id}
                        identifier={dest.visit_id}
                        coordinate={coordinate}
                        title={dest.name}
                        description={`${distance} km`}
                        onPress={(e) => onFocusMarker(e.nativeEvent.id)}
                    >
                        <View style={styles.markerView}>
                            <Text
                                style={[
                                    styles.markerText,
                                    {
                                        backgroundColor
                                    }
                                ]}
                            >
                                {markerText}
                            </Text>
                        </View>
                    </Marker>
                );
            })
        );
    }, [totalPoints, completedVisitData, markers]);

    return (
        <>
            <CustomAppBar
                title="Planned Route"
                search={false}
                options={false}
                notifications={false}
                backButton={true}
                menuButton={false}
                filter={false}
                calendar={false}
                add={false}
                sort={false}
                clockInStatus={false}
                reminders={false}
                inverted={false}
                rightActionComponent={<FinishRouteButton />}
            />
            <ConnectingClickToCallModal visible={isConnectingVisible} />
            <CallTypeListModal
                visible={!!callModalNumber}
                hide={() => {
                    setCallModalNumber('');
                }}
                onTypeSelect={handleCallTypeSelect}
            />
            <MapView
                ref={map}
                showsUserLocation
                style={{ flex: 1 }}
                followsUserLocation
                showsMyLocationButton
                initialRegion={region}
                customMapStyle={MapStyle}
                provider={PROVIDER_GOOGLE}
            >
                <MapViewDirections
                    waypoints={(() => {
                        if (data?.waypoints?.length == 0) return [];
                        return data?.waypoints?.map((waypoint) => {
                            return {
                                latitude: waypoint?.latitude,
                                longitude: waypoint?.longitude
                            };
                        });
                    })()}
                    origin={data?.origin}
                    destination={data?.destination}
                    apikey={GOOGLE_MAPS_API_KEY}
                    strokeColor={BLUE_LIGHT}
                    strokeWidth={4}
                />
                {markersView}
            </MapView>
            <View style={styles.sliderContainer}>
                <VisitsSlider
                    completedVisitData={getAllClosedVisits}
                    selectedPoint={focussedPoint}
                    onCall={onCallClicked}
                    onFocus={onFocusCard}
                    visits={visits}
                    data={totalPoints ?? []}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        marginHorizontal: 4,
        padding: 4
    },
    markerText: {
        color: 'white',
        fontSize: RFPercentage(1.8),
        height: RFPercentage(2.6),
        textAlign: 'center',
        width: RFPercentage(2.6)
    },
    markerView: {
        alignItems: 'center',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        justifyContent: 'center'
    },
    sliderContainer: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0
    }
});
