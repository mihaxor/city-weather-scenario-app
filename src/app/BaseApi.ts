import {createApi} from '@reduxjs/toolkit/query/react';
import {fetchBaseQuery} from '@reduxjs/toolkit/query';

export const BaseApi = createApi({
    tagTypes: [
        'Cities'
    ],
    keepUnusedDataFor: 10,
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_APP_API_BASE_URL as string
    }),
    endpoints: () => ({})
});
