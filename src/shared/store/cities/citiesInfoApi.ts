import {BaseApi} from '@/app/BaseApi';
import {City, ResponseCity} from '@/shared/store/cities/cities.types';

export const citiesInfoApi = BaseApi.injectEndpoints({
    endpoints: builder => ({
        getCities: builder.query<City[], void>({
            query: () => '/cities',
            providesTags: ['Cities']
        }),
        getCitiesByName: builder.query<ResponseCity<City[]>, string>({
            query: (name) => `/cities?cityName=${name}`,
            providesTags: ['Cities']
        }),
        addCity: builder.mutation<ResponseCity<City>, { name: string; country: string }>({
            query: (body) => ({
                url: '/cities',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Cities']
        }),
        deleteCity: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/cities/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cities']
        })
    }),
    overrideExisting: false
});

export const {
    useGetCitiesQuery,
    useGetCitiesByNameQuery,
    useAddCityMutation,
    useDeleteCityMutation
} = citiesInfoApi;