import React from 'react';
import {Accordion, Col, Row, Spinner} from 'react-bootstrap';
import {City} from '@/shared/store/cities/cities.types';

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
                                <p><strong>Country:</strong> {city.country}</p>
                                <p><strong>State:</strong> {city.state}</p>
                                <p><strong>Description:</strong> {city.touristRating}</p>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Col>
        </Row>
    );
}

export default CityDetails;