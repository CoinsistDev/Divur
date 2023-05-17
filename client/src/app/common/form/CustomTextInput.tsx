import React from 'react'
import {useField} from 'formik';
import { Form, SemanticWIDTHS } from 'semantic-ui-react';

interface Props{
    placeholder:string;
    name:string;
    type?:string;
    label?:string;
    width?:SemanticWIDTHS;
}
export default function CustomTextInput(props:Props) {
    const [field,meta] = useField(props.name)
    return (
        <Form.Field width={props.width? props.width : 16} error={meta.touched && !!meta.error}>
            <input  {...field} {...props}/>
        </Form.Field>
    )
}
