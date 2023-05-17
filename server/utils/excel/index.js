import * as XLSX from "xlsx";
import _Loadash from 'lodash';

const phoneEntities = [
  "phone",
  "telephone",
  "phonenumber",
  "phone number",
  "phone-number",
  "phoneNumber",
  "נייד",
  "פלאפון",
  "מספר נייד",
  "מספר פלאפון",
  "טלפון",
  "מספר טלפון",
];

const excelToJson = async (file, isIntenational) => {
  const options = {};
  if (!file?.buffer) throw new Error("Excell file is missing");
  const workbook = XLSX.read(file.buffer, options);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const clientsData = XLSX.utils.sheet_to_json(worksheet, {
    raw: true,
    defval: null
  }).map(row => _Loadash.mapKeys(row, (value, key) => key.trim()));
  const keys = Object.keys(clientsData[0]).filter(x => !x.includes('EMPTY')).map(x => x.trim())
  const phoneHeader = keys.find((x) => phoneEntities.includes(x));
  if (!phoneHeader)
    throw new Error("No Column with phone number name was found");
  if (phoneHeader !== "phone")
    clientsData.forEach((elem) => {
      elem.phone = elem[phoneHeader];
      delete elem[phoneHeader];
      return elem;
    });
    clientsData.forEach(client => client.phone = removeWhieSpace(client.phone));
    if (!isIntenational){
      clientsData.forEach(client => client.phone = fixPhone(client.phone));
      console.log('israeli number');
    }
    console.log(clientsData);
  return clientsData
};

const fixPhone = (phoneNumber) => {
  if (phoneNumber.startsWith("0"))
    phoneNumber = phoneNumber.replace("0", "972");
  if (!phoneNumber.startsWith("972")) phoneNumber = "972" + phoneNumber;
  return phoneNumber
};

const removeWhieSpace = (phoneNumber) => {
  return  phoneNumber.toString().replaceAll("-", "").replaceAll("+", "").replaceAll(" ", "");
};

export { excelToJson };
