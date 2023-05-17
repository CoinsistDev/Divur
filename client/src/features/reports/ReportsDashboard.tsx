import { useState } from "react";
import {
  Container,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
} from "semantic-ui-react";
import { defaults, Bar } from "react-chartjs-2";
import { useStore } from "../../app/stores/store";
import { DateRangePicker, LocalizationProvider, DateRange } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Box, TextField, Button } from "@mui/material";
import { observer } from "mobx-react-lite";

export default observer(function ReportsDashboard() {
  const { departmentStore } = useStore();
  const { currentDepartment } = departmentStore;
  const [value, setValue] = useState<DateRange<Date>>([null, null]);
  const [updates, setUpdates] = useState(0);

  defaults.plugins.legend.display = false;

  const nonTicketMessagesLabels = ["הגיעו ליעד", "נקראו", "נכשלו", "נשלחו"];
  const [nonTicketData, setNonTicketData] = useState([
    currentDepartment!.totalNonTicketSent,
    currentDepartment!.totalNonTicketMessageRead,
    currentDepartment!.totalNonTicketMessageFailed,
    currentDepartment!.totalNonTicketMessageDelivered,
  ]);

  const filterDate = async (reset?: boolean) => {
    if (reset) {
      await departmentStore.getMessageStats(
        departmentStore.currentDepartment!.id,
        new Date("10/10/1970").toUTCString(),
        new Date(Date.now()).toUTCString()
      );
      updateData();
      setUpdates(updates + 1);
      return;
    }
    if (currentDepartment && value[0] && value[1]) {
      await departmentStore.getMessageStats(
        departmentStore.currentDepartment!.id,
        value[0]!.toUTCString(),
        value[1]!.toUTCString()
      );
      updateData();
    }
    setUpdates(updates + 1);
  };

  const sendReport = async () => {
    if (currentDepartment && value[0] && value[1]) {
      await departmentStore.sendreport(
        departmentStore.currentDepartment!.id,
        value[0]!.toUTCString(),
        value[1]!.toUTCString()
      );
    }else{
        await departmentStore.sendreport(
            departmentStore.currentDepartment!.id,
            new Date("10/10/1970").toUTCString(),
            new Date(Date.now()).toUTCString()
          );
    }
  };

  const updateData = () => {
    const newNonTicketData = [
      currentDepartment!.totalNonTicketSent,
      currentDepartment!.totalNonTicketMessageRead,
      currentDepartment!.totalNonTicketMessageFailed,
      currentDepartment!.totalNonTicketMessageDelivered,
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
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],

        borderWidth: 1,
      },
    ],
  });

  return (
    <Container fluid style={{ direction: "rtl" }}>
      <Grid style={{ height: "100vh", marginTop: "40px", direction: "rtl" }}>
        <Grid.Row style={{ paddingRight: "80px", height: "00px" }}>
          <Header textAlign="right" as="h2" style={{ paddingBottom: "20px" }}>
            <Icon name="book" style={{ paddingLeft: "20px" }} />
            <Header.Content>
              דוחות
              <Header.Subheader>בדקו מה מצב הדיוור שלכם</Header.Subheader>
            </Header.Content>
            <Divider />
          </Header>
        </Grid.Row>
        <Grid.Row style={{ height: "100%" }}>
          <Grid.Column computer={1}></Grid.Column>
          <Grid.Column computer={10} verticalAlign="middle">
            <Bar key={updates} data={data} />
          </Grid.Column>
          <Grid.Column verticalAlign="middle" textAlign="center" computer={3}>
            <Header content="Filters" />
            <Form
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Form.Field width={12}>
                {/* <Button variant='outlined' sx={{ margin: '0px 5px' }} color='primary' onClick={() => {setSelectedFilter('ticketData');updateData(true)}} >Ticket</Button> */}
                <Button variant='outlined' sx={{ borderColor: 'green', color: 'green' }} onClick={() => sendReport()} >ייצא דוח Excell למייל</Button>
              </Form.Field>

              <Form.Field width={16}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateRangePicker
                    startText="תאריך התחלה"
                    endText="תאריך סיום"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    renderInput={(startProps, endProps) => (
                      <>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> - </Box>
                        <TextField {...endProps} />
                      </>
                    )}
                  />
                </LocalizationProvider>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Button
                    sx={{ marginTop: 1 }}
                    onClick={() => {
                      setValue([null, null]);
                      filterDate(true);
                    }}
                    variant="outlined"
                    color="primary"
                    disabled={!value[0] || !value[1]}
                  >
                    Reset
                  </Button>
                  <Button
                    sx={{ marginTop: 1 }}
                    onClick={() => filterDate(false)}
                    variant="outlined"
                    color="primary"
                    disabled={!value[0] || !value[1]}
                  >
                    Filter By Dates
                  </Button>
                </Box>
              </Form.Field>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
});
