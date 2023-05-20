import logger from '../logger/index.js'
import XLSX from 'xlsx'


const reportKeys = {
  phone: "טלפון",
  createdAt: "הוסר בתאריך"
};

const wscols = [
    {wch:14},
    {wch:18}
];



const dbKeys = Object.keys(reportKeys).filter((key) => reportKeys[key]);
const excelKeys = Object.values(reportKeys).filter((val) => val);

export async function convertToExcelBlackList(data) {
  try {
    const aoa = data.map((obj) => dbKeys.map((key) => obj[key]));
    aoa.unshift(excelKeys);
    const sheet = XLSX.utils.aoa_to_sheet(aoa, {raw:false,dateNF:'dd/mm/yyyy HH:mm:ss'});
    sheet["!cols"] = wscols;
    const workbook = { Workbook: { Views: [{ RTL: true }] }, Sheets: {}, SheetNames: [] }
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet 1");
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  } catch (e) {
    console.log(e);
    logger.error(`faild to add data to report.xlsx because "${e.message}"`);
  }
}
