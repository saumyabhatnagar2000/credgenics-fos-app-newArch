import moment from 'moment';
import React, {
    ForwardedRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState
} from 'react';
import { View } from 'react-native';
import { TimerRefType } from '../../../types';
import { DEPOSIT_TIMER_DURATION } from '../../constants/constants';
import { ProgressBar } from '../common/ProgressBar';
import Typography, {
    TypographyFontFamily,
    TypographyVariants
} from './Typography';

export const Timer = React.forwardRef(
    (props: any, ref: ForwardedRef<TimerRefType | null>) => {
        const { onTimeComplete } = props;
        const [currentTime, setCurrentTime] = useState(
            DEPOSIT_TIMER_DURATION * 60
        );
        const [stopTimer, setStopTimer] = useState(false);
        useEffect(() => {
            const timer = setInterval(() => {
                if (currentTime <= 0) {
                    //clearing timer after time is over
                    onTimeComplete();
                    clearInterval(timer);
                    return;
                }
                if (stopTimer) {
                    //stopping timer when app goes out of focus
                    clearInterval(timer);
                    return;
                }
                setCurrentTime((_timer) => _timer - 1);
            }, 1000);
            return () => clearInterval(timer);
        }, [currentTime, stopTimer]);

        useImperativeHandle(ref, () => ({
            resetTimer: () => setCurrentTime(DEPOSIT_TIMER_DURATION * 60),
            getTimePassed: () => currentTime,
            setUpdateTimer: (diffTime: number) => {
                //updating timer after app state changes from background to active
                setStopTimer(false);
                setCurrentTime((_prev) => {
                    return _prev - diffTime > 0 ? _prev - diffTime : 0;
                });
                //checking deposit status if difference is greater than one minute
                if (diffTime >= 60) {
                    onTimeComplete();
                }
            },
            stopTimer: () => setStopTimer(true)
        }));

        const getTimeInMinutes = useMemo(() => {
            return (
                `${moment.duration(currentTime, 'seconds').minutes()}:` +
                `0${moment.duration(currentTime, 'seconds').seconds()}`.slice(
                    -2
                )
            );
        }, [currentTime]);

        return (
            <View>
                <ProgressBar
                    progress={currentTime}
                    total={DEPOSIT_TIMER_DURATION * 60}
                    titleRequired={false}
                />
                <Typography
                    variant={TypographyVariants.body}
                    style={{
                        textAlign: 'center',
                        fontFamily: TypographyFontFamily.heavy
                    }}
                >
                    {getTimeInMinutes}
                    <Typography variant={TypographyVariants.caption1}>
                        {` Min`}
                    </Typography>
                </Typography>
            </View>
        );
    }
);
