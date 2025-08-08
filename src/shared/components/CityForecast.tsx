import {Table} from 'react-bootstrap';
import {DailyWeather} from '@/shared/store/cities/cities.types';
import React from 'react';

interface CityForecast {
    daily: DailyWeather[] | undefined
}

const CityForecast: React.FC<CityForecast> = ({daily}) => {

    const dayRow = ({daily}: CityForecast) =>
        daily?.map((day, key) => {
            const date = new Date(day.dt * 1000);
            const dayString = date.toLocaleDateString('en-US', {weekday: 'long'});

            return (
                <tr key={key}>
                    <td>{dayString}</td>
                    <td>{Math.round(day.temp.max)} / {Math.round(day.temp.min)} °C</td>
                    <td>{day.weather[0].description}</td>
                </tr>
            )
        })

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Day</th>
                <th>Temperature</th>
                <th>Weather</th>
            </tr>
            </thead>
            <tbody>
            {dayRow({daily})}
            </tbody>
        </Table>
    );
}

export default CityForecast;