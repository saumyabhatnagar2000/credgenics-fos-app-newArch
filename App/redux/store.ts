import { combineReducers, configureStore, AnyAction } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import counterSlice from './counterSlice';
import portfolioSlice from './portfolioSlice';
import taskSlice from './taskSlice';
import configSlice from './configSlice';
import commonSlice from './commonSlice';
import loanDetailSlice from './loanDetailSlice';
import offlineVisitDataSlice from './offlineVisitDataSlice';

const appReducer = combineReducers({
    counter: counterSlice,
    portfolio: portfolioSlice,
    task: taskSlice,
    config: configSlice,
    loanDetail: loanDetailSlice,
    common: commonSlice,
    offlineVisitData: offlineVisitDataSlice
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};
const rootReducer = (state: any, action: AnyAction) => {
    if (action.type == 'LOGOUT') {
        state.config = undefined;
    }
    return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false,immutableCheck: { warnAfter: 128 } })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
