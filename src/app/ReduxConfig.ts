import {configureStore} from '@reduxjs/toolkit';
import {BaseApi} from '@/app/BaseApi';
import {citiesReducer} from '@/shared/store';

const isProduction = process.env.NODE_ENV === 'production';
const Store = configureStore({
    devTools: !isProduction,
    reducer: {
        cities: citiesReducer,
        [BaseApi.reducerPath]: BaseApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware()
        .concat([BaseApi.middleware])
})

export type IRootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;
