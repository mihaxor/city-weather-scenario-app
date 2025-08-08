import express, {NextFunction, Request, Response, Router} from 'express';
import createError from 'http-errors';
import path from 'path';
// import cors from 'cors';
// import helmet from 'helmet';
import logger from 'morgan';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import {City, CityForecast, CityWeather, Geocodes, Population, ResponseType, Units} from './data.types';

const app = express();
const router = Router();
dotenv.config();
// app.use(helmet());

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
// }));

app.use(express.json());
app.use(logger('short'));

const APP_PORT = process.env.PORT || process.env.EXPRESS_SERVER_PORT;
const WEATHER_API = process.env.EXPRESS_SERVER_WEATHER_API || '';
const WEATHER_API_KEY = process.env.EXPRESS_SERVER_WEATHER_API_KEY || '';
const MAX_CITIES = 10;
const UNITS = 'metric' as Units;

const QUERY = {
    getCities: 'SELECT * FROM cities',
    getCityById: 'SELECT * FROM cities WHERE id = ?',
    getCityByName: 'SELECT * FROM cities WHERE name = ?',
    insertCity: 'INSERT INTO cities (name, state, country, touristRating, population) VALUES (?, ?, ?, ?, ?)',
    updateCity: 'UPDATE cities SET name = ?, state = ?, country = ?, touristRating = ?, population = ? WHERE id = ?',
    deleteCityById: 'DELETE FROM cities WHERE id = ?',
    deleteAllCities: 'DELETE FROM cities',
    countCities: 'SELECT COUNT(*) as count FROM cities',
}

const initDatabase = () => {
    const db = new Database('./cities.db');

    try {
        db.prepare(`
            CREATE TABLE IF NOT EXISTS cities
            (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                name          TEXT    NOT NULL,
                state         TEXT    NOT NULL,
                country       TEXT    NOT NULL,
                touristRating INTEGER NOT NULL CHECK (touristRating BETWEEN 1 AND 5),
                population    TEXT    NOT NULL
            )`
        ).run();
    } catch (err) {
        console.error('Error creating database table:', err);
    }
    return db;
}

const db = initDatabase();

const getWeatherAndForecastsByGeocodes = async (coord: Geocodes): Promise<CityForecast> => {
    const prepareUrl = `${WEATHER_API}/onecall?lat=${coord.lat}&lon=${coord.lon}&units=${UNITS}`;

    console.log(`Fetching forecast data from: ${prepareUrl}`);

    const response = await fetch(`${prepareUrl}&appid=${WEATHER_API_KEY}`);
    const data = await response.json() as CityForecast;

    if (response.status != 200 || !data) throw new Error(`No weather data found for coordinates: ${coord.lat}, ${coord.lon}`);

    return data;
}

const getWeatherAndGeocodesByCity = async (cityName: string): Promise<CityWeather> => {
    const prepareUrl = `${WEATHER_API}/find?q=${cityName}&units=${UNITS}`;

    console.log(`Fetching forecast data for city: ${cityName} from: ${prepareUrl}`);

    const response = await fetch(`${prepareUrl}&appid=${WEATHER_API_KEY}`);
    const data = await response.json() as CityWeather;

    if (response.status != 200 || !data) throw new Error(`No weather data found for city: ${cityName}`);

    return data;
}

// app.get('/cities', (_req: Request, res: Response<City[]>) => {
//     const st = db.prepare(QUERY.getCities);
//     const rows = st.all();
//
//     return res.json(rows as City[]);
// });

router.get('/cities', async (req: Request<object, object, object, {
    cityName?: string
}>, res: ResponseType<City[]>) => {
    const {cityName} = req.query;

    if (cityName) {
        const rows = db.prepare(QUERY.getCityByName).all(cityName) as City[] | undefined;

        if (!rows || rows.length === 0) return res.status(200).json({message: 'City not found.', data: []});

        const data = await Promise.all(
            rows.map(async (row) => {
                const cityWeather = await getWeatherAndGeocodesByCity(row.name);
                const population = JSON.parse(row.population as unknown as string) as Population;
                console.log(`Weather data for city ${row.name}:`, cityWeather);

                const matchedCountry = cityWeather.list.find((item) => item.sys.country === row.state.toUpperCase());

                if (cityWeather && matchedCountry) {
                    const forecast = await getWeatherAndForecastsByGeocodes(matchedCountry.coord);
                    console.log(`Weather and forecast data for city ${row.name}:`, {
                        lat: forecast.lat,
                        lon: forecast.lon,
                        timezone: forecast.timezone,
                    });

                    return {
                        ...row,
                        population,
                        weather: forecast,
                    };
                }

                return row;
            })
        );

        return res.json({message: 'Successfully getting the weather and forecast.', data});
    }

    if (cityName?.length === 0) {
        return res.status(200).json({message: 'City name cannot be empty.'});
    }

    const st = db.prepare(QUERY.getCities);
    const rows = st.all();

    return res.json(rows as City[]);
});

router.post('/cities', (req: Request<object, object, City>, res: ResponseType<City>) => {
    const {name, state, country, touristRating, population} = req.body;

    if (!name || !state || !country || !touristRating || !population)
        return res.status(200).json({message: 'Name, state, country, touristRating, population is required.'});

    const st = db.prepare(QUERY.getCities);
    const rows = st.all() as City[];

    if (rows.length + 1 > MAX_CITIES) return res.status(400).json({message: 'You can only add up to 10 cities.'});

    const insertSt = db.prepare(QUERY.insertCity);
    const result = insertSt.run(name, state, country, touristRating, JSON.stringify(population));

    if (result.changes === 0) return res.status(500).json({message: 'Failed to insert city.'});

    return res.status(201).send();
});

router.put('/cities/:id', (req: Request<{ id: string }, object, Partial<City>>, res: ResponseType<City>) => {
    const {id} = req.params;
    const {name, state, country, touristRating, population} = req.body;

    const city = db.prepare(QUERY.getCityById).get(id) as City | undefined;

    if (!city) return res.status(404).json({message: 'City not found.'});

    db.prepare(QUERY.updateCity).run(
        name ?? city?.name,
        state ?? city?.state,
        country ?? city?.country,
        touristRating ?? city?.touristRating,
        population ? JSON.stringify(population) : city?.population,
        id);

    const updated = db.prepare(QUERY.getCityById).get(id) as City;

    return res.json(updated);
});

router.delete('/cities/:id', (req: Request<{ id: string }>, res: ResponseType<City>) => {
    const {id} = req.params;

    const city = db.prepare(QUERY.getCityById).get(id) as City | undefined;

    if (!city) return res.status(404).json({message: 'City not found.'});

    db.prepare(QUERY.deleteCityById).run(id);

    return res.json({message: 'Deleted successfully.', data: city});
});

router.delete('/cities', (_req: Request, res: Response<{ message: string }>) => {
    const st = db.prepare(QUERY.deleteAllCities).run();
    const message = st.changes > 0 ? 'All cities deleted successfully.' : 'No cities to delete.';

    return res.json({message});
});

router.get('/.well-known/live', (_req: Request, res: Response) => {
    res.status(204).send();
});

router.get('/.well-known/ready', (_req, res) => {
    res.status(204).send();
});

router.get('/.well-known/health', (_req: Request, res: Response) => {
    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || 'unknown',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        },
        pid: process.pid
    };

    res.status(200).json(healthData);
});

app.use('/api', router);
app.use(express.static(path.join(__dirname, '../../build')));

app.get('{*splat}', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

app.use((req: Request, _res: Response, next: NextFunction) => {
    const error = createError(404, `Route ${req.originalUrl} not found`);
    next(error);
});

app.listen(APP_PORT, () => {
    console.log('Server running on port: ', APP_PORT);
});