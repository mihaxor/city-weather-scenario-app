import {BaseApi} from '@/app/BaseApi';
import {City} from '@/shared/store/cities/cities.types';

export const citiesInfoApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCities: builder.query<City[], void>({
            query: () => '/api/cities',
            providesTags: ['Cities']
        }),
        getCityById: builder.query<City, number>({
            query: (id) => `/api/cities/${id}`,
            providesTags: (_result, _error, id) => [{type: 'Cities', id}]
        }),
        getCitiesByName: builder.query<City[], string>({
            query: (name) => `/api/cities?cityName=${name}`,
            providesTags: ['Cities']
        }),
        addCity: builder.mutation<City, { name: string; country: string }>({
            query: (body) => ({
                url: '/api/cities',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Cities']
        }),
        deleteCity: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/api/cities/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cities']
        })
    }),
    overrideExisting: false
});

export const {
    useGetCitiesQuery,
    useGetCityByIdQuery,
    useGetCitiesByNameQuery,
    useAddCityMutation,
    useDeleteCityMutation
} = citiesInfoApi;