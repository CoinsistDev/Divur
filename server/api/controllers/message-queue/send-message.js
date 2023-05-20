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


const getText = (parameters, clientData, message) => {
    message = message.replaceAll('{{', '{{[').replaceAll('}}', ']}}')
    const func = handlebars.compile(message);
    let data = {};
    parameters.forEach((target) => {
        data[target.messageParameter] = clientData[target.fileParameter];
    });
    return func(data);
}