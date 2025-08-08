import React, {useState} from 'react';
import * as formik from 'formik';
import {number, object, string} from 'yup';
import {Button, Col, Form, InputGroup, Row, Spinner} from 'react-bootstrap';
import {useNavigate} from 'react-router';
import {Star, StarFill} from 'react-bootstrap-icons';
import {useCities} from '@/shared/hooks/useCities';

interface StartRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
}

const AddCity: React.FC = () => {
    const {Formik} = formik;
    const schema = object().shape({
        name: string().required(),
        state: string().required(),
        country: string().required(),
        touristRating: number().required().min(1).max(5),
        estimated: number().required(),
        dateEstablished: string().required()
    });

    const navigate = useNavigate();
    const {addCity, isAddingCity, isAddError} = useCities('');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const StarRating: React.FC<StartRatingProps> = ({rating, onRatingChange}) =>
        (
            <div className='d-flex gap-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => onRatingChange(star)}
                        style={{cursor: 'pointer', fontSize: '1.5rem'}}
                        className='text-warning'
                    >
                        {star <= rating ? <StarFill /> : <Star />}
                    </span>
                ))}
            </div>
        );

    return (
        <Row className='justify-content-center mt-4'>
            <Col xs={12} md={8} lg={6}>
                <Formik
                    validationSchema={schema}
                    onSubmit={async (values, {setSubmitting, resetForm}) => {
                        try {
                            const population = {
                                estimated: values.estimated,
                                dateEstablished: values.dateEstablished
                            };
                            const result = await addCity({...values, population});

                            if (result.success) {
                                console.log('City has been added', result.success, values);

                                resetForm();
                            } else {
                                setSubmitError(result.error || 'An error occurred while adding the city.');
                            }
                        } catch (error) {
                            console.error('Error adding the city:', error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                    initialValues={{
                        name: '',
                        state: '',
                        country: '',
                        touristRating: 1,
                        estimated: 2400000,
                        dateEstablished: '2025-01-01'
                    }}
                >
                    {({handleSubmit, handleChange, setFieldValue, values, touched, errors}) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row className='mb-3'>
                                <Form.Group as={Col} md='4' controlId='validationFormCityName'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>City Name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='name'
                                        placeholder='e.g. Bucharest'
                                        value={values.name}
                                        onChange={handleChange}
                                        isValid={touched.name && !errors.name}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md='3' controlId='validationFormState'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>State</Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='state'
                                        placeholder='e.g. RO'
                                        value={values.state}
                                        onChange={handleChange}
                                        isValid={touched.state && !errors.state}
                                    />

                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md='4' controlId='validationFormCountry'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>Country</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type='text'
                                            placeholder='e.g. Romania'
                                            name='country'
                                            value={values.country}
                                            onChange={handleChange}
                                            isValid={touched.country && !errors.country}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                            <Row className='mb-3'>
                                <Form.Group as={Col} md='7' className='me-3' controlId='validationFormPopulation'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>Population</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type='text'
                                            placeholder='e.g. 2000000'
                                            name='estimated'
                                            value={values.estimated}
                                            onChange={handleChange}
                                            isValid={touched.estimated && !errors.estimated}
                                        />
                                        <Form.Control
                                            type='date'
                                            name='dateEstablished'
                                            value={values.dateEstablished}
                                            onChange={handleChange}
                                            isValid={touched.estimated && !errors.estimated}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col} md='4' controlId='validationFormRating'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>Rating</Form.Label>
                                    <StarRating
                                        rating={values.touristRating}
                                        onRatingChange={(rating) => setFieldValue('touristRating', rating)}
                                    />
                                    {errors.touristRating && touched.touristRating && (
                                        <div className='text-danger mt-1'>{errors.touristRating}</div>
                                    )}
                                </Form.Group>
                            </Row>
                            {(isAddError || submitError) && (
                                <div className='alert alert-danger mt-3' role='alert'>
                                    {submitError || 'An error occurred while saving the city. Please try again.'}
                                </div>
                            )}
                            <Col className='d-flex justify-content-center gap-3 mt-5'>
                                <Button type='button' variant='outline-primary'
                                        onClick={() => navigate('/')}>Back</Button>
                                <Button
                                    type='submit'
                                    className='d-flex gap-2 align-items-center'
                                    disabled={isAddingCity}
                                >
                                    {isAddingCity && (
                                        <Spinner
                                            as='span'
                                            animation='border'
                                            size='sm'
                                            role='status'
                                            aria-hidden='true'
                                        />
                                    )}
                                    Save City
                                </Button>
                            </Col>
                        </Form>
                    )}
                </Formik>
            </Col>
        </Row>
    );

}

export default AddCity;