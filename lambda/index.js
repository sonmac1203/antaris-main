/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const logic = require('./logic');
const apl = require('./apl');
const utils = require('./util');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
            'LaunchRequest'
        );
    },
    handle(handlerInput) {
        const aplResponse = apl.launchRequest;
        const speakOutput =
            'Welcome to the Antaris health survey built by 23062 team. Say do authentication to continue.';

        if (
            Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                'Alexa.Presentation.APL'
            ]
        ) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = utils.createDirectivePayload(
                aplResponse.DOCUMENT_ID,
                aplResponse.datasource
            );
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

const UserAuthenticationIntentHandler = {
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
        const { name: participantIDSlotName, value: participantIDSlotValue } =
            intent.slots.participantID;

        // fetch participant data from database
        const response = await logic.fetchParticipantInfo(
            participantIDSlotValue
        );
        const { name: participantName, studies } = response.data;

        // trigger session storage
        const sessionAttributes =
            handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.studies = studies;
        sessionAttributes.participantID = participantIDSlotValue;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        const aplResponse = apl.authenticationIntent;

        // determine response logics
        if (response.success) {
            if (
                Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const studySelectionList = studies.map((study) => ({
                    primaryText: study.antaris_id,
                    secondaryText: `Assigned by ${study.added_by}`,
                }));
                const aplDirective = {
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: 'documentToken',
                    document: {
                        type: 'Link',
                        src: 'doc://alexa/apl/documents/StudySelectionList',
                    },
                    datasources: {
                        studySelectionListData: {
                            participantName: participantName,
                            numberOfActiveStudies: studies.length,
                            backgroundImageSource:
                                'https://d2o906d8ln7ui1.cloudfront.net/images/BT6_Background.png',
                            listItemsToShow: studySelectionList,
                        },
                    },
                };
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            const greeting = `Hi ${participantName}. Authorization has been completed`;
            const studyList = logic.getVerbalStudyList(
                studies.map((s) => s.antaris_id)
            );
            const speakOutput = `${greeting}. I see that you have ${
                studies.length
            } ${
                studies.length > 1 ? 'studies' : 'study'
            } assigned, which are ${studyList}. Say do the study selection to continue.`;
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
                    'Sorry, no participant is associated with this id.',
                    'Try telling me your participant id again.'
                );
                handlerInput.responseBuilder.addDirective(aplDirective);
            }

            const speakOutput =
                'Sorry, no participant is associated with this id. What is your participant id again?';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .addElicitSlotDirective(participantIDSlotName)
                .getResponse();
        }
    },
};

const ChooseStudyIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) ===
                'ChooseStudyIntent'
        );
    },

    handle(handlerInput) {
        const sessionAttributes =
            handlerInput.attributesManager.getSessionAttributes();
        const studies = sessionAttributes.studies;

        const { intent } = handlerInput.requestEnvelope.request;
        const { name: studyIDSlotName, value: studyIDSlotValue } =
            intent.slots.studyID;
        sessionAttributes.choosenStudyID = studyIDSlotValue;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        const studyExists = studies
            .map((s) => s.antaris_id)
            .includes(studyIDSlotValue);

        if (studyExists) {
            const statement = `You chose study ${studyIDSlotValue}.`;
            const subStatement = `Say \"Activate fantastic health survey\" to start.`;
            if (
                Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const aplDirective = utils.getBasicAnnouncementAplDirective(
                    statement,
                    subStatement
                );
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            return handlerInput.responseBuilder
                .speak(`${statement} $${subStatement}`)
                .getResponse();
        } else {
            const statement = 'I cannot find any assigned study with that id.';
            const subStatement = 'What is the study id again?';
            if (
                Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const aplDirective = utils.getBasicAnnouncementAplDirective(
                    statement,
                    subStatement
                );
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            return handlerInput.responseBuilder
                .speak(
                    `That does not match with any of your assigned studies. What is the study ID again?`
                )
                .addElicitSlotDirective(studyIDSlotName)
                .getResponse();
        }
    },
};

const StudySelectionEventHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                'Alexa.Presentation.APL.UserEvent'
        );
    },
    handle(handlerInput) {
        const sessionAttributes =
            handlerInput.attributesManager.getSessionAttributes();
        const studies = sessionAttributes.studies;
        const chosenIndex = handlerInput.requestEnvelope.request.arguments[1];
        const chosenStudy = studies[chosenIndex];

        if (
            Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                'Alexa.Presentation.APL'
            ]
        ) {
            const statement = `You chose study ${chosenStudy.antaris_id}.`;
            const subStatement = `Say \"Activate fantastic health survey\" to start.`;
            const aplDirective = utils.getBasicAnnouncementAplDirective(
                statement,
                subStatement
            );
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        return handlerInput.responseBuilder
            .speak(
                `You chose study ${chosenStudy.antaris_id}. Say activate fantastic health survey to start.`
            )
            .getResponse();
    },
};

const BeginSurveyIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) ===
                'BeginSurveyIntent'
        );
    },

    async handle(handlerInput) {
        const sessionAttributes =
            handlerInput.attributesManager.getSessionAttributes();
        const studyID = sessionAttributes.choosenStudyID;
        const { data } = await logic.fetchStudyInfo(studyID);
        const { global_variables: globalVariables, meta_data: metaData } =
            data.study_data;

        sessionAttributes.studyName = globalVariables.study_name;
        sessionAttributes.questions = metaData.questions;
        sessionAttributes.numberOfQuestions = metaData.questions.length;
        sessionAttributes.questionCounter = 0;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        const speakOutput = `Welcome to the study ${globalVariables.study_name}. You have ${metaData.questions.length} questions in this survey. Please now say read all questions to start.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('You can ask me to start reading the questions.')
            .getResponse();
    },
};

const QuestionIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) ===
                'QuestionIntent'
        );
    },

    handle(handlerInput) {
        const { question, index } = askQuestion(handlerInput);

        const speakOutput = `Question ${index + 1}: ${question}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(question)
            .getResponse();
    },
};

const AnswerIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent'
        );
    },

    async handle(handlerInput) {
        const sessionAttributes =
            handlerInput.attributesManager.getSessionAttributes();

        const { intent } = handlerInput.requestEnvelope.request;
        const { value: answerIDSlotValue } = intent.slots.answer;

        const currentQuestionIndex = sessionAttributes.questionCounter;
        const numberOfQuestions = sessionAttributes.numberOfQuestions;

        sessionAttributes.questions[currentQuestionIndex - 1].answer =
            answerIDSlotValue;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        if (currentQuestionIndex === numberOfQuestions) {
            const apiResponse = await logic.uploadResponses(sessionAttributes);
            console.log(apiResponse);
            const speakOutput = `You have answered all the questions. ${apiResponse.message}. Say exit to stop.`;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } else {
            const { question, index } = askQuestion(handlerInput);
            const speakOutput = `Question ${index + 1}: ${question}`;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(question)
                .getResponse();
        }
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) ===
                'AMAZON.HelpIntent'
        );
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                'IntentRequest' &&
            (Alexa.getIntentName(handlerInput.requestEnvelope) ===
                'AMAZON.CancelIntent' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) ===
                    'AMAZON.StopIntent')
        );
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    },
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) ===
                'AMAZON.FallbackIntent'
        );
    },
    handle(handlerInput) {
        const speakOutput = "Sorry, I don't know about that. Please try again.";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
            'SessionEndedRequest'
        );
    },
    handle(handlerInput) {
        console.log(
            `~~~~ Session ended: ${JSON.stringify(
                handlerInput.requestEnvelope
            )}`
        );
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder
            .speak('Thank you for taking the survey. See you next time.')
            .getResponse(); // notice we send an empty response
    },
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
            'IntentRequest'
        );
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered the damn ${intentName}`;

        return (
            handlerInput.responseBuilder
                .speak(speakOutput)
                //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse()
        );
    },
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput =
            'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

const askQuestion = (handlerInput) => {
    console.log('I AM IN ASKQUESTION');
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const questionIndex = attributes.questionCounter;
    const currentQuestion = attributes.questions[questionIndex];
    attributes.questionCounter += 1;

    handlerInput.attributesManager.setSessionAttributes(attributes);

    return { question: currentQuestion.text, index: questionIndex };
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        UserAuthenticationIntentHandler,
        ChooseStudyIntentHandler,
        BeginSurveyIntentHandler,
        QuestionIntentHandler,
        AnswerIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler,
        StudySelectionEventHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();

// The first question is ${response.data.study_data['ODM']['$']['xmlns']}
