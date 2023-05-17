import handlebars from 'handlebars'
import { createTicket, sendNonTicket, sendTicketMessage } from '../glassix/index.js'

export const sendMessage = async (jobData) => {
    try {
        const { clientData, generalData } = jobData
        const text = getText(generalData.Parameters, clientData, generalData.Message)
        if (generalData.isNonTicket) {
            return await sendNonTicket(generalData.departmentId, generalData, clientData.phone, text)
        } else {
            const ticketId = await createTicket(generalData.departmentId, generalData, clientData)
            return await sendTicketMessage(generalData.departmentId, ticketId, text)
        }
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