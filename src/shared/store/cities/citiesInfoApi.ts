import {BaseApi} from '@/app/BaseApi';
import {City, ResponseCity} from '@/shared/store/cities/cities.types';

export const citiesInfoApi = BaseApi.injectEndpoints({
    endpoints: builder => {
        return {
            getCities: builder.query<City[], void>({
                query: () => '/cities',
                providesTags: ['Cities']
            }),
            getCityById: builder.query<ResponseCity<City>, string | undefined>({
                // query: (id) => `/cities/${id}`,
                queryFn: async (id, _queryApi, _extraOptions, baseQuery) => {
                    const result = await baseQuery(`/cities/${id}`);
                    return result as { data: ResponseCity<City> } | { error: any };
                },
                providesTags: ['Cities']
            }),
            getCitiesByName: builder.query<ResponseCity<City[]>, string>({
                query: (name) => `/cities?cityName=${name}`,
                providesTags: ['Cities']
            }),
            addCity: builder.mutation<ResponseCity<City>, City>({
                query: (body) => ({
                    url: '/cities',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: ['Cities']
            }),
            updateCity: builder.mutation<ResponseCity<City>, Partial<City>>({
                query(data) {
                    const {id, ...body} = data;

                    return {
                        url: `cities/${id}`,
                        method: 'PUT',
                        body
                    }
                },
                invalidatesTags: (_result, _error, {id}) => [{type: 'Cities', id}],
            }),
            deleteCity: builder.mutation<{ message: string }, number>({
                query: (id) => ({
                    url: `/cities/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Cities']
            })
        };
    },
    overrideExisting: false
});

export const {
    useGetCitiesQuery,
    useGetCityByIdQuery,
    useGetCitiesByNameQuery,
    useAddCityMutation,
    useUpdateCityMutation,
    useDeleteCityMutation
} = citiesInfoApi;