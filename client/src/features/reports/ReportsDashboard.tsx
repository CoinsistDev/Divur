import { useState } from 'react';
import { Container, Divider, Form, Grid, Header, Icon } from 'semantic-ui-react';
import { defaults, Bar } from 'react-chartjs-2';
import { useStore } from '../../app/stores/store';
import { DateRangePicker, LocalizationProvider, DateRange } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, TextField, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';

export default observer(function ReportsDashboard() {
  const { departmentStore } = useStore();
  const { currentDepartment } = departmentStore;
  const [value, setValue] = useState<DateRange<Date>>([null, null]);
  const [updates, setUpdates] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  defaults.plugins.legend.display = false;

  const nonTicketMessagesLabels = ['מוסרים מדיוור', 'הגיעו ליעד', 'נקראו', 'נכשלו', 'נשלחו'];
  const [nonTicketData, setNonTicketData] = useState([
    currentDepartment!.totalBlackListMessage,
    currentDepartment!.totalNonTicketSent,
    currentDepartment!.totalNonTicketMessageRead,
    currentDepartment!.totalNonTicketMessageFailed,
    currentDepartment!.totalNonTicketMessageDelivered,
  ]);

  const filterDate = async (reset?: boolean) => {
    if (reset) {
      await departmentStore.getMessageStats(departmentStore.currentDepartment!.id, new Date('10/10/1970').toUTCString(), new Date(Date.now()).toUTCString());
      updateData();
      setUpdates(updates + 1);
      return;
    }
    if (currentDepartment && value[0] && value[1]) {
      await departmentStore.getMessageStats(departmentStore.currentDepartment!.id, value[0]?.toString() ?? '', value[1]?.toString() ?? '');
      updateData();
    }

    setUpdates(updates + 1);
  };

  const sendReport = async () => {
    console.log('sending...');

    if (currentDepartment && value[0] && value[1]) {
      await departmentStore.sendreport(departmentStore.currentDepartment!.id, value[0]?.toString() ?? '', value[1]?.toString() ?? '');
    } else {
      await departmentStore.sendreport(departmentStore.currentDepartment!.id, new Date('10/10/1970').toUTCString(), new Date(Date.now()).toUTCString());
    }
  };

  const updateData = () => {
    const newNonTicketData = [
      currentDepartment!.totalBlackListMessage,
      currentDepartment!.totalNonTicketMessageDelivered,
      currentDepartment!.totalNonTicketMessageRead,
      currentDepartment!.totalNonTicketMessageFailed,
      currentDepartment!.totalNonTicketSent,
    ];
    const newData = data;
    setNonTicketData(newNonTicketData);
    newData.labels = nonTicketMessagesLabels;
    newData.datasets[0].data = newNonTicketData;
    setData(newData);
  };

  const [data, setData] = useState({
    labels: nonTicketMessagesLabels,
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
      <Grid style={{ height: '100vh', marginTop: '40px', direction: 'rtl' }}>
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
        <Grid.Row style={{ height: '100%' }}>
          <Grid.Column computer={1}></Grid.Column>
          <Grid.Column computer={10} verticalAlign="middle">
            <Bar key={updates} data={data} />
          </Grid.Column>
          <Grid.Column verticalAlign="middle" textAlign="center" computer={3}>
            <Header content="Filters" />
            <Form
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateRangePicker
                    startText="תאריך התחלה"
                    endText="תאריך סיום"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    renderInput={(startProps, endProps) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TextField {...startProps} />
                        <Box>-</Box>
                        <TextField {...endProps} />
                      </Box>
                    )}
                  />
                </LocalizationProvider>
                <Button onClick={() => filterDate(true)} variant="outlined" color="primary" disabled={!value[0] || !value[1]}>
                  Reset
                </Button>
                <Button onClick={() => filterDate(false)} variant="outlined" color="primary" disabled={!value[0] || !value[1]}>
                  Filter By Dates
                </Button>
              </Box>
              <Button
                variant="outlined"
                sx={{ borderColor: 'green', color: 'green', marginTop: '20px' }}
                onClick={() => {
                  setIsExporting(true);
                  sendReport();
                  alert('הדוח נשלח למייל בזמן הקרוב.');
                  setTimeout(() => {
                    setIsExporting(false);
                  }, 60000); // Disable button for 1 minute (60000 milliseconds)
                }}
                disabled={isExporting}
              >
                Export Excel Report to Email
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
});
