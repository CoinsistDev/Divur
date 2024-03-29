import handlebars from 'handlebars'
import { sendNonTicket } from '../glassix/index.js'
import logger from '../../../utils/logger/index.js';

export const sendMessage = async (jobData) => {
    try {
        const { clientData, generalData } = jobData;
        const text = getText(generalData.Parameters, clientData, generalData.Message);
        return await sendNonTicket(generalData.departmentId, generalData, clientData.phone, text);
    } catch (error) {
        logger.error('Error encountered in sendMessage:', error);
        return { error: true, message: error.message };
    }
};

const escapeURL = (str) => {
    try {
        new URL(str);
        return new handlebars.SafeString(str);
    } catch (_) {
        return str; // If not a URL, return the string as is.
    }
}

const getText = (parameters, clientData, message) => {
    message = message.replaceAll('{{', '{{[').replaceAll('}}', ']}}')
    const func = handlebars.compile(message);
    let data = {};
    parameters.forEach((target) => {
        const value = clientData[target.fileParameter];
        data[target.messageParameter] = escapeURL(value);
    });
    return func(data);
}