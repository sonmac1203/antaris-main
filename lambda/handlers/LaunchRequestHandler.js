const { welcomeStatements } = require('../statements');
const { getRequestType, getSupportedInterfaces } = require('ask-sdk-core');
const utils = require('../util');

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
            const aplDirective = utils.getBasicAnnouncementAplDirective(
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
