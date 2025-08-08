import express, {NextFunction, Request, Response} from 'express';
import createError from 'http-errors';
import path from 'path';
// import cors from 'cors';
// import helmet from 'helmet';
import logger from 'morgan';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';

const app = express();
dotenv.config();

const APP_PORT = process.env.PORT || process.env.EXPRESS_SERVER_PORT;
const MAX_CITIES = 10;

// app.use(helmet());

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
// }));

app.use(express.json());
app.use(logger('short'));

interface City {
    id?: number;
    name: string;
    country: string;
}

const QUERY = {
    getCities: 'SELECT * FROM cities',
    getCityById: 'SELECT * FROM cities WHERE id = ?',
    insertCity: 'INSERT INTO cities (name, country) VALUES (?, ?)',
    updateCity: 'UPDATE cities SET name = ?, country = ? WHERE id = ?',
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
                id      INTEGER PRIMARY KEY AUTOINCREMENT,
                name    TEXT NOT NULL,
                country TEXT NOT NULL
            )`
        ).run();
    } catch (err) {
        console.error('Error creating database table:', err);
    }
    return db;
}

const db = initDatabase();

app.get('/cities', (_req: Request, res: Response<City[]>) => {
    const st = db.prepare(QUERY.getCities);
    const rows = st.all();

    return res.json(rows as City[]);
});

app.post('/cities', (req: Request<object, object, City>, res: Response<City | { error: string }>) => {
    const {name, country} = req.body;

    if (!name || !country) return res.status(400).json({error: 'Name and country required.'});

    const st = db.prepare(QUERY.getCities);
    const rows = st.all() as City[];

    if (rows.length + 1 > MAX_CITIES) return res.status(400).json({error: 'You can only add up to 10 cities.'});

    const insertSt = db.prepare(QUERY.insertCity);
    const result = insertSt.run(name, country);

    if (result.changes === 0) return res.status(500).json({error: 'Failed to insert city.'});

    return res.status(201).send();
});

app.put('/cities/:id', (req: Request<{ id: string }, object, Partial<City>>, res: Response<City | {
    error: string
}>) => {
    const {id} = req.params;
    const {name, country} = req.body;

    const city = db.prepare(QUERY.getCityById).get(id) as City | undefined;

    if (!city) return res.status(404).json({error: 'City not found.'});

    db.prepare(QUERY.updateCity).run(name ?? city?.name, country ?? city?.country, id);

    const updated = db.prepare(QUERY.getCityById).get(id) as City;

    return res.json(updated);
});

app.delete('/cities/:id', (req: Request<{ id: string }>, res: Response<{ message: string; city?: City } | {
    error: string
}>) => {
    const {id} = req.params;

    const city = db.prepare(QUERY.getCityById).get(id) as City | undefined;

    if (!city) return res.status(404).json({error: 'City not found.'});

    db.prepare(QUERY.deleteCityById).run(id);

    return res.json({message: 'Deleted successfully.', city});
});

app.delete('/cities', (_req: Request, res: Response<{ message: string }>) => {
    const st = db.prepare(QUERY.deleteAllCities).run();
    const message = st.changes > 0 ? 'All cities deleted successfully.' : 'No cities to delete.';

    return res.json({message});
});

app.get('/.well-known/live', (_req: Request, res: Response) => {
    res.status(204).send();
});

app.get('/.well-known/ready', (_req, res) => {
    res.status(204).send();
});

app.get('/.well-known/health', (_req: Request, res: Response) => {
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