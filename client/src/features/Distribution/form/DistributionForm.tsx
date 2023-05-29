import { FieldArray, Form, Formik } from 'formik';
import { SyntheticEvent, useEffect, useState, useRef } from 'react';
import { Button, Container, Segment, Form as sForm, Header, Divider, Grid, Dropdown, Icon, Message } from 'semantic-ui-react';
import CustomTextArea from '../../../app/common/form/CustomTextArea';
import CustomTextInput from '../../../app/common/form/CustomTextInput';
import CustomDateInput from '../../../app/common/form/CustomDateInput';
import CustomCheckbox from '../../../app/common/form/CustomCheckbox';
import { DistributionFormValues } from '../../../app/models/distribution';
import agent from '../../../app/api/agent';
import * as Yup from 'yup';
import { useParams } from 'react-router';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function DistributionForm() {
  const messageRef = useRef<string | null>(null);
  const { departmentStore, distrubitionStore } = useStore();
  const { currentDepartment, loadCurrentDepartment } = departmentStore;
  const { cannedRepliesOptions, cannedReplies, loadingCannedReplies, loadCannedReplies } = distrubitionStore;
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [messagingOptions, setMessagingOptions] = useState<any>([]);
  const [distributionValues, setDistributionValues] = useState<DistributionFormValues>(new DistributionFormValues());
  const [phoneNumbers, setPhoneNumbers] = useState<object[]>([]);

  const fileChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const newDistributionVal = distributionValues;
    newDistributionVal.file[0] = e.currentTarget.files![0];
    setDistributionValues({ ...distributionValues, ...newDistributionVal });
  };

  const handleFormSubmit = async (values: DistributionFormValues) => {
    try {
      const newValues: DistributionFormValues = {
        ...values,
        departmentId: currentDepartment!.id,
      };

      await agent.Distribution.send(newValues);
      setSubmitted(true);
      setErrors([]);
    } catch (error) {
      setErrors(error as string[]);
    }
  };

  const validationSchema = Yup.object({
    message: Yup.string().required(),
    from: Yup.string().required(),
  });

  useEffect(() => {
    if (id) {
      loadCurrentDepartment(id).then((department) => {
        const phones = department?.phoneNumbers.map((phone) => ({ text: phone.phone, value: phone.phone })) || [];
        const smsDisabled = department ? department.remainingSMSMessages === 0 : true;
        setMessagingOptions([
          { text: 'WhatsApp', value: 'WhatsApp' },
          { text: 'SMS', value: 'SMS', disabled: smsDisabled },
        ]);
        setPhoneNumbers(phones);
      });
    }
  }, [id, loadCurrentDepartment]);

  return (
    <Grid>
      <Grid.Column computer={7}></Grid.Column>
      <Grid.Column computer={8}>
        <Container fluid textAlign="right" style={{ marginTop: '40px', direction: 'rtl' }}>
          <Header as="h2" style={{ paddingBottom: '20px' }}>
            <Icon name="whatsapp" style={{ paddingLeft: '20px' }} />
            <Header.Content>
              הפצה
              <Header.Subheader>שלחו הודעות וואטספ ללקוחות שלכם</Header.Subheader>
            </Header.Content>
            <Divider />
          </Header>
          <Formik
            validationSchema={validationSchema}
            initialValues={distributionValues}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
              await handleFormSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ setFieldValue, values, handleSubmit, isValid, isSubmitting, dirty }) => (
              <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                <Header color="blue" sub content="הגדרות דיוור" />
                <Dropdown
                  name="from"
                  style={{ margin: '10px 0px 0px 0px' }}
                  placeholder="מספרי טלפון"
                  search
                  selection
                  onChange={(e: SyntheticEvent<HTMLElement>, { name, value }: any) => {
                    setFieldValue(name, value);
                  }}
                  loading={phoneNumbers.length === 0}
                  options={phoneNumbers}
                />
                <Dropdown
                  name="protocolType"
                  key={currentDepartment?.remainingSMSMessages}
                  style={{ margin: '10px 0px 0px 0px' }}
                  placeholder="בחירת ערוץ"
                  search
                  selection
                  onChange={(e: SyntheticEvent<HTMLElement>, { name, value }: any) => {
                    setFieldValue(name, value);
                  }}
                  options={messagingOptions}
                />

                <sForm.Field />
                <Dropdown
                  name="message"
                  style={{ margin: '10px 0px' }}
                  placeholder="משפטים מוכנים לבחירה"
                  search
                  selection
                  loading={loadingCannedReplies}
                  options={cannedRepliesOptions}
                  value={values.message}
                  onOpen={() => currentDepartment && cannedReplies.length === 0 && loadCannedReplies(currentDepartment?.id)}
                  onChange={(e: SyntheticEvent<HTMLElement>, { name, value }: any) => {
                    console.log('onChange');
                    setFieldValue(name, value);
                    messageRef.current = value;
                  }}
                />
                <CustomTextArea rows={5} name="message" placeholder="הודעה" />

                <Segment>
                  <FieldArray name="parameters">
                    {({ insert, remove, push }) => (
                      <Container fluid>
                        <Grid style={{ display: 'flex', alignItems: 'center' }}>
                          <Grid.Column computer={12}>
                            <Header color="blue" sub content="פרמטרים דינאמיים" />
                          </Grid.Column>
                          <Grid.Column computer={4}>
                            <Button
                              type="button"
                              floated="left"
                              size="mini"
                              primary
                              icon="edit"
                              onClick={() => {
                                setFieldValue('parameters', []);
                                const pattern = /[^{{}}]+(?=\})/g;
                                if (messageRef.current) {
                                  const paramsToAdd = messageRef.current.match(pattern)?.filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
                                  if ((paramsToAdd?.length || undefined) && paramsToAdd!.length > 0) {
                                    paramsToAdd?.forEach((param) =>
                                      push({
                                        messageParameter: param,
                                        fileParameter: '',
                                      })
                                    );
                                  }
                                }
                              }}
                            />
                          </Grid.Column>
                        </Grid>

                        <Divider />
                        {values.parameters.map((parameter, i) => (
                          <Container key={`pContainer${i}`}>
                            <sForm.Group>
                              <CustomTextInput width={4} name={`parameters.${i}.messageParameter`} placeholder="שם הפרמטר בהודעה" />
                              <CustomTextInput width={4} name={`parameters.${i}.fileParameter`} placeholder="שם העמודה בקובץ" />
                              <Button
                                icon="trash"
                                type="button"
                                color="red"
                                onClick={() => {
                                  remove(i);
                                }}
                              />
                            </sForm.Group>
                          </Container>
                        ))}
                      </Container>
                    )}
                  </FieldArray>
                </Segment>
                <sForm.Field>
                  <CustomCheckbox name="isInternational" label="דיוור בינלאומי" />
                </sForm.Field>
                <sForm.Field>
                  <CustomCheckbox name="isTimed" label="תזמון הפצה" />
                </sForm.Field>
                {values.isTimed && <CustomDateInput placeholderText="מועד ההפצה" name="scheduleDate" showTimeSelect timeCaption="שעה" dateFormat="תאריך yyyy/MM/dd בשעה HH:mm" />}
                {values.protocolType === 'WhatsApp' && (
                  <sForm.Field>
                    <CustomTextInput placeholder="לינק לתמונה" name="imageUrl" label="לינק לתמונה" />
                  </sForm.Field>
                )}
                <sForm.Field width={6}>
                  <Header color="blue" sub content="קובץ אנשי קשר להפצה" />
                  <a target="_blank" rel="noopener noreferrer" href={`https://docs.google.com/spreadsheets/d/1X4w8ErfJBc49_8NZMOMNPHTD6WecQXSeYehf-3ZdeXk`}>
                    קובץ לדוגמא
                  </a>
                  <Button basic as="label" htmlFor="file" type="button" style={{ padding: '15px 20px', marginTop: '10px' }}>
                    {distributionValues.file.length === 0 ? `העלאת קובץ` : distributionValues.file[0].name}
                  </Button>
                  <input type="file" id="file" style={{ display: 'none' }} onChange={(e) => fileChange(e)} />
                </sForm.Field>

                <Button primary content="שלח" type="submit" disabled={isSubmitting || !isValid || !dirty || submitted} loading={isSubmitting} />
                {submitted && <Message size="tiny" color="green" style={{ maxWidth: '300px' }} content="הפקודה התקבלה בהצלחה, ההודעות ישלחו בהקדם" />}
                {errors.length > 0 && (
                  <Message negative style={{ maxWidth: '300px' }}>
                    <Message.Header>אירעה שגיאה</Message.Header>
                    <Message.List size="tiny" color="green" items={errors} />
                  </Message>
                )}
              </Form>
            )}
          </Formik>
        </Container>
      </Grid.Column>
    </Grid>
  );
});
