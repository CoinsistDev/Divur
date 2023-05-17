import { Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Form as sForm, Button, Image, Item, Label, List, Header, Icon, Message } from 'semantic-ui-react'
import CustomTextInput from '../../../app/common/form/CustomTextInput'
import { Department } from '../../../app/models/department'
import { useStore } from '../../../app/stores/store'
import * as Yup from 'yup';
import { User, UserFormValues } from '../../../app/models/user'
interface Props {
    department: Department;
}

export default observer(function ImplementorDepartmentListItem({ department }: Props) {
    const [selected, setSelected] = useState(0);
    const { departmentStore, userStore } = useStore();
    const { editDepartment, loading, setDepartment, updateUser, removeUser } = departmentStore;
    const [target, setTarget] = useState("");
    const [errors, setErrors] = useState([])
    const [newUser, setNewUser] = useState(false);
    // old regex no 9727
    // const phoneRegExp = /^\+?(972)()?0?(([23489]{1}\d{7})|[5]{1}\d{8})$/;
    const phoneRegExp = /^\+?(972)(7||54||52||51||55)?0?(([23489]{1}\d{7})|[5]{1}\d{8}|([7]{1}\d{7}))$/;
    const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]+)\])/
    const validationSchema = Yup.object({
        departmentName: Yup.string().required("שדה שם הינו חובה"),
        userEmail: Yup.string().required().email(),
        phoneNumber: Yup.string().matches(phoneRegExp),
        departmentSMSMessageAmount:Yup.string().required().min(0),
        userPhone: Yup.string().matches(phoneRegExp),
    })

    const handleDepartmentNameChange = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) => {
        setTarget(e.currentTarget.name);
        let newDepartment = { ...department, name: name };
        let dep = await editDepartment(newDepartment);
        department = dep!;
        setErrors([]);
    }
    const handleDepartmentMessageBankChange = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, amount: number) =>{
        setTarget(e.currentTarget.name);
        let newDepartment = { ...department, remainingMessages:amount};
        let dep = await editDepartment(newDepartment);
        department = dep!;
        setErrors([]);
    }
    const handleDepartmentSMSMessageBankChange = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, amount: number) =>{
        setTarget(e.currentTarget.name);
        let newDepartment = { ...department, remainingSMSMessages:amount};
        let dep = await editDepartment(newDepartment);
        department = dep!;
        setErrors([]);
    }
    const handleDepartmentPhoneAdd = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, phoneNumber: string) => {
        setTarget(e.currentTarget.name);
        let newDepartment = department;
        newDepartment.phoneNumbers.push({ phone: phoneNumber })
        await editDepartment(newDepartment).then((dep) => {
            department = dep!;
            setErrors([]);


        }).catch(err => { setErrors(err); console.log(err) });
    }
    const handleDepartmentPhoneRemove = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, phoneNumber: string) => {
        setTarget(e.currentTarget.name);
        let newDepartment = department;
        newDepartment.phoneNumbers = newDepartment.phoneNumbers.filter(p =>
            p.phone !== phoneNumber)
        let dep = await editDepartment(newDepartment);
        department = dep!;
    }

    const handleUserChange = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, email: string, phone: string, displayName: string, remove: boolean) => {
        setTarget(e.currentTarget.name);
        if (newUser && remove === false) {
            var registerValues = {
                userName: email,
                email: email,
                displayName: displayName,
                phone: phone
            } as UserFormValues
            await userStore.register(registerValues, department.id).then(() => {
                department.users.push({ email: email } as User);
                setDepartment(department);
                setErrors([])
            }).catch(err => {
                setErrors(err);
            });
        }
        else if (remove === true){
            await removeUser(email, department.id).then((dep) => {
                department = dep!;
                setErrors([]);
            })
                .catch(err => { setErrors(err); console.log(err) })
        }else{
            await updateUser(email, department.id).then((dep) => {
                department = dep!;
                setErrors([]);
            })
                .catch(err => { setErrors(err); console.log(err) })
        }

    }
    return (
        <>

            <List.Item style={{ direction: 'rtl' }} key={department.id} >
                <Image src={'/assets//user.png'} size='tiny' />
                <List.Content verticalAlign='middle' style={{ marginRight: '15px' }} >
                    <Item.Header>{department.name}</Item.Header>
                    <Button.Group style={{ marginTop: '10px', direction: 'ltr' }} >
                        <Button type='button' color='green' style={{ direction: 'ltr' }} icon='user' content='משתמשים' onClick={() => setSelected(1)} />
                        <Button type='button' color='blue' style={{ direction: 'ltr' }} icon='info' content='פרטי מחלקה' onClick={() => setSelected(2)} />
                    </Button.Group>
                </List.Content>

            </List.Item>

            <Formik
                initialValues={{ departmentName: department.name,departmentMessageAmount: department.remainingMessages
                    ,departmentSMSMessageAmount:department.remainingSMSMessages, userEmail: '', name: '',
                 phoneNumber: '', userPhone: '', userDisplayName: '', error: null }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setErrors }) => {
                    console.log('')
                }}

            >
                {({ handleSubmit, isSubmitting, dirty, isValid, values }) => (

                    <Form style={{ direction: 'rtl' }} className='ui form' onSubmit={handleSubmit} autoComplete='off'>

                        {selected === 1 ? (
                            <>
                                <Header sub content='משתמשים' />
                                <List>
                                    {department.users.map(user => (
                                        <List.Item key={user.email}>

                                            <List.Content><Icon name='user' style={{ paddingLeft: '20px' }} />{user.email}
                                                <Button
                                                    type='button'
                                                    loading={loading && target === 'userNameRemove' + user.email}
                                                    name={'userNameRemove' + user.email}
                                                    onClick={(e) => handleUserChange(e, user.email, '', '', true)} basic color='red'
                                                    content='הסר' size='tiny' />
                                                {/* {userStore.currentUser!.roles.filter(x => x == "Admin").length > 0 && (
                                                    <h1>{user.roles}+as</h1>
                                                    <Button
                                                        type='button'
                                                        loading={loading && target === 'userImplementor' + user.email}
                                                        name={'userImplementor' + user.email}
                                                        onClick={(e) => handleUserImplementor(e, user.email)} basic 
                                                        color={user.roles.filter(x => x === "Implementor").length > 0 ? 'red' : 'green'}
                                                        content={user.roles.filter(x => x === "Implementor").length > 0 ? 'הורד כמיישם' : 'הוסף כמיישם'} size='tiny' />
                                                )} */}

                                            </List.Content>
                                        </List.Item>
                                    ))}
                                </List>
                                <Header sub content='הוסף משתמש' />
                                <Button style={{ direction: 'ltr' }} content='משתמש קיים' icon='user' onClick={() => setNewUser(false)} />
                                <Button style={{ direction: 'ltr' }} content='משתמש חדש' icon='add user' onClick={() => setNewUser(true)} />
                                <sForm.Group style={{ marginTop: '20px' }}  >
                                    {newUser ? (
                                        <>
                                            <CustomTextInput width={6} name='userEmail' placeholder='אימייל של המשתמש' />
                                            <CustomTextInput width={6} name='userPhone' placeholder='מספר הטלפון' />
                                            <CustomTextInput width={6} name='userDisplayName' placeholder='שם תצוגה' />
                                        </>

                                    ) : (
                                        <CustomTextInput width={6} name='userEmail' placeholder='אימייל של המשתמש' />

                                    )}
                                    <Button
                                        positive size='tiny'
                                        content='הוסף'
                                        loading={(loading || userStore.isLoading) && target === 'userName' + department.id}
                                        disabled={
                                           !newUser ?
                                                department.users.filter(u => u.email === values.userEmail).length > 0 || !!!values.userEmail.match(emailRegExp)
                                                : (department.users.filter(u => u.email === values.userEmail).length > 0 || !!!values.userEmail.match(emailRegExp)
                                                    || values.userDisplayName === "" || !!!values.userPhone.match(phoneRegExp))
                                        }
                                        name={'userName' + department.id}
                                        onClick={(e) => handleUserChange(e, values.userEmail, values.userPhone, values.userDisplayName, false).then(() =>{values.userEmail = '';values.phoneNumber='';values.userDisplayName=''} )}
                                        type='button' />
                                </sForm.Group>
                                <Button content='סגור' style={{ marginBottom: '10px' }} onClick={() => setSelected(0)} />
                                {errors.length > 0 && (
                                    <Message negative style={{ maxWidth: '300px' }}>
                                        <Message.Header>אירעה שגיאה</Message.Header>
                                        <Message.List size='tiny' color='green' items={errors} />
                                    </Message>
                                )}

                            </>
                        ) : selected === 2 ? (
                            <>
                                <Header sub content='מספרי טלפון' />
                                <List>
                                {console.log('ff')}

                                {console.log(department)}

                                    {department.phoneNumbers.map(phone => (
                                        <List.Item key={phone.phone}>

                                            <List.Content verticalAlign='middle'>
                                                <Item.Content><Icon name='phone' />{phone.phone}
                                                    <Button style={{ marginRight: '10px' }}
                                                        type='button'
                                                        loading={loading && target === 'phoneNumberRemove' + phone.phone}
                                                        name={'phoneNumberRemove' + phone.phone}
                                                        onClick={(e) => handleDepartmentPhoneRemove(e, phone.phone)}
                                                        basic color='red'
                                                        content='הסר'
                                                        size='tiny' /></Item.Content>
                                            </List.Content>

                                        </List.Item>
                                    ))}
                                    {department.phoneNumbers.length === 0 && <Label basic color='grey' content='לא קיימים מספרי טלפון במחלקה' />}
                                </List>
                                <Header sub content='שם המחלקה' />
                                <sForm.Group width={4}>
                                    <CustomTextInput width={6} name='departmentName' placeholder='שם המחלקה' />
                                    <Button primary
                                        loading={loading && target === 'departmentName' + department.id}
                                        type="button"
                                        name={'departmentName' + department.id}
                                        content='שמור'
                                        onClick={(e) => handleDepartmentNameChange(e, values.departmentName)}
                                    />
                                </sForm.Group>

                                <Header sub content='הוסף מספר טלפון' />
                                <sForm.Group  >
                                    <CustomTextInput width={6} name='phoneNumber' placeholder='מספר טלפון' />
                                    <Button
                                        primary
                                        content='הוסף'
                                        onClick={(e) => handleDepartmentPhoneAdd(e, values.phoneNumber)}
                                        disabled={department.phoneNumbers.filter(u => u.phone === values.phoneNumber).length > 0 || !!!values.phoneNumber.match(phoneRegExp)}
                                        name={'phoneAdd' + department.id}
                                        loading={loading && target === 'phoneAdd' + department.id}
                                        type='button' />
                                </sForm.Group>

                                <Header sub content='בנק הודעות WhatsApp' />
                                <sForm.Group width={4}>
                                    <CustomTextInput width={6} name='departmentMessageAmount' placeholder='בנק הודעות WhatsApp' />
                                    <Button primary
                                        loading={loading && target === 'departmentBank' + department.id}
                                        type="button"
                                        name={'departmentBank' + department.id}
                                        content='שמור'
                                        onClick={(e) => handleDepartmentMessageBankChange(e, values.departmentMessageAmount)}
                                    />
                                </sForm.Group>
                                <Header sub content='בנק הודעות SMS' />

                                <sForm.Group width={4}>
                                    <CustomTextInput width={6} name='departmentSMSMessageAmount' placeholder='בנק הודעת SMS' />
                                    <Button primary
                                        loading={loading && target === 'departmentSMSBank' + department.id}
                                        type="button"
                                        disabled={values.departmentMessageAmount < 0 || !values.departmentSMSMessageAmount}
                                        name={'departmentSMSBank' + department.id}
                                        content='שמור'
                                        onClick={(e) => handleDepartmentSMSMessageBankChange(e, values.departmentSMSMessageAmount)}
                                    />
                                </sForm.Group>
                                <Button content='סגור' style={{ marginBottom: '10px' }} onClick={() => setSelected(0)} />
                                {errors.length > 0 && (
                                    <Message negative style={{ maxWidth: '300px' }}>
                                        <Message.Header>אירעה שגיאה</Message.Header>
                                        <Message.List size='tiny' color='green' items={errors} />
                                    </Message>
                                )}


                            </>
                        ) : null}


                        {/* // <ErrorMessage
                        //     name='error' render={() =>
                        //         <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />}
                        // /> */}

                    </Form>

                )}
            </Formik>
        </>
    )
})
