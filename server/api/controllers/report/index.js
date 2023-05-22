import { convertScheduledToExcel } from '../../../utils/excel/scheduled-distribution-tasks.js';
import { sendEmail } from '../../../utils/email/sendEmail.js';
import { getUser } from '../../../db/service/UserService.js';
import { getMinimalDetails } from '../departments/index.js';
import { uploadFileFromBuffer, getFileDownloadLink } from '../../../utils/blob-storage/upload-file.js';
import logger from '../../../utils/logger/index.js';

export const scheduledDistributionReport = async (req, res) => {
  const departmentId = req.params.id;
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);
  const scheduledDistribution = req.body;
  const updatedScheduledDistribution = scheduledDistribution.map(task => {
    return {
      ...task,
      status: task.status === 0 ? 'נשלחה בהצלחה' : task.status === 1 ? 'נכשלה' : task.status === 2 ? 'מחכה להשלח' : task.status === 3 ? 'בוטלה' : 'אין מידע זמין',
    };
  });
  const fileName = await generateFileName('דוח הפצות', departmentId, startDate, endDate);
  const excellBuffer = await convertScheduledToExcel(updatedScheduledDistribution);
  const upload = await uploadFileFromBuffer(fileName + '.xlsx', excellBuffer);
  const excelReportLink = await getFileDownloadLink(fileName + '.xlsx');
  const { email } = await getUser(req.userId);
  sendEmail(email, fileName, { excelReportLink }, './excelReportLink.handlebars');
  logger.info(`Sheet ${fileName}.xlsx was send to ${email} successfully`);
  res.send();
};

const generateFileName = async (fileName, departmentId, startDate, endDate) => {
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      endDate = new Date();
    }
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 4);
    }

    const { name: departmentName } = await getMinimalDetails(departmentId);
    const startDateFormat = `${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`;
    const endDateFormat = `${endDate.getDate()}-${endDate.getMonth() + 1}-${endDate.getFullYear()}`;
    return `${fileName} (${departmentName}) ${startDateFormat} - ${endDateFormat}`;
  };
  
  