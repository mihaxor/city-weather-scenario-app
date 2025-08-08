import {
    useAddCityMutation,
    useDeleteCityMutation,
    useGetCitiesByNameQuery,
    useGetCityByIdQuery,
    useUpdateCityMutation
} from '@/shared/store/cities/citiesInfoApi';
import {City} from '@/shared/store/cities/cities.types';

export const useCities = (cityName: string, cityId?: string | undefined) => {
    const {
        data: cities,
        isLoading,
        isFetching,
        isError,
    } = useGetCitiesByNameQuery(cityName);

    const {data: cityById} = useGetCityByIdQuery(cityId, {
        skip: !cityId,
    });

    const [addCity, {isLoading: isAddingCity, isError: isAddError, error: addError}] = useAddCityMutation();
    const [deleteCity] = useDeleteCityMutation();
    const [updateCity] = useUpdateCityMutation();

    const hasError = isError || (cities && 'error' in cities);
    const errorMessage = cities && 'error' in cities ? cities.error : undefined;
    const citiesData = cities ? cities.data || [] : [];

    const handleAddCity = async (cityData: City) => {
        try {
            const cityPayload = {
                name: cityData.name,
                country: cityData.country,
                state: cityData.state,
                touristRating: cityData.touristRating,
                population: cityData.population
            };

            const result = await addCity(cityPayload).unwrap();

            return {success: true, data: result};
        } catch (error: any) {
            console.error('Error adding the city:', error);

            return {success: false, error: error?.data?.message || 'An error occurred'};
        }
    };

    return {
        cities: citiesData,
        cityById,
        isLoading: isLoading || isFetching,
        isError: hasError,
        errorMessage,
        addCity: handleAddCity,
        updateCity,
        deleteCity,
        isAddingCity,
        isAddError,
        addError
    };
}