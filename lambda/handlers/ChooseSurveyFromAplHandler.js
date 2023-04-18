const { getRequestType, getSupportedInterfaces } = require('ask-sdk-core');
const utils = require('../util');
const { chooseSurveyStatements } = require('../statements');

const ChooseSurveyFromAplHandler = {
    canHandle(handlerInput) {
        return (
            getRequestType(handlerInput.requestEnvelope) ===
                'Alexa.Presentation.APL.UserEvent' &&
            handlerInput.requestEnvelope.request.arguments[0] ===
                'SurveySelected'
        );
    },

    handle(handlerInput) {
        const { requestEnvelope, responseBuilder, attributesManager } =
            handlerInput;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const surveys = sessionAttributes.surveys;

        const chosenIndex = parseInt(requestEnvelope.request.arguments[1]) - 1;

        const chosenSurvey = surveys[chosenIndex];

        sessionAttributes.chosenSurvey = chosenSurvey;
        attributesManager.setSessionAttributes(sessionAttributes);

        const { verbalMain, verbalSub, visualMain, visualSub } =
            chooseSurveyStatements;

        if (getSupportedInterfaces(requestEnvelope)['Alexa.Presentation.APL']) {
            const aplDirective = utils.getBasicAnnouncementAplDirective(
                visualMain(chosenSurvey.name),
                visualSub
            );
            responseBuilder.addDirective(aplDirective);
        }

        const verbalOutput = `${verbalMain(chosenSurvey.name)} ${verbalSub}`;
        return responseBuilder.speak(verbalOutput).getResponse();
    },
};

module.exports = {
    ChooseSurveyFromAplHandler,
};
