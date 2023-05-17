import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import { Container, Divider, Grid, Header, Icon, List, Loader } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store'
import ImplementorDepartmentListItem from '../departments/ImplementorDepartmentListItem'

export default observer(function ManageDepartmentDashboard() {
    const { departmentStore } = useStore();
    const { loadingAll,departmentRegistry,listAllDepartments } = departmentStore;

    useEffect(() => {
        listAllDepartments();
    }, [listAllDepartments])


    if (loadingAll) return <Loader active content='טוען מחלקות' />
    return (
        <Grid style={{ marginTop: '40px' }}>
            <Grid.Column computer={9}></Grid.Column>
            <Grid.Column computer={6}>
                <Container textAlign='right'>
                    <Header as='h2' style={{ paddingBottom: '20px',direction:'rtl' }}>
                        <Icon name='home' style={{ paddingLeft: '20px' }} />
                        <Header.Content>
                            כל המחלקות
                            <Header.Subheader>בחרו את המחלקה הרצויה</Header.Subheader>

                        </Header.Content>
                        <Divider />
                    </Header>
                    <List relaxed='very' divided verticalAlign='middle'>
                    {Array.from(departmentRegistry.values()).map(department =>(
                        <ImplementorDepartmentListItem key={department.id}      
                         department={department}/>
                    ))}
                    </List>
                </Container>
            </Grid.Column>
        </Grid>
    )
})