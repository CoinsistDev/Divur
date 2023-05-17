import React, { useState } from 'react'
import { Button, Form, Grid, Header, Label, Message, Segment } from 'semantic-ui-react'
import { ErrorMessage, Formik } from 'formik'
import { useStore } from '../../../app/stores/store'
import useQurey from '../../../app/common/util/hooks';
import CustomTextInput from '../../../app/common/form/CustomTextInput';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

export default function ResetPasswordForm() {
    const email = useQurey().get('email') as string;
    const token = useQurey().get('token') as string;

    const { userStore } = useStore();
    const { resetPassword, sendResetPasswordMail } = userStore;
    const [success, setSuccess] = useState(false);

    const sendReserSchema = Yup.object({
        email: Yup.string().required("נא מלאו את כתובת המייל").email("נא הזינו מייל תקני")
    })


    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 400 }}>
                <Segment style={{ padding: '40px 50px' }}>
                    <Header as='h2' color='blue' textAlign='center'>
                        איפוס סיסמא
                    </Header>
                    {(!email && !token) ? (
                        <Formik
                            initialValues={{ email: '', error: null }}
                            enableReinitialize
                            validationSchema={sendReserSchema}
                            onSubmit={async (values, { setErrors }) => {

                                await sendResetPasswordMail(values.email).then(() => setSuccess(true)).catch(error => setErrors({ error: 'אימייל לא קיים במערכת' }))
                            }}
                        >
                            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (

                                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                    <CustomTextInput name='email' placeholder='Email' type='email' />
                                    <ErrorMessage
                                        name='error' render={() =>
                                            <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />}
                                    />
                                    <Button loading={isSubmitting}
                                        disabled={!isValid || !dirty}
                                        positive content='שלח' type='submit' fluid />

                                    {success && (
                                        <Message positive content='מייל לאיפוס סיסמא נשלח לכתובת המייל שלך.' />
                                    )}

                                </Form>

                            )}
                        </Formik>
                    ) : (
                        <Formik
                            initialValues={{ password: '', passwordConfirm: '', error: null }}
                            onSubmit={async (values, { setErrors }) => {
                                if (values.password !== values.passwordConfirm)
                                    setErrors({ error: 'הסיסמאות לא זהות' })
                                else
                                    await resetPassword(token, email, values.password).catch(error => setErrors({ error }))
                            }}
                        >
                            {({ handleSubmit, isSubmitting, errors, isValid, values }) => (

                                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                    <CustomTextInput name='password' placeholder='Password' type='password' />
                                    <CustomTextInput name='passwordConfirm' placeholder='Confirm password' type='password' />
                                    <ErrorMessage
                                        name='error' render={() =>
                                            <>
                                                <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />
                                                    <Link to='/wa/account/resetPassword'>לאיפוס סיסמא</Link>
                                                
                                            </>
                                        }
                                    />
                                    <Button loading={isSubmitting}
                                        disabled={!isValid || values.password !== values.passwordConfirm}
                                        positive content='שלח' type='submit' fluid />
                                    {success && (
                                        <Message positive content='הסיסמא אופסה בהצלחה' />
                                    )}


                                </Form>

                            )}
                        </Formik>
                    )}

                </Segment>
                <Message>
                    <Link to='/wa/login'>חזרה לעמוד ההתחברות</Link>
                </Message>
            </Grid.Column>

        </Grid>
    )
}
