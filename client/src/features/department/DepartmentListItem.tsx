import { observer } from 'mobx-react-lite'
import { Image, Item, List } from 'semantic-ui-react'
import { history } from '../..'
import { userDepartment } from '../../app/models/user'
import { useStore } from '../../app/stores/store'

interface Props {
    department: userDepartment;
}
export default observer( function DepartmentListItem({ department }: Props) {

    const{userStore,departmentStore} = useStore();
    const handleDepartmentChoice = (id:string) =>{
        userStore.updateLastDepartment(id)
        departmentStore.loadCurrentDepartment(id).then(() =>{
            history.push(`/wa/distribution/${id}`)
        })
    }
    return (
        <List.Item key={department.id} onClick={() => handleDepartmentChoice(department.id)}>
            <Image src={'/assets/user.png'} size='tiny' />
            <List.Content verticalAlign='middle' style={{ marginRight: '15px' }} >
                <Item.Header>{department.name}</Item.Header>
            </List.Content>
        </List.Item>
    )
})
