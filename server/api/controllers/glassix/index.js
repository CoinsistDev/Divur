import axios from 'axios';
import logger from '../../../utils/logger/index.js'
import Redis from 'ioredis';
import { getKeys } from '../departments/index.js';
import CryptoJS  from 'crypto-js'

const instance = axios.create();

instance.defaults.timeout = 15000;

const cryptoSecret = process.env.CRYPTO_SECRET;

const redis = new Redis({ maxRetriesPerRequest: null, });

const getToken = async (apiKey, apiSecret, userName, subDomain) => {
    try {
        const bytes =  CryptoJS.AES.decrypt(apiSecret, cryptoSecret);
        apiSecret = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const res = await instance({
            method: 'POST',
            url: `https://${subDomain}.glassix.com/api/v1.2/token/get`,
            headers: { 'Content-type': 'application/json' },
            data: { apiKey, apiSecret, userName }
        })
        return res.data
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message
        throw new Error(message);
    }
}




const getCannedReplies = async (departmentId) => {
    try {
        let cannedReplies = await redis.get(`getCannedReplies-${departmentId}`)
        if (cannedReplies){
            return JSON.parse(cannedReplies)
            }
             const {accessToken, subDomain} = await getGlassixToken(departmentId)
             const response = await instance({
                 method: 'get',
                 url: `https://${subDomain}.glassix.com/api/v1.2/cannedreplies/getall`,
                 headers: { Authorization: `Bearer ${accessToken}` },
                 
                });
                const whatsAppCanned = response.data.filter(x => x.categoryName === 'WhatsApp')
        await redis.set(`getCannedReplies-${departmentId}`, JSON.stringify(whatsAppCanned), 'EX', 2000)
        return whatsAppCanned;
        } catch (error) {
        const message = error.response?.data?.message || error.message
        throw new Error(message);
    }
};

const getEvents = async (departmentId) => {
    try {
        const {accessToken, subDomain} = await getGlassixToken(departmentId)
        const response = await instance({
            method: 'get',
            url: `https://${subDomain}.glassix.com/api/v1.2/webhooks/getevents?deleteEvents=false`,
            headers: { Authorization: `Bearer ${accessToken}` },

        });
        return response.data;
    } catch (error) {
        logger.error(departmentId)
        const message = error.response?.data?.message || error.message
        throw new Error(message);
    }
};

const deleteEvents = async (queueDetails, departmentId) => {
    try {
        const {accessToken, subDomain} = await getGlassixToken(departmentId)
        const response = await instance({
            method: 'POST',
            url: `https://${subDomain}.glassix.com/api/v1.2/webhooks/deleteevents`,
            headers: { Authorization: `Bearer ${accessToken}` },
            data : queueDetails
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message
        throw new Error(message);
    }
};

const sendNonTicket = async (departmentId, generaldata, phoneNumber, message) => {   
    try {
        const {accessToken, subDomain} = await getGlassixToken(departmentId)
        const response = await instance({
            method: 'POST',
            url: `https://${subDomain}.glassix.com/api/v1.2/protocols/send`,
            headers: { Authorization: `Bearer ${accessToken}` },
            data: {
                files: generaldata.imageUrl?  [generaldata.imageUrl] : [],
                text: message,
                protocolType: generaldata.protocolType,
                from: generaldata.From,
                to: phoneNumber
            }

        });
       // console.log(response.data);
        return { error: false, data: response.data }
    } catch (error) {
        const message = error.response?.data?.message || error.message
        console.log(message);
        logger.error(message)
        return { error: true, message }
        // throw new Error(message);
    }
};




const getGlassixToken = async (departmentId) => {
    try {
        let token = await redis.get(departmentId)
        if (token) return JSON.parse(token)
            const { apiKey, apiSecret, userName, subDomain } = await getKeys(departmentId)
            if (!(apiKey && apiSecret && userName && subDomain)) throw new Error(`missing keys to department ${departmentId}`)
            const glassixToken = await getToken(apiKey, apiSecret, userName, subDomain)
            const accessToken = glassixToken.access_token
            await redis.set(departmentId, JSON.stringify({accessToken, subDomain}), 'EX', glassixToken.expires_in)
        return {accessToken, subDomain}
    } catch (error) {
        console.log(error);
        let message = error.response && error.response.data.message ? error.response.data.message : error.message
        message += '| departmentId: ' + departmentId
        throw new Error(message);
    }
}


export { getCannedReplies, sendNonTicket, getEvents, deleteEvents }