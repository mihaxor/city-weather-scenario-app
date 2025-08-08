import express, {NextFunction, Request, Response} from 'express';
import createError from 'http-errors';
import path from 'path';
// import cors from 'cors';
// import helmet from 'helmet';
import logger from 'morgan';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const APP_PORT = process.env.PORT || process.env.EXPRESS_SERVER_PORT;

// app.use(helmet());

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
// }));

app.use(logger('short'));


app.get('/.well-known/live', (req: Request, res: Response) => {
    res.status(204).send();
});

app.get('/.well-known/ready', (req, res) => {
    res.status(204).send();
});

app.get('/.well-known/health', (req: Request, res: Response) => {
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