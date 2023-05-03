const {
    getRequestType,
    getIntentName,
    getSupportedInterfaces,
} = require('ask-sdk-core');
const aplUtils = require('../utils/apl.utils');
const { chooseSurveyStatements } = require('../utils/statements.utils');

const ChooseSurveyHandler = {
    canHandle(handlerInput) {
        return (
            getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            getIntentName(handlerInput.requestEnvelope) === 'ChooseStudyIntent'
        );
    },

    handle(handlerInput) {
        const { requestEnvelope, responseBuilder, attributesManager } =
            handlerInput;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const surveys = sessionAttributes.surveys;

        const { intent } = requestEnvelope.request;
        const { name: slotName, value: slotValue } = intent.slots.surveyName;

        const existingSurvey = surveys.find(
            (survey) => survey.name.toLowerCase() === slotValue
        );

        if (existingSurvey) {
            sessionAttributes.chosenSurvey = existingSurvey;
            attributesManager.setSessionAttributes(sessionAttributes);

            const { verbalMain, verbalSub, visualMain, visualSub } =
                chooseSurveyStatements;

            if (
                getSupportedInterfaces(requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const aplDirective = aplUtils.getBasicAnnouncementAplDirective(
                    visualMain(slotValue),
                    visualSub
                );
                responseBuilder.addDirective(aplDirective);
            }

            const verbalOutput = `${verbalMain(slotValue)} ${verbalSub}`;
            return responseBuilder
                .speak(verbalOutput)
                .reprompt(verbalSub)
                .getResponse();
        } else {
            const {
                verbalMainFail,
                verbalSubFail,
                visualMainFail,
                visualSubFail,
            } = chooseSurveyStatements;

            if (
                getSupportedInterfaces(requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const aplDirective = aplUtils.getBasicAnnouncementAplDirective(
                    visualMainFail,
                    visualSubFail
                );
                responseBuilder.addDirective(aplDirective);
            }

            const verbalOutput = `${verbalMainFail} ${verbalSubFail}`;

            return responseBuilder
                .speak(verbalOutput)
                .addElicitSlotDirective(slotName)
                .getResponse();
        }
    },
};

module.exports = {
    ChooseSurveyHandler,
};
