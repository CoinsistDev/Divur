import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import { Container, Divider, Grid, Header, Icon, List, Loader, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store'
import DepartmentListItem from './DepartmentListItem';

export default observer(function DepartmentList() {

    const { userStore } = useStore();
    const { currentUser, loadUserDepartments,loadingDepartments } = userStore;

    useEffect(() => {
        if(currentUser?.departments.length === 0)
        loadUserDepartments();

    }, [loadUserDepartments,currentUser])

    if(loadingDepartments) return <Loader active content='טוען מחלקות'/>
    if(!currentUser?.departments) return <span>לא נמצאו מחלקות</span>
    return (
        <Grid style={{marginTop:'40px'}}>
            <Grid.Column computer={9}></Grid.Column>
            <Grid.Column computer={6}>
            <Container style={{ direction: 'rtl' }}>
            <Header as='h2' style={{ paddingBottom: '20px' }}>
                        <Icon name='home' style={{ paddingLeft: '20px' }} />
                        <Header.Content>
                            המחלקות שלי
                            <Header.Subheader>בחרו את המחלקה הרצויה</Header.Subheader>

                        </Header.Content>
                        <Divider />

                    </Header>
            {currentUser!.departments.length>0 && (
                <Segment>
                   
                    <List selection verticalAlign='middle'>
                        {currentUser!.departments.map(department => (
                            <DepartmentListItem key={department.id} department={department} />
                        ))}
                    </List>
                    
                </Segment>

            )}

        </Container>
            </Grid.Column>
        </Grid>
       
    )
})
