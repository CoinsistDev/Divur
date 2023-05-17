import { FieldArray, useField } from 'formik';
import { Button, Container, Divider, Form, Grid, Header } from 'semantic-ui-react';
import { User } from '../../models/user';
import CustomTextInput from './CustomTextInput';

interface Props {
    name: string;
    header:string;
    placeholder:string;
    fieldName:string
}
export default function CustomFieldArea(props: Props) {
    const [field] = useField(props.name)
    return (
        <FieldArray name={props.name}>
            {({  remove, push }) => (
                <Container fluid>
                    <Grid style={{ display: 'flex', alignItems: 'center',textAlign:'right' }}>
                        <Grid.Column computer={12}>
                            <Header color='blue' sub content={props.header} />
                        </Grid.Column>
                        <Grid.Column computer={4}>
                            <Button type='button' floated='left' size='mini' primary icon='plus' onClick={() => push('')} />
                        </Grid.Column>
                    </Grid>

                    <Divider />
                    {
                        field.value.map((user:User, i:number) => (
                            <Container fluid key={`${props.name}pContainer${i}`}>
                                <Form.Group>
                                    <CustomTextInput width={16} name={`${props.name}.${i}.${props.fieldName}`} placeholder={props.placeholder} />
                                    <Button icon='trash' type='button' color='red' onClick={() => { remove(i) }} />
                                </Form.Group>
                            </Container>

                        ))}

                </Container>
            )}

        </FieldArray>
    )
}