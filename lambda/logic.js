const axios = require('axios');
const utils = require('./util');
const zlib = require('zlib');

const host = 'https://6d98-150-135-165-49.ngrok.io';

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
      return error.response.data;
    }
  },

  async fetchStudyInfo(studyID) {
    const apiRoute = `${host}/api/studies/${studyID}?fields=antaris_id,study_data`;
    const config = {
      timeout: 10000,
        responseType: "arraybuffer",
    };
    
    
    try {
      const {data} = await axios.get(apiRoute, config);
      const stringifiedData = zlib.gunzipSync(data).toString().replace('\"',"'");
      console.log(stringifiedData);
      console.log(JSON.parse(stringifiedData))
        return JSON.parse(stringifiedData);
    } catch (error) {
      console.log('ERROR', error);
      const response = error.response;
      return response.data;
    }
  },
  
  getVerbalStudyList(studies) {
    const len = studies.length;
    if (len === 1) {
      return studies.toString();
    }
    let speech = '';
    for (let i = 0; i < len; i++) {
      if (i !== len - 1) {
        speech += `${studies[i]}, `;
      } else {
        speech += `and ${studies[i]}`;
      }
    }
    return speech;
  },

  populateQuestions(studyData) {
    const questionDefinitionArray =
      studyData['ODM']['Study'][0]['MetaDataVersion'][0]['ItemDef'];
    const questions = questionDefinitionArray.map(
      ({ $: questionInfo, Question }) => {
        const { OID, Name, DataType } = questionInfo;
        const [question] = Question;
        return {
          name: Name,
          questionID: OID,
          dataType: DataType,
          text: utils.getRawText(question.TranslatedText[0]),
        };
      }
    );

    return questions;
  },
};
