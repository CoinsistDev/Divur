import { ErrorMessage, Form, Formik } from 'formik'
import { Button, Grid, Segment, Header, Label, Message } from 'semantic-ui-react'
import CustomTextInput from '../../app/common/form/CustomTextInput'
import { useStore } from '../../app/stores/store'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import * as Yup from 'yup';
export default observer(function LoginForm() {
  const { userStore } = useStore();
  const { login } = userStore;

  const validationSchema = Yup.object({
    email:Yup.string().email().required(),
    password:Yup.string().required()
  })

  return (

    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 400 }}>
        <Segment style={{ padding: '40px 50px' }}>
          <Header as='h2' color='blue' textAlign='center'>
            התחברות
          </Header>
            <Formik
            validationSchema={validationSchema}
              initialValues={{ email: '', password: '', error: null }}
              onSubmit={async (values, { setErrors }) => {
                await login({ email: values.email, password: values.password }).catch(error =>setErrors({ error: error }))
              }}
            >
              {({ handleSubmit, isSubmitting, errors, isValid,dirty }) => (

                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                  <CustomTextInput name='email' placeholder='Email' />
                  <CustomTextInput name='password' placeholder='Password' type='password' />
                  <ErrorMessage
                    name='error' render={() =>
                      <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />}
                  />
                  <Button disabled={isSubmitting || !isValid || !dirty} loading={isSubmitting} positive content='התחבר' type='submit' fluid />

                </Form>

              )}
            </Formik>  
        </Segment>
        <Message style={{direction:'rtl'}}>
         <Link to='/wa/account/resetPassword'>שכחת סיסמא?</Link>
        </Message>
        
      </Grid.Column>

    </Grid>



  )
}
)