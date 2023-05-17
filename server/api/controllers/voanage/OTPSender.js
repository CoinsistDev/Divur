import axios from 'axios'

const VonageApiKey = process.env.VOUNAGE_API_KEY;
const VonageApiSecret = process.env.VOUNAGE_API_SECRET;
const VonageBrandName = process.env.VOUNAGE_BRAND_NAME;

const sendOtp = async (phoneNumber) => {
    try {
        const response = await axios({
            method: 'get',
            url: `https://api.nexmo.com/verify/json?api_key=${VonageApiKey}&api_secret=${VonageApiSecret}&number=${phoneNumber}&brand=${VonageBrandName}&sender_id=CONSIST&code_length=6&workflow_id=2&pin_expiry=180`
        });
        console.log(response.data);
        switch (response.data.status) {
            case '0':
                return response.data.request_id
            case '10':
               // cancelOtp(response.data.request_id)
                throw new Error('שתי בקשות בו-זמנית לאותו מספר אינן מותרות, נסה שוב בעוד 10 דקות.');
            default:
              //  cancelOtp(response.data.request_id)
                throw new Error(response.data.error_text)
        }
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message
        throw new Error(message);
    }
};

const VerifyOtp = async (code, requestId) => {
    try {
        const response = await axios({
            method: 'get',
            url: `https://api.nexmo.com/verify/check/json?api_key=${VonageApiKey}&api_secret=${VonageApiSecret}&request_id=${requestId}&code=${code}`
        });
        switch (response.data.status) {
            case '0':
                return true
            case '10':
              //  cancelOtp(response.data.request_id)
                throw new Error('שתי בקשות בו-זמנית לאותו מספר אינן מותרות, נסה שוב בעוד 5 דקות.');
            default:
              //  cancelOtp(response.data.request_id)
                throw new Error(response.data.error_text)
        }
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message
        throw new Error(message);
    }
};

const cancelOtp = async (requestId) => {
    try {
        const response = await axios({
            method: 'get',
            url: `https://api.nexmo.com/verify/control/json?api_key=${VonageApiKey}&api_secret=${VonageApiSecret}&request_id=${requestId}&cmd=cancel`
        });
        console.log(response.data);
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message
        throw new Error(message);
    }
};


export { sendOtp, VerifyOtp, cancelOtp }