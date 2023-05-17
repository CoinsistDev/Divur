import { observer } from 'mobx-react-lite'
import { Button, Divider, Grid, Header, Icon, Table } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store'
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TablePlaceholder from './TablePlaceholder'

export default observer(function TimedDistributionsTable() {
    const { departmentStore } = useStore();
    const { currentDepartment, loadCurrentDepartment, loading } = departmentStore;
    const { id } = useParams<{ id: string }>();
    const [target,setTarget] = useState('');
    const handleCancelTask = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,taskId:string) => {
        setTarget(e.currentTarget.name);
        departmentStore.cancelDistributionTask(taskId)
    }
    useEffect(() => {
        if (id) {
            loadCurrentDepartment(id);
        }
    }, [id, loadCurrentDepartment])

    if (currentDepartment?.scheduledDistributionTasks === undefined){ 
        return (   
        <TablePlaceholder/>
    )
}

    return (
        <Grid>
            <Grid.Column computer={4}></Grid.Column>
            <Grid.Column computer={11}>
                <Header textAlign='right' as='h2' style={{ paddingBottom: '20px', direction: 'rtl', marginTop: '40px' }}>
                    <Icon name='book' style={{ paddingLeft: '20px' }} />
                    <Header.Content>
                        הפצות
                        <Header.Subheader>בדקו מה סטטוס ההפצות שלכם</Header.Subheader>

                    </Header.Content>
                    <Divider />

                </Header>
                <Table celled style={{ direction: 'rtl' }}>
                    <Table.Header>
                        <Table.Row textAlign='right'>
                            <Table.HeaderCell>נוצרה בתאריך</Table.HeaderCell>
                            <Table.HeaderCell>מתוזמנת לתאריך</Table.HeaderCell>
                            <Table.HeaderCell>סטטוס</Table.HeaderCell>
                            <Table.HeaderCell>פעולות</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {currentDepartment?.scheduledDistributionTasks.map(task => (
                            <Table.Row textAlign='right' key={task.id}>
                                <Table.Cell>{format(task.createdAt, 'dd/MM/yyyy HH:mm')}</Table.Cell>
                                <Table.Cell>{format(task.scheduledFor, 'dd/MM/yyyy HH:mm')}</Table.Cell>
                                <Table.Cell
                                    negative={task.status === 1 || task.status === 3}
                                    positive={task.status === 0}
                                    warning={task.status === 2}
                                >
                                    {task.status === 0 ? 'נשלחה בהצלחה'
                                        : task.status === 1 ? 'נכשלה'
                                            : task.status === 2 ? 'מחכה להשלח'
                                                : task.status === 3 ? 'בוטלה'
                                                    : 'אין מידע זמין'
                                    }
                                </Table.Cell>
                                <Table.Cell>
                                    <Button basic color='red'
                                        disabled={task.status !== 2}
                                        name={task.taskId}
                                        loading={loading && target === task.taskId}
                                        onClick={(e) => handleCancelTask(e,task.taskId)}>ביטול</Button>
                                </Table.Cell>

                            </Table.Row>
                        ))}
                    </Table.Body>

                </Table>
            </Grid.Column>
        </Grid>

    )
}
)