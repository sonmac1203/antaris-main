const axios = require('axios');

const hostname = 'http://localhost:3000';

module.exports = {
    async fetchParticipantInfo(participantID) {
        const apiRoute = `${hostname}/api/participants/${participantID}?fields=antaris_id,name`;
        
        const config = {
            timeout: 6500
        }

        try {
            const response = await axios.get(apiRoute, config);
            return  response.data;
        } 
        catch (error) {
            console.log('ERROR', error);
            return null;
        }
    }
}