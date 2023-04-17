const axios = require('axios');
const utils = require('./util');
const zlib = require('zlib');

const host = 'https://3fb6-68-230-48-163.ngrok-free.app';

module.exports = {
    async fetchParticipantInfo(secondaryId, userId) {
        // const apiRoute = `${host}/api/participants/${participantID}?fields=antaris_id,name,studies`;
        console.log(userId);
        console.log(secondaryId);
        const route = `${host}/api/dev/skill/participants/${secondaryId}`;
        const config = {
            params: {
                user_id: userId, 
            },
            timeout: 6500,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        try {
            const { data } = await axios.get(route, config);
            // console.log(data);
            // const stringifiedData = zlib.gunzipSync(data).toString();
            // console.log("IM IN FETCH");
            // console.log(JSON.parse(stringifiedData));
            console.log(data);
            return data;
        } catch (error) {
            console.log("IM IN FETCH ERROR HAHA");
            console.log('ERROR', error);
            return error.response.data;
        }
    },

    async fetchStudyInfo(studyID) {
        const apiRoute = `${host}/api/studies/${studyID}?fields=antaris_id,study_data`;
        const config = {
            timeout: 20000,
            responseType: 'arraybuffer',
        };

        try {
            const { data } = await axios.get(apiRoute, config);
            const stringifiedData = zlib.gunzipSync(data).toString();
            return JSON.parse(stringifiedData);
        } catch (error) {
            console.log('ERROR', error);
            const response = error.response;
            return response.data;
        }
    },

    async uploadResponses(sessionStorage) {
        const { studyName, participantID, questions, choosenStudyID } =
            sessionStorage;
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
    
    async uploadResponse(question, surveyId, participantId, projectId) {
        const {text: question_text, identifier: question_identifier, answer: answer_text} = question;
        
        const requestBody = {answer_text, question_text, question_identifier};
        const requestParams = {
            params: {
                survey_id: surveyId,
                participant_identifier: participantId,
                project_id: projectId
            }
        }
        
        const route = `${host}/api/dev/skill/responses/save`;
        
        try {
            const { data } = await axios.post(route, requestBody, requestParams);
            return data;
        } catch (err) {
            console.log(err.response.data);
            return err.response.data;
        }
    },

    // getVerbalStudyList(studies) {
    //     const len = studies.length;
    //     if (len === 1) {
    //         return this.getVerbalFormat(studies.toString());
    //     }
    //     let speech = '';
    //     for (let i = 0; i < len; i++) {
    //         const formattedStudyId = this.getVerbalFormat(studies[i]);
    //         if (i !== len - 1) {
    //             speech += `${formattedStudyId}, `;
    //         } else {
    //             speech += `and ${formattedStudyId}`;
    //         }
    //     }
    //     return speech;
    // },
    
    getVerbalSurveyList(surveys) {
        const surveyNames = surveys.reduce((acc, survey, index) => {
          if (index === 0) {
            return survey.name;
          } else if (index === surveys.length - 1) {
            return `${acc}, and ${survey.name}`;
          } else {
            return `${acc}, ${survey.name}`;
          }
        }, "");
        return surveyNames;
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

    getVerbalFormat(number) {
        return number.split('').join(' ');
    },
};
