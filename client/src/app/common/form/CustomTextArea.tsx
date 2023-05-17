import {useField} from 'formik';
import { Form } from 'semantic-ui-react';

interface Props{
    placeholder:string;
    name:string;
    type?:string;
    label?:string;
    rows:number;
}
export default function CustomTextArea(props:Props) {
    const [field,meta] = useField(props.name)
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <textarea  {...field} {...props} readOnly/>
        </Form.Field>
    )
}
