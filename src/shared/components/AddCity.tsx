import React from 'react';
import * as formik from 'formik';
import {bool, object, string} from 'yup';
import {Button, Col, Form, InputGroup, Row} from 'react-bootstrap';
import {useNavigate} from 'react-router';

const AddCity: React.FC = () => {
    const {Formik} = formik;
    const schema = object().shape({
        firstName: string().required(),
        lastName: string().required(),
        username: string().required(),
        city: string().required(),
        state: string().required(),
        zip: string().required(),
        terms: bool().required().oneOf([true], 'Terms must be accepted'),
    });

    const navigate = useNavigate();

    return (
        <Row className='justify-content-center mt-4'>
            <Col xs={12} md={8} lg={6}>
                <Formik
                    validationSchema={schema}
                    onSubmit={console.log}
                    initialValues={{
                        firstName: 'Mark',
                        lastName: 'Otto',
                        username: '',
                        city: '',
                        state: '',
                        zip: '',
                        terms: false,
                    }}
                >
                    {({handleSubmit, handleChange, values, touched, errors}) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row className='mb-3'>
                                <Form.Group as={Col} md='4' controlId='validationFormik01'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>First name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='firstName'
                                        value={values.firstName}
                                        onChange={handleChange}
                                        isValid={touched.firstName && !errors.firstName}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md='4' controlId='validationFormik02'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>Last name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='lastName'
                                        value={values.lastName}
                                        onChange={handleChange}
                                        isValid={touched.lastName && !errors.lastName}
                                    />

                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md='4' controlId='validationFormikUsername'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>Username</Form.Label>
                                    <InputGroup hasValidation>
                                        <InputGroup.Text id='inputGroupPrepend'>@</InputGroup.Text>
                                        <Form.Control
                                            type='text'
                                            placeholder='Username'
                                            aria-describedby='inputGroupPrepend'
                                            name='username'
                                            value={values.username}
                                            onChange={handleChange}
                                            isInvalid={!!errors.username}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                            <Row className='mb-3'>
                                <Form.Group as={Col} md='6' controlId='validationFormik03'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>City</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='City'
                                        name='city'
                                        value={values.city}
                                        onChange={handleChange}
                                        isInvalid={!!errors.city}
                                    />

                                    <Form.Control.Feedback type='invalid'>
                                        {errors.city}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md='3' controlId='validationFormik04'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>State</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='State'
                                        name='state'
                                        value={values.state}
                                        onChange={handleChange}
                                        isInvalid={!!errors.state}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.state}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md='3' controlId='validationFormik05'>
                                    <Form.Label style={{textAlign: 'left', display: 'block'}}>Zip</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Zip'
                                        name='zip'
                                        value={values.zip}
                                        onChange={handleChange}
                                        isInvalid={!!errors.zip}
                                    />

                                    <Form.Control.Feedback type='invalid'>
                                        {errors.zip}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Col className='d-flex justify-content-center gap-3 mt-5'>
                                <Button type='button' variant='outline-primary'
                                        onClick={() => navigate('/')}>Back</Button>
                                <Button type='submit'>Save City</Button>
                            </Col>
                        </Form>
                    )}
                </Formik>
            </Col>
        </Row>
    );

}

export default AddCity;