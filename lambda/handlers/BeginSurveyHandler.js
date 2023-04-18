const {
    getRequestType,
    getIntentName,
    getSupportedInterfaces,
} = require('ask-sdk-core');
const utils = require('../util');
const { beginSurveyStatements } = require('../statements');

const BeginSurveyHandler = {
    canHandle(handlerInput) {
        return (
            getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            getIntentName(handlerInput.requestEnvelope) === 'BeginSurveyIntent'
        );
    },

    async handle(handlerInput) {
        const { requestEnvelope, responseBuilder, attributesManager } =
            handlerInput;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const { name: surveyName, content } = sessionAttributes.chosenSurvey;

        const questions = content.questions;
        const numberOfQuestions = questions.length;

        sessionAttributes.numberOfQuestions = numberOfQuestions;
        sessionAttributes.questionCounter = 0;
        attributesManager.setSessionAttributes(sessionAttributes);

        const { verbalMain, verbalSub, visualMain, visualSub } =
            beginSurveyStatements;

        if (getSupportedInterfaces(requestEnvelope)['Alexa.Presentation.APL']) {
            const aplDirective = utils.getBasicAnnouncementAplDirective(
                visualMain(surveyName, numberOfQuestions),
                visualSub
            );
            responseBuilder.addDirective(aplDirective);
        }

        const verbalOutput = `${verbalMain(
            surveyName,
            numberOfQuestions
        )} ${verbalSub}`;
        return responseBuilder
            .speak(verbalOutput)
            .reprompt('You can ask me to start reading the questions.')
            .getResponse();
    },
};

module.exports = {
    BeginSurveyHandler,
};
