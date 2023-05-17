import { useState } from 'react'
import { Form, Formik } from 'formik'
import { Button, Grid, Segment, Header, Message } from 'semantic-ui-react'
import CustomTextInput from '../../../app/common/form/CustomTextInput'
import CustomFieldArea from '../../../app/common/form/CustomFieldArea'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite'
import * as Yup from 'yup';
import { DepartmentFormValues } from '../../../app/models/department'
export default observer(function CreateDepartmentForm() {
    const { departmentStore } = useStore();
    const { createDepartment, loading } = departmentStore;
    const [success, setSuccess] = useState(false);
    const [error, addError] = useState('');

    const validationSchema = Yup.object({
        name: Yup.string().required("שדה שם הינו חובה"),
        remainingMessages: Yup.number().required().min(100),
        remainingSMSMessages: Yup.number().required().min(0),
        apiKey: Yup.string(),
        apiSecret: Yup.string().required("נא הזינו Api Secret"),
        userName: Yup.string().email('נא הזינו אימייל תקין'),
        users: Yup.array()
            .of(
                Yup.object().shape({
                    email: Yup.string().email("נא הזינו אימייל תקין")
                        .required("נא הזינו אימייל")
                })
            ),
    })
    return (

        <Grid textAlign='center' style={{ height: '100vh', marginLeft: '150px', direction: 'rtl' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 500 }}>
                <Segment style={{ padding: '40px 50px' }}>
                    <Header as='h2' color='blue' textAlign='center'>
                        הוספת מחלקה
                    </Header>
                    <Formik
                        enableReinitialize
                        validationSchema={validationSchema}
                        initialValues={new DepartmentFormValues()}
                        onSubmit={async (values, { setErrors }) => {
                            values = {
                                ...values,
                                id: values.apiKey
                            }
                                if(!values.apiKey || !values.userName) return;
                            createDepartment(values).then(() => setSuccess(true)).catch(() => addError('תקלה בהוספת מחלקה חדשה'))
                        }}
                    >
                        {({ handleSubmit, isSubmitting, errors, dirty, isValid, values }) => (

                            <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                <CustomTextInput name='name' placeholder='שם המחלקה' />
                                <Header sub content="בנק הודעות WhatsApp"/>
                                <CustomTextInput name='remainingMessages' placeholder='בנק הודעות WhatsApp' />
                                <Header sub content="בנק הודעות SMS"/>
                                <CustomTextInput name='remainingSMSMessages' placeholder='בנק הודעות SMS' />
                                <Header sub content="Sub Domain"/>
                                <CustomTextInput name='subDomain' placeholder='Sub Domain' />
                                <CustomTextInput name='apiKey' placeholder='Api Key' />
                                <CustomTextInput name='apiSecret' placeholder='Api Secret' />
                                    <CustomTextInput name='userName' placeholder='Api User' />
                                <Segment>
                                    <CustomFieldArea placeholder='Phone' fieldName='phone' name='phoneNumbers' header={'מספרי טלפון'} />
                                </Segment>


                                <Button loading={loading}
                                    disabled={!isValid || !dirty || loading || isSubmitting}
                                    positive content='הוספה' type='submit' fluid />

                                {success && (
                                    <Message size='tiny' color='green' content='המחלקה הוקמה בהצלחה' />

                                )}
                                {error !== '' && (
                                    <Message size='tiny' color='red' content={error} />

                                )}
                            </Form>


                        )}
                    </Formik>
                </Segment>
            </Grid.Column>

        </Grid>



    )
}
)