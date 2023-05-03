const axios = require('axios');
const apiConfig = require('../config/api.config');

module.exports = {
    async uploadResponse(question, surveyId, participantId, projectId) {
        const {
            text: question_text,
            identifier: question_identifier,
            answer: answer_text,
        } = question;
        const requestBody = { answer_text, question_text, question_identifier };
        const requestParams = {
            params: {
                survey_id: surveyId,
                participant_identifier: participantId,
                project_id: projectId,
            },
        };
        const route = apiConfig.getResponseUploadRoute();
        try {
            const { data } = await axios.post(
                route,
                requestBody,
                requestParams
            );
            return data;
        } catch (err) {
            console.log(err.response.data);
            return err.response.data;
        }
    },
};
