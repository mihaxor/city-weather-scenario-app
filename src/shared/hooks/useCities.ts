import {useGetCitiesQuery} from '@/shared/store/cities/citiesInfoApi';

export const useCities = () => {
    const {data: cities, isLoading, isError} = useGetCitiesQuery();

    return {
        cities,
        isLoading,
        isError
    };
}