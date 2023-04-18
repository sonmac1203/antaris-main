const Alexa = require('ask-sdk-core');
const utils = require('../util');
const logic = require('../logic');

const UserAuthenticationHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) ===
                'UserAuthenticationIntent'
        );
    },
    async handle(handlerInput) {
        // destructure attributes
        const { intent } = handlerInput.requestEnvelope.request;
        const { name: secondaryIdSlotName, value: secondaryIdSlotValue } =
            intent.slots.secondaryId;
        const { userId } = handlerInput.requestEnvelope.context.System.user;

        // fetch participant data from database
        const response = await logic.fetchParticipantInfo(
            secondaryIdSlotValue,
            userId
        );

        // determine response logics
        if (response.success) {
            const {
                demographics,
                assigned_surveys: surveys,
                project_id: projectId,
                participant_identifier,
            } = response.data;
            const participantName = `${demographics.first_name}`;

            // trigger session storage
            const sessionAttributes =
                handlerInput.attributesManager.getSessionAttributes();
            sessionAttributes.surveys = surveys;
            sessionAttributes.secondaryId = secondaryIdSlotValue;
            sessionAttributes.projectId = projectId;
            sessionAttributes.participantId = participant_identifier;
            handlerInput.attributesManager.setSessionAttributes(
                sessionAttributes
            );

            if (
                Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const aplDirective = utils.getSurveyListAplDirective(
                    surveys,
                    participantName
                );
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            const greeting = `Hi ${participantName}`;
            const surveyList = logic.getVerbalSurveyList(surveys);
            const numberOfSurveys = surveys.length;
            const plural = numberOfSurveys === 1 ? '' : 's';

            const speakOutput = `${greeting}. You have ${numberOfSurveys} survey${plural} assigned, which ${
                plural ? 'are' : 'is'
            } ${surveyList}. Say do survey selection to continue.`;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } else {
            if (
                Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const aplDirective = utils.getBasicAnnouncementAplDirective(
                    'No articipant is found with this id.',
                    'Try telling me your participant id again.'
                );
                handlerInput.responseBuilder.addDirective(aplDirective);
            }

            const speakOutput =
                'Sorry, no participant is found with this i d. What is your secondary i d again?';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .addElicitSlotDirective(secondaryIdSlotName)
                .getResponse();
        }
    },
};

module.exports = {
    UserAuthenticationHandler,
};
