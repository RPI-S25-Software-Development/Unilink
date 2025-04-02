const axios = require('axios');

async function callAPI() {
    try {
        const response = await axios.get('https://your-api-endpoint.com');
        console.log('API Response:', response.data);
    } catch (error) {
        console.error('Error calling API:', error.message);
    }
}

// Call API immediately, then every 24 hours (86400000 ms)
function startScheduler() {
    callAPI();
    setInterval(callAPI, 24 * 60 * 60 * 1000);
}

module.exports = startScheduler;