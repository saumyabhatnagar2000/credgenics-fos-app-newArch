import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { Mixpanel } from 'mixpanel-react-native';
import { MIXPANEL_TOKEN } from '../config/ApiKeys';
import config from '../config';
import { AppStateTypes } from '../../enums';
import * as Sentry from '@sentry/browser';

const MixpanelContext = React.createContext();

export const useMixpanel = () => React.useContext(MixpanelContext);

export const MixpanelProvider = ({ children }) => {
    const trackAutomaticEvents = true;
    const [mixpanel, setMixpanel] = React.useState(null);
    const appState = React.useRef(AppState.currentState);

    React.useEffect(() => {
        if (config.ENV === 'production') {
            const mixpanelInstance = new Mixpanel(
                MIXPANEL_TOKEN,
                trackAutomaticEvents
            );
            mixpanelInstance.init();
            setMixpanel(mixpanelInstance);
        }
    }, []);

    const logEvent = React.useCallback(
        (event, category = '', others = {}) => {
            mixpanel?.track(event, {
                category,
                ...others
            });
        },
        [mixpanel]
    );

    useEffect(() => {
        const logAppStateEvent = (nextAppState = '') => {
            if (nextAppState === 'active') {
                logEvent(AppStateTypes.back_to_focus);
            }
            appState.current = nextAppState;
            if (nextAppState === 'background') {
                logEvent(AppStateTypes.out_of_focus);
            }
        };

        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                logAppStateEvent(nextAppState);
            }
        );
        return () => {
            subscription.remove();
        };
    }, [logEvent]);

    const identify = React.useCallback(
        (userdata) => {
            const { user_id, mobile, name, assigned_companies, email } =
                userdata;
            mixpanel?.identify(user_id);
            if (mobile && mobile.length > 0)
                mixpanel?.people.set({ $phone: mobile });
            if (email && email.length > 0) {
                Sentry.setUser({ email, user_id });
                mixpanel?.people.set({ $email: email });
            }
            if (name && name.length > 0) {
                mixpanel?.people.set({ $first_name: name });
            }
            if (assigned_companies && assigned_companies.length > 0) {
                mixpanel?.people.set({ company_id: assigned_companies });
            }
        },
        [mixpanel]
    );

    return (
        <MixpanelContext.Provider value={{ mixpanel, logEvent, identify }}>
            {children}
        </MixpanelContext.Provider>
    );
};
