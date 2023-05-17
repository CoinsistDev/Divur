import logger from '../logger/index.js'
import XLSX from 'xlsx'


const reportKeys = {
  To: "מזהה לקוח",
  From: "נשלח ממספר",
  Text: "גוף ההודעה",
  ProtocolType: "ערוץ תקשורת",
  sendTime: "זמן שליחה",
  faildTime: "זמן כישלון",
  acceptTime: "זמן קבלה",
  readTime: "זמן קריאה",
  //departmenId: "מזהה מחלקה",
  ProviderMessageId: "מזהה הודעה",
};

const wscols = [
    {wch:14},
    {wch:14},
    {wch:71},
    {wch:12},
    {wch:21},
    {wch:21},
    {wch:21},
    {wch:21},
    {wch:36}
];



const dbKeys = Object.keys(reportKeys).filter((key) => reportKeys[key]);
const excelKeys = Object.values(reportKeys).filter((val) => val);

export async function convertToExcel(data) {
  console.log(`convertToExcel`);
  try {
    const aoa = data.map((obj) => dbKeys.map((key) => obj[key]));
    aoa.unshift(excelKeys);
    const sheet = XLSX.utils.aoa_to_sheet(aoa, {raw:false,dateNF:'dd/mm/yyyy HH:mm:ss'});
    sheet["!cols"] = wscols;
    const workbook = { Workbook: { Views: [{ RTL: true }] }, Sheets: {}, SheetNames: [] }
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet 1");
    logger.info(`sheet was added to report.xlsx successfully`);
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  } catch (e) {
    console.log(e);
    logger.error(`faild to add data to report.xlsx because "${e.message}"`);
  }
}
