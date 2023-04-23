const {
    getRequestType,
    getIntentName,
    getSupportedInterfaces,
} = require('ask-sdk-core');
const utils = require('../util');
const logic = require('../logic');
const { authenticationStatements } = require('../statements');

const UserAuthenticationHandler = {
    canHandle(handlerInput) {
        return (
            getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            getIntentName(handlerInput.requestEnvelope) ===
                'UserAuthenticationIntent'
        );
    },
    async handle(handlerInput) {
        const { requestEnvelope, responseBuilder, attributesManager } =
            handlerInput;

        // destructure attributes
        const { userId } = requestEnvelope.context.System.user;
        const { intent } = requestEnvelope.request;
        const { name: slotName, value: slotValue } = intent.slots.secondaryId;

        // fetch participant data from database
        const response = await logic.fetchParticipantInfo(slotValue, userId);

        // determine response logics
        if (response.success) {
            const {
                demographics,
                assigned_surveys: surveys,
                project_id: projectId,
                participant_identifier,
            } = response.data;
            const participantName = `${demographics.first_name}`;
            
            if (surveys.length === 0) {
                const { verbalMainEmpty, verbalSubEmpty, visualMainEmpty, visualSubEmpty } = authenticationStatements;
                if (
                    getSupportedInterfaces(requestEnvelope)[
                        'Alexa.Presentation.APL'
                    ]
                ) {
                    const aplDirective = utils.getBasicAnnouncementAplDirective(
                        visualMainEmpty(participantName),
                        visualSubEmpty
                    );
                    responseBuilder.addDirective(aplDirective);
                }
                
                const verbalOutput = `${verbalMainEmpty(participantName)} ${verbalSubEmpty}`;
                return responseBuilder.speak(verbalOutput).getResponse();
            }
            else {
    
                // trigger session storage
                const sessionAttributes = attributesManager.getSessionAttributes();
                sessionAttributes.surveys = surveys;
                sessionAttributes.secondaryId = slotValue;
                sessionAttributes.projectId = projectId;
                sessionAttributes.participantId = participant_identifier;
                attributesManager.setSessionAttributes(sessionAttributes);
    
                if (
                    getSupportedInterfaces(requestEnvelope)[
                        'Alexa.Presentation.APL'
                    ]
                ) {
                    const aplDirective = utils.getSurveyListAplDirective(
                        surveys,
                        participantName
                    );
                    responseBuilder.addDirective(aplDirective);
                }
                const surveyList = logic.getVerbalSurveyList(surveys);
    
                const { verbalMain, verbalSub } = authenticationStatements;
    
                const verbalOutput = `${verbalMain(
                    participantName,
                    surveys.length,
                    surveyList
                )} ${verbalSub}`;
    
                return responseBuilder.speak(verbalOutput).reprompt(verbalSub).getResponse();
                
            }

        } else {
            if (
                getSupportedInterfaces(requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const { visualMainFail, visualSubFail } =
                    authenticationStatements;

                const aplDirective = utils.getBasicAnnouncementAplDirective(
                    visualMainFail,
                    visualSubFail
                );
                responseBuilder.addDirective(aplDirective);
            }
            const { verbalMainFail, verbalSubFail } = authenticationStatements;
            const verbalOutput = `${verbalMainFail} ${verbalSubFail}`;

            return responseBuilder
                .speak(verbalOutput)
                .addElicitSlotDirective(slotName)
                .getResponse();
        }
    },
};

module.exports = {
    UserAuthenticationHandler,
};
