import React, {useState} from 'react';
import {Button, Col, Form, InputGroup, Row} from 'react-bootstrap';
import {Search} from 'react-bootstrap-icons';
import CityDetails from '@/shared/components/CityDetails';
import {useCities} from '@/shared/hooks/useCities';
import {useNavigate} from 'react-router';
import {useDebounce} from '@/shared/hooks/useDebounce';

const CitySearch: React.FC = () => {
    const navigate = useNavigate();
    const [cityName, setCityName] = useState('');
    const debounceValue = useDebounce(cityName, 500);
    const {cities, isLoading, isError} = useCities(debounceValue);

    return (
        <>
            <Row className='justify-content-center mt-4'>
                <Col xs={12} md={8} lg={5}>
                    <div className='d-flex align-items-center gap-3'>
                        <Button variant='primary' className='flex-shrink-0'
                                onClick={() => navigate('/city')}>
                            Add City
                        </Button>
                        <InputGroup>
                            <InputGroup.Text>
                                <Search />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder='Search...  e.g. London'
                                aria-label='Search'
                                onChange={e => setCityName(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                </Col>
            </Row>
            <CityDetails cities={cities} isLoading={isLoading} isError={isError} />
        </>
    )
}

export default CitySearch;