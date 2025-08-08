import {useGetCitiesByNameQuery} from '@/shared/store/cities/citiesInfoApi';

export const useCities = (cityName: string) => {
    const {
        data: cities,
        isLoading,
        isFetching,
        isError,
    } = useGetCitiesByNameQuery(cityName);

    const hasError = isError || (cities && 'error' in cities);
    const errorMessage = cities && 'error' in cities ? cities.error : undefined;
    const citiesData = cities ? cities.data || [] : [];

    return {
        cities: citiesData,
        isLoading: isLoading || isFetching,
        isError: hasError,
        errorMessage
    };
}