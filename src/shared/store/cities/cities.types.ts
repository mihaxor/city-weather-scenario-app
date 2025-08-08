interface ResponseCity<T> {
    message: string;
    data?: T
}

interface DailyWeather {
    clouds: number;
    dew_point: number;
    dt: number;
    feels_like: {
        day: number;
        night: number;
        eve: number;
        morn: number;
    };
    humidity: number;
    moon_phase: number;
    moonrise: number;
    moonset: number;
    pop: number;
    pressure: number;
    sunrise: number;
    sunset: number;
    temp: {
        day: number;
        eve: number;
        max: number;
        min: number;
        morn: number;
        night: number;
    };
    uvi: number;
    weather: Weather[];
    wind_deg: number;
    wind_gust: number;
    wind_speed: number;
}

interface Weather {
    id: number,
    main: string,
    description: string,
    icon: string
}

interface CityForecast {
    lat: number,
    lon: number,
    timezone: string,
    timezone_offset: number,
    current: {
        dt: number,
        sunrise: number,
        sunset: number,
        temp: number,
        feels_like: number,
        pressure: number,
        humidity: number,
        dew_point: number,
        uvi: number,
        clouds: number,
        visibility: number,
        wind_speed: number,
        wind_deg: number,
        weather: Weather[]
    },
    minutely: object,
    hourly: object,
    daily: DailyWeather[]
}

interface Population {
    dateEstablished: string;
    estimated: number;
}

interface City {
    id?: number;
    name: string;
    state: string,
    country: string;
    touristRating: number;
    population: Population;
    weather?: CityForecast;
}

export type {
    City,
    CityForecast,
    Population,
    Weather,
    ResponseCity,
    DailyWeather
}