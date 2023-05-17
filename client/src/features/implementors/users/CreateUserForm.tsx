import { useState } from 'react'
import { Grid } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite'
import * as Yup from 'yup';
export default observer(function CreateUserForm() {
    const { userStore } = useStore();
    const { register } = userStore;
    const [success,setSuccess] = useState(false);
    const phoneRegExp = /^\+?(972)(\-)?0?(([23489]{1}\d{7})|[5]{1}\d{8})$/;

    const validationSchema = Yup.object({
        email: Yup.string().required("שדה אימייל הינו חובה").email("נא הזינו אימייל תקין"),
        phone: Yup.string().required().matches(phoneRegExp,"נא הזינו מספר תקין המתחיל ב 972"),
        name: Yup.string().required("נא הזינו שם")
    })

    return (

        <Grid textAlign='center' style={{ height: '100vh',marginLeft:'150px' }} verticalAlign='middle'>
            {/* <Grid.Column style={{ maxWidth: 400 }}>
                <Segment style={{ padding: '40px 50px' }}>
                    <Header as='h2' color='blue' textAlign='center'>
                        הוספת משתמש
                    </Header>
                    <Formik
                        validationSchema={validationSchema}
                        initialValues={{ email: '', name: '', phone: '', error: null }}
                        onSubmit={async (values, { setErrors }) => {
                            await register({ email: values.email, displayName: values.name,userName: values.name, phone: values.phone }).then(() => setSuccess(true)).catch(error => setErrors({ error: 'אחד מהפרטים שהוזנו לא תקין' }))
                        }}
                    >
                        {({ handleSubmit, isSubmitting,dirty, errors, isValid }) => (

                            <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                <CustomTextInput name='email' placeholder='Email' />
                                <CustomTextInput name='name' placeholder='Display name' />
                                <CustomTextInput name='phone' placeholder='Phone number' type='tel' />
                                <ErrorMessage
                                    name='error' render={() =>
                                        <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />}
                                />
                                {success && <Message positive content='המשתמש נוצר בהצלחה'/>}
                                
                                <Button loading={isSubmitting}
                                    disabled={!isValid||!dirty}
                                    positive content='הוספה' type='submit' fluid />

                            </Form>

                        )}
                    </Formik>
                </Segment>
            </Grid.Column> */}

        </Grid>



    )
}
)