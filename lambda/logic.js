const axios = require('axios');

const host = 'https://7480-68-104-159-200.ngrok.io';

module.exports = {
  async fetchParticipantInfo(participantID) {
    const apiRoute = `${host}/api/participants/${participantID}?fields=antaris_id,name,studies`;
    const config = {
      timeout: 6500,
    };
    try {
      const response = await axios.get(apiRoute, config);
      return response.data;
    } catch (error) {
      console.log('ERROR', error);
      const response = error.response;
      return response.data;
    }
  },

  getVerbalStudyList(studies) {
    const len = studies.length;
    let speech = '';
    for (const i = 0; i < len; i++) {
      if (i !== len - 1) {
        speech += `, ${studies[i]}`;
      } else {
        speech += `and ${studies[i]}.`;
      }
    }
    return speech;
  },
};
