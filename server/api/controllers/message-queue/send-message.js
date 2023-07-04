import handlebars from 'handlebars'
import { sendNonTicket } from '../glassix/index.js'

export const sendMessage = async (jobData) => {
    try {
        const { clientData, generalData } = jobData
        const text = getText(generalData.Parameters, clientData, generalData.Message)
        return await sendNonTicket(generalData.departmentId, generalData, clientData.phone, text)
    } catch (error) {
        console.log('sendMessage ERR');
        console.log(error);
        return { error: true, message: error }
    }
}

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