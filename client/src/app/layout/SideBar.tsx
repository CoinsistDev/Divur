import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom'
import { Icon, Menu, Sidebar } from 'semantic-ui-react'
import { useStore } from '../stores/store';
export default observer(function SideBar() {

    const { departmentStore, userStore } = useStore();
    const { currentDepartment } = departmentStore;

    return (
        <Sidebar
            direction='right'
            as={Menu}
            icon='labeled'
            vertical
            visible={true}
            width='thin'
        >
            <Menu.Item as={Link}  to={`/wa/distribution/${currentDepartment?.id}`} style={{ paddingTop: '70px', paddingBottom: '20px' }}>
                <Icon name='send' />
                הפצה
            </Menu.Item>
            { userStore.currentUser && userStore.currentUser.departments.length > 1 &&(
                <Menu.Item as={Link}  to='/wa/departments' style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <Icon name='home' />
                המחלקות שלי
            </Menu.Item>
            )}
            
            <Menu.Item as={Link}  to={`/wa/scheduledTasks/${currentDepartment?.id}`} style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <Icon name='time' />
                הפצות
            </Menu.Item>

            <Menu.Item as={Link}  to={`/wa/reports/${currentDepartment?.id}`} style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <Icon name='book' />
                דוחות
            </Menu.Item>
            <Menu.Item as={Link}  to={`/wa/blacklist/${currentDepartment?.id}`} style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <Icon name='remove user' />
                הוסרו מדיוור
            </Menu.Item>
            {userStore.currentUser&& userStore.currentUser.roles.find(r => r === 'Implementor' || r === 'Admin') && (
                <Menu.Item as={Link} target="_blank" rel="noopener noreferrer"  to={`/wa/admin/departments`} style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                    <Icon name='setting' />
                    ניהול
                </Menu.Item>
            )}
        </Sidebar>
    )
})
