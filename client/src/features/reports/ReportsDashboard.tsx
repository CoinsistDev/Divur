import { useState, useEffect } from 'react';
import { Container, Divider, Form, Grid, Header, Icon } from 'semantic-ui-react';
import { defaults, Bar } from 'react-chartjs-2';
import { useStore } from '../../app/stores/store';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import he from 'date-fns/locale/he';
import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';

registerLocale('he', he) 

const DEFAULT_DATE = new Date('10/10/1970').toUTCString();
const NON_TICKET_MESSAGES_LABELS = ['מוסרים מדיוור', 'הגיעו ליעד', 'נקראו', 'נכשלו', 'נשלחו'];

export default observer(function ReportsDashboard() {
  const { departmentStore } = useStore();
  const { currentDepartment } = departmentStore;
  const [startDate, setStartDate] = useState<Date | null>(null); // Replace null with Date | null
  const [endDate, setEndDate] = useState<Date | null>(null); // Replace null with Date | null
  const [isExporting, setIsExporting] = useState(false);

  defaults.plugins.legend.display = false;

  const [nonTicketData, setNonTicketData] = useState([
    currentDepartment!.totalBlackListMessage,
    currentDepartment!.totalNonTicketSent,
    currentDepartment!.totalNonTicketMessageRead,
    currentDepartment!.totalNonTicketMessageFailed,
    currentDepartment!.totalNonTicketMessageDelivered,
  ]);

  const filterDate = async (reset?: boolean) => {
    if (reset) {
      await departmentStore.getMessageStats(departmentStore.currentDepartment!.id, DEFAULT_DATE, new Date(Date.now()).toUTCString());
      updateData();
      return;
    }
    if (currentDepartment && startDate && endDate) {
      await departmentStore.getMessageStats(departmentStore.currentDepartment!.id, startDate?.toString() ?? '', endDate?.toString() ?? '');
      updateData();
    }
  };

  useEffect(() => {
    if (currentDepartment) {
      setNonTicketData([
        currentDepartment.totalBlackListMessage,
        currentDepartment.totalNonTicketSent,
        currentDepartment.totalNonTicketMessageRead,
        currentDepartment.totalNonTicketMessageFailed,
        currentDepartment.totalNonTicketMessageDelivered,
      ]);
    }
  }, [currentDepartment]);

  const sendReport = async () => {
    setIsExporting(true);
    window.alert('הדוח נשלח למייל בזמן הקרוב.');
    if (currentDepartment && startDate && endDate) {
      await departmentStore.sendreport(departmentStore.currentDepartment!.id, startDate?.toString() ?? '', endDate?.toString() ?? '');
    } else {
      await departmentStore.sendreport(departmentStore.currentDepartment!.id, DEFAULT_DATE, new Date(Date.now()).toUTCString());
    }
    setTimeout(() => {
      setIsExporting(false);
    }, 60000);
  };

  const updateData = () => {
    const newNonTicketData = [
      currentDepartment!.totalBlackListMessage,
      currentDepartment!.totalNonTicketMessageDelivered,
      currentDepartment!.totalNonTicketMessageRead,
      currentDepartment!.totalNonTicketMessageFailed,
      currentDepartment!.totalNonTicketSent,
    ];

    setNonTicketData(newNonTicketData);

    setData((prevData) => ({
      ...prevData,
      labels: NON_TICKET_MESSAGES_LABELS,
      datasets: [
        {
          ...prevData.datasets[0],
          data: newNonTicketData,
        },
      ],
    }));
  };

  const [data, setData] = useState({
    labels: NON_TICKET_MESSAGES_LABELS,
    datasets: [
      {
        data: nonTicketData,
        options: {
          legend: {
            display: false,
          },
        },
        backgroundColor: [
          '#9E9E9E', // Blacklist Member
          '#FFC107', // Arrive
          '#3F51B5', // Read
          '#F44336', // Failed
          '#4CAF50', // Send
        ],
        borderColor: [
          '#9E9E9E', // Blacklist Member
          '#FFC107', // Arrive
          '#3F51B5', // Read
          '#F44336', // Failed
          '#4CAF50', // Send
        ],
        borderWidth: 1,
      },
    ],
  });

  return (
    <Container fluid style={{ direction: 'rtl' }}>
      <Grid style={{ height: '70%', marginTop: '40px', direction: 'rtl' }}>
        <Grid.Row style={{ paddingRight: '80px', height: '00px' }}>
          <Header textAlign="right" as="h2" style={{ paddingBottom: '20px' }}>
            <Icon name="book" style={{ paddingLeft: '20px' }} />
            <Header.Content>
              דוחות
              <Header.Subheader>בדקו מה מצב הדיוור שלכם</Header.Subheader>
            </Header.Content>
            <Divider />
          </Header>
        </Grid.Row>
        <Grid.Row style={{ display: 'flex', justifyContent: 'center' }}>
        <Form style={{ 
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'flex-end', // align items to the bottom of the container
    gap: '20px',
    width: '100%', // set a consistent width
    textAlign: 'right' // align contents to the right
}}>
    <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <label style={{ marginBottom: '0.5em' }}>מתאריך:</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" locale="he" isClearable />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <label style={{ marginBottom: '0.5em' }}>עד תאריך:</label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" locale="he" isClearable />
    </div>
    <Button onClick={() => filterDate(false)} variant="outlined" color="primary" disabled={!startDate || !endDate} style={{ width: '200px', height:'38px' }}>
        סינון לפי תאריכים
    </Button>
    <Form.Button color="green" sx={{ borderColor: 'green', color: 'green' }} onClick={sendReport} disabled={isExporting || !currentDepartment!.totalNonTicketSent} style={{ width: '200px', height:'38px' }}>
        <span>שליחת דוח למייל</span>
        <i className="file excel outline icon" style={{ marginLeft: '0.2em' }}></i>
    </Form.Button>
</Form>


        </Grid.Row>
        <Grid.Row style={{ height: '90%' }}>
          <Grid.Column computer={1}></Grid.Column>
          <Grid.Column computer={11} verticalAlign="middle">
            <Bar data={data} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
});
