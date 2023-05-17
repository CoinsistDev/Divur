import React, {useState} from 'react'
import { ErrorMessage, Form, Formik } from 'formik'
import { Button, Grid, Segment, Header, Label } from 'semantic-ui-react'
import CustomTextInput from '../../app/common/form/CustomTextInput'
import { useStore } from '../../app/stores/store'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import useQurey from '../../app/common/util/hooks'
export default observer(function VerifyForm() {
  const { userStore } = useStore();
  const { verifyLogin,resendOTP } = userStore;
  const [disabled, setDisabled] = useState(true);
  const { requestId } = useParams<{ requestId: string }>();

  setTimeout(() => setDisabled(false), 30000);

  const email = useQurey().get('email') as string;
  return (

    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 400 }}>
        <Segment style={{ padding: '40px 50px' }}>
          <Header as='h2' color='blue' textAlign='center'>
            אימות
          </Header>

          <Formik
            initialValues={{ code: '', error: null }}
            enableReinitialize
            onSubmit={async (values, { setErrors }) => {
              await verifyLogin(values.code, requestId).catch(error => setErrors({ error: 'הקוד שהוזן לא תקין' }))
            }}
          >
            {({ handleSubmit, isSubmitting, errors }) => (

              <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                <Button disabled={disabled} type='button' onClick={() => resendOTP(email, requestId) } basic content='שלח קוד מחדש' style={{marginBottom:'15px'}}/>
                <Label icon='tablet' pointing='below' color='grey' basic content='נא הזינו את קוד האימות שקיבלתם למכשיר הנייד' />

                <CustomTextInput name='code' placeholder='קוד' />
                <ErrorMessage
                  name='error' render={() =>
                    <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />}
                />
                <Button loading={isSubmitting} positive content='התחבר' type='submit' fluid />

              </Form>

            )}
          </Formik>

        </Segment>
      </Grid.Column>

    </Grid>



  )
}
)