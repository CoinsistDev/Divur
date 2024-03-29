import { observer } from 'mobx-react-lite';
import { Button, Divider, Form, Grid, Header, Icon, Table, Pagination } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import he from 'date-fns/locale/he';
import TablePlaceholder from './TablePlaceholder';
import { ScheduledTask } from '../../app/models/scheduledTask';
import './style.css'

registerLocale('he', he) 

const TimedDistributionsTable = observer(function () {
  const { departmentStore } = useStore();
  const { currentDepartment, loadCurrentDepartment, loading } = departmentStore;
  const { id } = useParams<{ id: string }>();
  const [target, setTarget] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<ScheduledTask[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const itemsPerPage = 20;

  const handleCancelTask = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, taskId: string) => {
    setTarget(e.currentTarget.name);
    departmentStore.cancelDistributionTask(taskId);
  };

  const handleFilter = () => {
    const filteredTasks = currentDepartment!.scheduledDistributionTasks.filter((task) => {
      const taskDate = new Date(task.scheduledFor);
      taskDate.setHours(0, 0, 0, 0);
  
      if (startDate && endDate) {
        let sDate = new Date(startDate);
        sDate.setHours(0, 0, 0, 0);
        
        let eDate = new Date(endDate);
        eDate.setHours(23, 59, 59, 999);
  
        return taskDate >= sDate && taskDate <= eDate;
      } else if (startDate) {
        let sDate = new Date(startDate);
        sDate.setHours(0, 0, 0, 0);
  
        return taskDate >= sDate;
      } else if (endDate) {
        let eDate = new Date(endDate);
        eDate.setHours(23, 59, 59, 999);
  
        return taskDate <= eDate;
      } else {
        return true;
      }
    });

    setFilteredTasks(filteredTasks);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  useEffect(() => {
    if (id) {
      loadCurrentDepartment(id);
    }

    handleFilter();
  }, [id, loadCurrentDepartment, startDate, endDate]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const reversedTasks = filteredTasks ? [...filteredTasks].reverse() : [];
    return reversedTasks.slice(startIndex, endIndex);
  };

  const handleExportToExcel = async () => {
    setExporting(true);
    await departmentStore.sendTaskReport(departmentStore.currentDepartment!.id, startDate, endDate, filteredTasks);
    window.alert('דוח הפצות נשלח לתיבת המייל שלך');
    setTimeout(() => {
      setExporting(false);
    }, 30000);
  };

  const totalPages = Math.ceil((filteredTasks?.length || 0) / itemsPerPage);

  if (currentDepartment?.scheduledDistributionTasks === undefined) {
    return <TablePlaceholder />;
  }

  return (
    <Grid>
      <Grid.Column computer={2}></Grid.Column>
      <Grid.Column computer={13}>
        <Header textAlign="right" as="h2" style={{ paddingBottom: '20px', direction: 'rtl', marginTop: '40px' }}>
          <Icon name="book" style={{ paddingLeft: '20px' }} />
          <Header.Content>
            הפצות
            <Header.Subheader>בדקו מה סטטוס ההפצות שלכם</Header.Subheader>
          </Header.Content>
          <Divider />
        </Header>

        <Form style={{ direction: 'rtl' }}>
          <Form.Group>
            <Grid columns={3} stackable style={{ width: '100%' }}>
              <Grid.Column style={{ width: '33%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <label style={{ marginBottom: '0.5em' }}>מתאריך:</label>
                  <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} dateFormat="dd/MM/yyyy" locale="he" isClearable />
                </div>
              </Grid.Column>
              <Grid.Column style={{ width: '33%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <label style={{ marginBottom: '0.5em' }}>עד תאריך:</label>
                  <DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)} dateFormat="dd/MM/yyyy" locale="he" isClearable />
                </div>
              </Grid.Column>
              <Grid.Column style={{ width: '33%', textAlign: 'left', display: 'flex', alignItems: 'flex-end' }}>
                <Form.Button color="green" onClick={handleExportToExcel} disabled={exporting || filteredTasks?.length === 0}>
                  <span>שליחת דוח למייל</span>
                  <i className="file excel outline icon" style={{ marginLeft: '0.2em' }}></i>
                </Form.Button>
              </Grid.Column>
            </Grid>
          </Form.Group>
        </Form>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <Table celled style={{ direction: 'rtl' }}>
            <Table.Header>
              <Table.Row textAlign="right">
                <Table.HeaderCell width={1}>מספר הפצה</Table.HeaderCell>
                <Table.HeaderCell width={1}>כמות לשליחה</Table.HeaderCell>
                <Table.HeaderCell width={1}>הצלחה</Table.HeaderCell>
                <Table.HeaderCell width={1}>כישלון</Table.HeaderCell>
                <Table.HeaderCell width={1}>נוצרה בתאריך</Table.HeaderCell>
                <Table.HeaderCell width={1}>מתוזמנת לתאריך</Table.HeaderCell>
                <Table.HeaderCell width={2}>סטטוס</Table.HeaderCell>
                <Table.HeaderCell width={1}>משתמש שהפיץ</Table.HeaderCell>
                <Table.HeaderCell width={2}>שם תבנית</Table.HeaderCell>
                <Table.HeaderCell width={1}>פעולות</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {getCurrentPageItems().map((task: ScheduledTask) => (
                <Table.Row textAlign="right" key={task.id}>
                  <Table.Cell>{task.id}</Table.Cell>
                  <Table.Cell style={{color: 'blue'}}>{task.totalCount}</Table.Cell>
                  <Table.Cell style={{color: 'green'}}>{task.successCount}</Table.Cell>
                  <Table.Cell style={{color: 'red'}}>{task.failedCount}</Table.Cell>
                  <Table.Cell>{format(task.createdAt, 'dd/MM/yyyy HH:mm')}</Table.Cell>
                  <Table.Cell>{format(task.scheduledFor, 'dd/MM/yyyy HH:mm')}</Table.Cell>
                  <Table.Cell negative={task.status === 1 || task.status === 3} positive={task.status === 0} warning={task.status === 2}>
                    {task.status === 0 ? 'נשלחה בהצלחה' : task.status === 1 ? 'נכשלה' : task.status === 2 ? 'מחכה להשלח' : task.status === 3 ? 'בוטלה' : 'אין מידע זמין'}
                  </Table.Cell>
                  <Table.Cell>{task.distributor}</Table.Cell>
                  <Table.Cell>{task.distributionTitle}</Table.Cell>
                  <Table.Cell>
                    <Button basic color="red" disabled={task.status !== 2} name={task.taskId} loading={loading && target === task.taskId} onClick={(e) => handleCancelTask(e, task.taskId)}>
                      ביטול
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan={6} textAlign="center">
                  <Pagination
                    activePage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(_, { activePage }) => setCurrentPage(activePage as number)}
                    ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
                    firstItem={{ content: <Icon name="angle double left" />, icon: true }}
                    lastItem={{ content: <Icon name="angle double right" />, icon: true }}
                    prevItem={{ content: <Icon name="angle left" />, icon: true }}
                    nextItem={{ content: <Icon name="angle right" />, icon: true }}
                    siblingRange={6}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
      </Grid.Column>
    </Grid>
  );
});

export default TimedDistributionsTable;
