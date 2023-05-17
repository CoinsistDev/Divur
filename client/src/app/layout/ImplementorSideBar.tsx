import { Link } from 'react-router-dom'
import {  Header, Icon, Menu, Sidebar } from 'semantic-ui-react'
export default function ImplementorSideBar() {


    return (
        <Sidebar
            direction='right'
            as={Menu}
            icon='labeled'
            vertical
            visible={true}
            width='thin'
        >

            <Header color='grey' sub content='מחלקות' style={{ paddingTop: '70px' }} />
            <Menu.Item as={Link}  to={'/wa/admin/departments/create'} style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <Icon name='plus' />
                הוספת מחלקה
            </Menu.Item>
            <Menu.Item as={Link}  to='/wa/admin/departments' style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <Icon name='home' />
                ניהול מחלקות
            </Menu.Item>
        </Sidebar>
    )
}
