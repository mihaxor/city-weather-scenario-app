import {Response} from 'express';

interface City {
    id?: number;
    name: string;
    country: string;
    weather?: CityForecast;
}

type ResponseType<T> = Response<T | { message: string; data?: T } | { error: string }>
type Units = 'metric' | 'imperial' | 'standard';

interface Geocodes {
    lat: number;
    lon: number;
}

interface Wind {
    speed: number,
    deg: number
}

interface Weather {
    id: number,
    main: string,
    description: string,
    icon: string
}

interface WeatherMainBlock {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number,
    sea_level: number,
    grnd_level: number
}

interface WeatherBlock {
    id: number,
    name: string,
    coord: Geocodes,
    main: WeatherMainBlock,
    dt: number,
    wind: Wind,
    sys: {
        country: string
    },
    rain: null,
    snow: null,
    clouds: {
        all: 0
    },
    weather: Weather[],
}

interface CityWeather {
    message: string,
    cod: string,
    count: number,
    list: WeatherBlock[]
}

interface CityForecast {
    'lat': number,
    'lon': number,
    'timezone': string,
    'timezone_offset': number,
    'current': {
        'dt': number,
        'sunrise': number,
        'sunset': number,
        'temp': number,
        'feels_like': number,
        'pressure': number,
        'humidity': number,
        'dew_point': number,
        'uvi': number,
        'clouds': number,
        'visibility': number,
        'wind_speed': number,
        'wind_deg': number,
        'weather': Weather[]
    },
    minutely: object,
    hourly: object,
    daily: object
}


export type {
    ResponseType,
    Units,
    Geocodes,
    Wind,
    Weather,
    WeatherMainBlock,
    WeatherBlock,
    City,
    CityWeather,
    CityForecast
}