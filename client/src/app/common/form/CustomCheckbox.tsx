import React from 'react'
import { useField } from 'formik';
import { Checkbox, Form, Label } from 'semantic-ui-react';

interface Props {
    name:string;
    label?: string;
    defaultFunction?:(departmentId:string) => void;
}
export default function CustomCheckbox(props: Props) {
    const [field, meta, helpers] = useField(props.name)
    return (
        <Form.Field {...field} error={meta.touched && !!meta.error} >
            <Checkbox label={props.label} 
                onChange={(e, d) => {helpers.setValue(d.checked);
                    if(props.defaultFunction != null)
                    props.defaultFunction("")}}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}
