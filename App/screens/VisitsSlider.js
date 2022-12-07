import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { itemWidth, sliderWidth } from './styles/SliderEntry.style';
import styles, { colors } from './styles/index.style';
import LocationCard from './components/LocationCard';

export default function VisitsSlider({
    selectedPoint,
    data,
    visits,
    onCall,
    onFocus,
    completedVisitData
}) {
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef(null);

    useEffect(() => {
        if (!selectedPoint) return;
        data.forEach((element, index) => {
            if (element?.visit_id == selectedPoint?.visit_id)
                carouselRef?.current?.snapToItem(index);
        });
    }, [selectedPoint]);

    return (
        <View style={styles.exampleContainer}>
            <Carousel
                ref={carouselRef}
                data={data}
                renderItem={({ item, index }) => {
                    const filterV = visits[item.visit_id] ?? {};
                    return (
                        <LocationCard
                            onCall={onCall}
                            visit={filterV}
                            data={item}
                            even={(index + 1) % 2 === 0}
                            completedVisitData={completedVisitData}
                            allocation_month={item.allocation_month}
                        />
                    );
                }}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.7}
                containerCustomStyle={styles.slider}
                contentContainerCustomStyle={styles.sliderContentContainer}
                onSnapToItem={(index) => {
                    setActiveSlide(index);
                    onFocus?.(data[index]);
                }}
            />
            <Pagination
                dotsLength={data.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.paginationContainer}
                dotColor={'rgba(255, 255, 255, 0.92)'}
                dotStyle={styles.paginationDot}
                inactiveDotColor={colors.black}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                carouselRef={carouselRef}
                tappableDots={carouselRef.current}
            />
        </View>
    );
}
