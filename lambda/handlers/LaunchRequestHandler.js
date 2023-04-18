const { getRequestType, getSupportedInterfaces } = require('ask-sdk-core');
const { welcomeStatements } = require('../statements');
// const { getBasicAnnouncementAplDirective } = require('../util');

const Alexa = require('ask-sdk-core');
const utils = require('../util');

const {getBasicAnnouncementAplDirective} = utils;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
            'LaunchRequest'
        );
    },
    handle(handlerInput) {
        // const { verbalMain, verbalSub, visualMain, visualSub } =
        //     welcomeStatements;

        // console.log(verbalMain);

        const speakOutput = `HOHO`;

        if (
            Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                'Alexa.Presentation.APL'
            ]
        ) {
            const aplDirective = getBasicAnnouncementAplDirective(
                'HAHA',
                'HIHI'
            );
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

module.exports = { LaunchRequestHandler };
