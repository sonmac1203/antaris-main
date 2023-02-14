const axios = require('axios');
const utils = require('./util');
const zlib = require('zlib');

const host = 'https://f599-68-230-48-163.ngrok.io';

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
      responseType: 'arraybuffer',
    };

    try {
      console.log('IM IN FETCHSTUDY');
      console.log(apiRoute);
      const { data } = await axios.get(apiRoute, config);
      conso.log(data)''
      const stringifiedData = zlib.gunzipSync(data).toString();
      return JSON.parse(stringifiedData);
    } catch (error) {
      console.log('ERROR', error);
      const response = error.response;
      return response.data;
    }
  },

  async uploadResponses(sessionStorage) {
    const { studyName, participantID, questions, choosenStudyID } = sessionStorage;
    const responseData = {
      global_variables: {
        recorded_time: new Date(),
        study_name: studyName,
      },
    };

    responseData['responses'] = questions.map((q) => {
      return {
        question: {
          question_id: q.question_id,
          name: q.name,
          text: q.text,
        },
        value: q.answer,
      };
    });

    const apiRoute = `${host}/api/create_responses`;
    console.log(responseData);

    try {
      const { data } = await axios.post(apiRoute, {
        participantID: participantID,
        studyID: choosenStudyID,
        responseData: responseData,
      });
      console.log(data);
      return data;
    } catch (err) {
      console.log(err.response.data);
      return err.response.data;
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
