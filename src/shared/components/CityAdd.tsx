import React, {useState} from 'react';
import * as formik from 'formik';
import {number, object, string} from 'yup';
import {Button, Col, Form, InputGroup, Row, Spinner} from 'react-bootstrap';
import {useNavigate, useParams} from 'react-router';
import {Star, StarFill} from 'react-bootstrap-icons';
import {useCities} from '@/shared/hooks/useCities';
import {toast} from 'react-toastify';

interface StartRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
}

interface CityFormValues {
    name: string;
    state: string;
    country: string;
    touristRating: number;
    estimated: number;
    dateEstablished: string;
}

const CityAdd: React.FC = () => {
    const {Formik} = formik;
    const schema = object().shape({
        name: string().required(),
        state: string().required(),
        country: string().required(),
        touristRating: number().required().min(1).max(5),
        estimated: number().required(),
        dateEstablished: string().required()
    });
    const {cityId} = useParams();

    const navigate = useNavigate();
    const {addCity, isAddingCity, isAddError, cityById, updateCity} = useCities('', cityId);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const getInitialValues = () => {
        if (cityById?.data && cityId) {
            const cityData = cityById.data;
            return {
                name: cityData.name || '',
                state: cityData.state || '',
                country: cityData.country || '',
                touristRating: cityData.touristRating || 1,
                estimated: cityData.population?.estimated || 2400000,
                dateEstablished: cityData.population?.dateEstablished || '2025-01-01'
            };
        }

        return {
            name: '',
            state: '',
            country: '',
            touristRating: 1,
            estimated: 2400000,
            dateEstablished: '2025-01-01'
        };
    };

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

    const messageComp = (submitMessage: string | null, submitError: string | null, isAddError: boolean) => {
        if (submitMessage) {
            return (
                <div className='alert alert-success mt-3' role='alert'>
                    {submitMessage}
                </div>
            );
        }
        return (isAddError || submitError) && (
            <div className='alert alert-danger mt-3' role='alert'>
                {submitError || 'An error occurred while saving the city. Please try again.'}
            </div>
        )
    }

    const handleSubmit = async (values: CityFormValues, {
        setSubmitting,
        resetForm
    }: formik.FormikHelpers<CityFormValues>) => {
        if (cityId && cityById?.data) {
            const result = updateCity({
                id: Number(cityId),
                name: values.name,
                state: values.state,
                country: values.country,
                touristRating: values.touristRating,
                population: {
                    estimated: values.estimated,
                    dateEstablished: values.dateEstablished
                }
            })

            if (result) {
                console.log('City has been updated', result);
                setSubmitMessage('City has been updated successfully!');
                toast.success(`City ${values.name} has been updated successfully!`, {theme: 'dark'});

                resetForm();
                navigate('/city');
            }
        } else {
            try {
                const population = {
                    estimated: values.estimated,
                    dateEstablished: values.dateEstablished
                };
                const result = await addCity({...values, population});

                if (result.success) {
                    console.log('City has been added', result.success, values);
                    setSubmitMessage('City has been added successfully!');
                    toast.success('City has been added successfully!', {theme: 'dark'});

                    resetForm();
                } else {
                    setSubmitError(result.error || 'An error occurred while adding the city.');
                    toast.error(result.error, {theme: 'dark'});
                    resetForm();
                }
            } catch (error) {
                console.error('Error adding the city:', error);
            } finally {
                setSubmitting(false);
            }
        }
    }

    return (
        <Row className='justify-content-center mt-4'>
            <Col xs={12} md={8} lg={6}>
                <Formik
                    enableReinitialize={true}
                    validationSchema={schema}
                    onSubmit={async (values, {setSubmitting, resetForm}) =>
                        handleSubmit(values, {setSubmitting, resetForm} as formik.FormikHelpers<CityFormValues>)}
                    initialValues={getInitialValues()}>
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
                                            isValid={touched.dateEstablished && !errors.dateEstablished}
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
                            {messageComp(submitMessage, submitError, isAddError)}
                            <Col className='d-flex justify-content-center gap-3 mt-5'>
                                <Button type='button' variant='outline-primary'
                                        onClick={() => navigate('/')}>Back</Button>
                                <Button
                                    type='submit'
                                    className='d-flex gap-2 align-items-center'
                                    variant={cityId && cityById ? 'warning' : 'primary'}
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
                                    {cityId && cityById ? 'Update City' : 'Save City'}
                                </Button>
                            </Col>
                        </Form>
                    )}
                </Formik>
            </Col>
        </Row>
    );

}

export default CityAdd;