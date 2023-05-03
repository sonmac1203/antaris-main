const axios = require('axios');
const apiConfig = require('../config/api.config');

module.exports = {
    async fetchParticipantInfo(secondaryId, userId) {
        const route = apiConfig.getParticipantInfoRoute(secondaryId);
        const config = {
            params: {
                user_id: userId,
            },
            timeout: 20000,
            responseType: 'json',
            decompress: true,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };
        try {
            const { data } = await axios.get(route, config);
            return data;
        } catch (error) {
            console.log('ERROR', error);
            return error.response.data;
        }
    },
};
