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
        
        const firstUnansweredQuestionIndex = questions.findIndex(
          (question) => !question.answered
        );
        const surveyHasStarted = firstUnansweredQuestionIndex !== -1

        sessionAttributes.numberOfQuestions = numberOfQuestions;
        sessionAttributes.questionCounter = surveyHasStarted ? firstUnansweredQuestionIndex : 0;
        attributesManager.setSessionAttributes(sessionAttributes);
        

        const { verbalMain, verbalSub, visualMain, visualSub, verbalMainStarted, visualMainStarted } =
            beginSurveyStatements;

        if (getSupportedInterfaces(requestEnvelope)['Alexa.Presentation.APL']) {
            const actualNumberOfQuestions = surveyHasStarted ? numberOfQuestions - firstUnansweredQuestionIndex : numberOfQuestions;
            
            
            const aplDirective = utils.getBasicAnnouncementAplDirective(
                surveyHasStarted ? visualMainStarted(surveyName, actualNumberOfQuestions) : visualMain(surveyName, actualNumberOfQuestions),
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
