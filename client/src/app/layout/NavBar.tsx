import { observer } from 'mobx-react-lite';
import React from 'react'
import { Container, Dropdown, Header, Menu } from 'semantic-ui-react'
import { useStore } from '../stores/store';

export default observer( function NavBar() {

    const {userStore,departmentStore} = useStore();
    return (
        <Container fluid style={{ zIndex: '1000', height: '60px' }}>
           
            <Menu secondary color='blue' inverted fixed='top' style={{ zIndex: '1000', height: '50px' }}>

                <Container fluid style={{ zIndex: '1000' }}>
                    <Menu.Item>
                        <Dropdown pointing='top left' text={userStore.currentUser?.displayName}>
                            <Dropdown.Menu >
                                {/* <Dropdown.Item icon='user' text='My Profile' /> */}
                                <Dropdown.Item text='התנתק' icon='power' onClick={() => userStore.logout()} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item icon='home' header={true} content={`${departmentStore.currentDepartment?.name}`}></Menu.Item>

                    <Menu.Item position='right'>

                        <Header textAlign='right' style={{color:'white'}} content="Consist Whatsapp" />
                    </Menu.Item>

                </Container>

            </Menu>
        </Container>
    )
})
