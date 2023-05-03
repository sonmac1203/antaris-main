const aplUtils = require('../utils/apl.utils');
const { welcomeStatements } = require('../statements');
const { getRequestType, getSupportedInterfaces } = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const { requestEnvelope, responseBuilder } = handlerInput;
        const { verbalMain, verbalSub, visualMain, visualSub } =
            welcomeStatements;
        const verbalOutput = `${verbalMain} ${verbalSub}`;

        if (getSupportedInterfaces(requestEnvelope)['Alexa.Presentation.APL']) {
            const aplDirective = aplUtils.getBasicAnnouncementAplDirective(
                visualMain,
                visualSub
            );
            responseBuilder.addDirective(aplDirective);
        }
        return responseBuilder
            .speak(verbalOutput)
            .reprompt(verbalOutput)
            .getResponse();
    },
};

module.exports = { LaunchRequestHandler };
