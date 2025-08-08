import React from 'react';
import {Accordion, Col, Row, Spinner} from 'react-bootstrap';
import {City} from '@/shared/store/cities/cities.types';
import CityForecast from '@/shared/components/CityForecast';

interface CityDetailsProps {
    isLoading: boolean;
    isError: boolean | undefined;
    cities: City[] | undefined;
}

const CityDetails: React.FC<CityDetailsProps> = ({isLoading, isError, cities}) => {

    if (isLoading) return (
        <Row className='justify-content-center mt-5 pt-5'>
            <Col className='text-center'>
                <Spinner animation='border' variant='light' />
            </Col>
        </Row>)

    if (!cities || cities.length === 0 || isError) return null;

    console.log('CityDetails component cities:', cities);

    return (
        <Row className='justify-content-center mt-5'>
            <Col xs={12} md={8} lg={8}>
                <Accordion
                    // defaultActiveKey='0'
                >
                    {cities?.map((city, key) => (
                        <Accordion.Item key={key} eventKey={String(city.id)}>
                            <Accordion.Header>{city.name} - {city.state} - {Math.round(city.weather?.current?.temp as number)}°C</Accordion.Header>
                            <Accordion.Body>
                                <div className='city-details'>
                                    <p><strong>ID:</strong> {city.id || 'N/A'}</p>
                                    <p><strong>CityName:</strong> {city.name}</p>
                                    <p><strong>State:</strong> {city.state}</p>
                                    <p><strong>Country:</strong> {city.country}</p>
                                    <p><strong>Rating:</strong> {city.touristRating}/5</p>
                                    <p><strong>Timezone:</strong> {city.weather?.timezone}</p>

                                    <h5 className='mt-4'>Population</h5>
                                    <p><strong>Date established:</strong> {city.population.dateEstablished}</p>
                                    <p><strong>Estimated
                                        population:</strong> {city.population.estimated.toLocaleString()}
                                    </p>
                                    <CityForecast daily={city.weather?.daily}/>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Col>
        </Row>
    );
}

export default CityDetails;