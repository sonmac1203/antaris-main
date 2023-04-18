const { getRequestType, getSupportedInterfaces } = require('ask-sdk-core');
const { welcomeStatements } = require('../statements');
const { getBasicAnnouncementAplDirective } = require('../util');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const { requestEnvelope, responseBuilder } = handlerInput;
        const { verbalMain, verbalSub, visualMain, visualSub } =
            welcomeStatements;
        const speakOutput = `${verbalMain} ${verbalSub}`;

        const supportsAPL =
            getSupportedInterfaces(requestEnvelope)['Alexa.Presentation.APL'];

        if (supportsAPL) {
            const aplDirective = getBasicAnnouncementAplDirective(
                visualMain,
                visualSub
            );
            responseBuilder.addDirective(aplDirective);
        }
        return responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

module.exports = { LaunchRequestHandler };
