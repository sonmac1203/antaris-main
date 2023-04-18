/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const logic = require('./logic');
const utils = require('./util');
const { welcomeStatements } = require('./statements');
const { LaunchRequestHandler } = require('./handlers/LaunchRequestHandler');
const {
    UserAuthenticationHandler,
} = require('./handlers/UserAuthenticationHandler');
const { ChooseSurveyHandler } = require('./handlers/ChooseSurveyHandler');

// const ChooseStudyIntentHandler = {
//     canHandle(handlerInput) {
//         return (
//             Alexa.getRequestType(handlerInput.requestEnvelope) ===
//                 'IntentRequest' &&
//             Alexa.getIntentName(handlerInput.requestEnvelope) ===
//                 'ChooseStudyIntent'
//         );
//     },

//     handle(handlerInput) {
//         const sessionAttributes =
//             handlerInput.attributesManager.getSessionAttributes();
//         const surveys = sessionAttributes.surveys;

//         const { intent } = handlerInput.requestEnvelope.request;
//         const { name: surveyNameSlotName, value: surveyNameSlotValue } =
//             intent.slots.surveyName;
//         const existingSurvey = surveys.find(
//             (survey) => survey.name.toLowerCase() === surveyNameSlotValue
//         );

//         if (existingSurvey) {
//             sessionAttributes.chosenSurvey = existingSurvey;
//             handlerInput.attributesManager.setSessionAttributes(
//                 sessionAttributes
//             );

//             const visualStatement = `You chose survey ${surveyNameSlotValue}.`;
//             const verbalStatement = `You chose study ${surveyNameSlotValue}.`;
//             const subStatement = `Say "Begin survey" to start.`;

//             if (
//                 Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
//                     'Alexa.Presentation.APL'
//                 ]
//             ) {
//                 const aplDirective = utils.getBasicAnnouncementAplDirective(
//                     visualStatement,
//                     subStatement
//                 );
//                 handlerInput.responseBuilder.addDirective(aplDirective);
//             }

//             return handlerInput.responseBuilder
//                 .speak(`${verbalStatement} ${subStatement}`)
//                 .getResponse();
//         } else {
//             const statement =
//                 'I cannot find any assigned survey with that name.';
//             const subStatement = 'What is the survey name again?';
//             if (
//                 Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
//                     'Alexa.Presentation.APL'
//                 ]
//             ) {
//                 const aplDirective = utils.getBasicAnnouncementAplDirective(
//                     statement,
//                     subStatement
//                 );
//                 handlerInput.responseBuilder.addDirective(aplDirective);
//             }
//             return handlerInput.responseBuilder
//                 .speak(
//                     `That does not match with any of your assigned surveys. What is the survey name again?`
//                 )
//                 .addElicitSlotDirective(surveyNameSlotName)
//                 .getResponse();
//         }
//     },
// };

const StudySelectionEventHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
                'Alexa.Presentation.APL.UserEvent' &&
            handlerInput.requestEnvelope.request.arguments[0] ===
                'SurveySelected'
        );
    },
    handle(handlerInput) {
        const sessionAttributes =
            handlerInput.attributesManager.getSessionAttributes();
        const surveys = sessionAttributes.surveys;

        const chosenIndex =
            parseInt(handlerInput.requestEnvelope.request.arguments[1]) - 1;

        const existingSurvey = surveys[chosenIndex];
        sessionAttributes.chosenSurvey = existingSurvey;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        if (
            Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                'Alexa.Presentation.APL'
            ]
        ) {
            const statement = `You chose ${existingSurvey.name}.`;
            const subStatement = `Say "Begin survey" to start.`;
            const aplDirective = utils.getBasicAnnouncementAplDirective(
                statement,
                subStatement
            );
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        return handlerInput.responseBuilder
            .speak(
                `You chose ${existingSurvey.name}. Say "Begin survey" to start.`
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
        const { name: surveyName, content } = sessionAttributes.chosenSurvey;

        const questions = content.questions;
        const numberOfQuestions = questions.length;

        // sessionAttributes.questions = questions;

        sessionAttributes.numberOfQuestions = numberOfQuestions;
        sessionAttributes.questionCounter = 0;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        // TODO: Fix this APL

        if (
            Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                'Alexa.Presentation.APL'
            ]
        ) {
            const statement = `Welcome to ${surveyName}. There are ${numberOfQuestions} questions in this survey.`;
            const subStatement = `Say "Read all questions" to start.`;
            const aplDirective = utils.getBasicAnnouncementAplDirective(
                statement,
                subStatement
            );
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        const speakOutput = `Welcome to ${surveyName}. You have ${numberOfQuestions} questions in this survey. Please now say read all questions to start.`;
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
        const sessionAttributes =
            handlerInput.attributesManager.getSessionAttributes();
        const { name: surveyName } = sessionAttributes.chosenSurvey;

        const { question: questionText, index } = askQuestion(handlerInput);
        // TODO: Fix this APL
        if (
            Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                'Alexa.Presentation.APL'
            ]
        ) {
            const questionObj = {
                questionNumber: index + 1,
                questionText,
            };
            const aplDirective = utils.getBasicQuestionAplDirective(
                questionObj,
                surveyName
            );
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        const speakOutput = `Question ${index + 1}: ${questionText}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(questionText)
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

        const { name: surveyName } = sessionAttributes.chosenSurvey;

        sessionAttributes.chosenSurvey.content.questions[
            currentQuestionIndex - 1
        ]['answer'] = answerIDSlotValue;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        const question =
            sessionAttributes.chosenSurvey.content.questions[
                currentQuestionIndex - 1
            ];
        const surveyId = sessionAttributes.chosenSurvey.surveyID;
        const projectId = sessionAttributes.projectId;
        const participantId = sessionAttributes.participantId;

        const apiResponse = await logic.uploadResponse(
            question,
            surveyId,
            participantId,
            projectId
        );

        if (currentQuestionIndex === numberOfQuestions) {
            // const apiResponse = await logic.uploadResponses(sessionAttributes);

            // TODO: Fix this APL
            if (
                Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const statement = 'You have answered all the questions.';
                const subStatement = 'Say "Exit" to stop the survey.';
                const aplDirective = utils.getBasicAnnouncementAplDirective(
                    statement,
                    subStatement
                );
                handlerInput.responseBuilder.addDirective(aplDirective);
            }

            const speakOutput = `You have answered all the questions. ${apiResponse.message}. Say exit to stop.`;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } else {
            const { question: questionText, index } = askQuestion(handlerInput);
            if (
                Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const questionObj = {
                    questionNumber: index + 1,
                    questionText,
                };
                const aplDirective = utils.getBasicQuestionAplDirective(
                    questionObj,
                    surveyName
                );
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            const speakOutput = `Question ${index + 1}: ${questionText}`;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(questionText)
                .getResponse();
        }
    },
};

const ProactiveEventHandler = {
    canHandle(handlerInput) {
        console.log(handlerInput);

        return (
            handlerInput.requestEnvelope.request.type ===
            'AlexaSkillEvent.ProactiveSubscriptionChanged'
        );
    },

    handle(handlerInput) {
        console.log(
            'AWS User ' +
                handlerInput.requestEnvelope.context.System.user.userId
        );

        console.log(
            'API Endpoint ' +
                handlerInput.requestEnvelope.context.System.apiEndpoint
        );

        console.log(
            'Permissions' +
                JSON.stringify(
                    handlerInput.requestEnvelope.request.body.subscriptions
                )
        );
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
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const questionIndex = attributes.questionCounter;
    const { content } = attributes.chosenSurvey;
    const currentQuestion = content.questions[questionIndex];
    attributes.questionCounter += 1;
    handlerInput.attributesManager.setSessionAttributes(attributes);

    return {
        question: currentQuestion.text,
        index: questionIndex,
        identifier: currentQuestion.identifier,
    };
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        UserAuthenticationHandler,
        ChooseSurveyHandler,
        BeginSurveyIntentHandler,
        QuestionIntentHandler,
        AnswerIntentHandler,
        ProactiveEventHandler,
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
