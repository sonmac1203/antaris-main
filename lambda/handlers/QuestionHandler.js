const {
    getRequestType,
    getIntentName,
    getSupportedInterfaces,
} = require('ask-sdk-core');
const aplUtils = require('../utils/apl.utils');
const skillUtils = require('../utils/skill.utils');

const QuestionHandler = {
    canHandle(handlerInput) {
        return (
            getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            getIntentName(handlerInput.requestEnvelope) === 'QuestionIntent'
        );
    },

    handle(handlerInput) {
        const { requestEnvelope, responseBuilder, attributesManager } =
            handlerInput;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const { name: surveyName } = sessionAttributes.chosenSurvey;

        const { question: questionText, index } =
            skillUtils.askQuestion(attributesManager);

        if (getSupportedInterfaces(requestEnvelope)['Alexa.Presentation.APL']) {
            const questionObj = {
                questionNumber: index + 1,
                questionText,
            };
            const aplDirective = aplUtils.getBasicQuestionAplDirective(
                questionObj,
                surveyName
            );
            responseBuilder.addDirective(aplDirective);
        }
        const speakOutput = `Question ${index + 1}: ${questionText}`;
        return responseBuilder
            .speak(speakOutput)
            .reprompt(questionText)
            .getResponse();
    },
};

module.exports = {
    QuestionHandler,
};
