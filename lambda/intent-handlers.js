const Alexa = require('ask-sdk-core');
const utils = require('./util');

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
            const aplDirective = utils.getBasicAnnouncementAplDirective(
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

// const HelloWorldIntentHandler = {
//     canHandle(handlerInput) {
//         return (
//             Alexa.getRequestType(handlerInput.requestEnvelope) ===
//                 'IntentRequest' &&
//             Alexa.getIntentName(handlerInput.requestEnvelope) ===
//                 'HelloWorldIntent'
//         );
//     },
//     handle(handlerInput) {
//         const speakOutput = 'Hello World!';
//         return handlerInput.responseBuilder.speak(speakOutput).getResponse();
//     },
// };

module.exports = {
    LaunchRequestHandler,
};
