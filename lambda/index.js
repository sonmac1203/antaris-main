const Alexa = require('ask-sdk-core');
const { LaunchRequestHandler } = require('./handlers/LaunchRequestHandler');
const { ChooseSurveyHandler } = require('./handlers/ChooseSurveyHandler');
const { BeginSurveyHandler } = require('./handlers/BeginSurveyHandler');
const { QuestionHandler } = require('./handlers/QuestionHandler');
const { AnswerHandler } = require('./handlers/AnswerHandler');
const {
    UserAuthenticationHandler,
} = require('./handlers/UserAuthenticationHandler');
const {
    ChooseSurveyFromAplHandler,
} = require('./handlers/ChooseSurveyFromAplHandler');

const {
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler,
    ErrorHandler,
} = require('./handlers/DefaultHandlers');
const { ProactiveEventHandler } = require('./handlers/ProactiveEventHandler');

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        UserAuthenticationHandler,
        ChooseSurveyHandler,
        ChooseSurveyFromAplHandler,
        BeginSurveyHandler,
        QuestionHandler,
        AnswerHandler,
        ProactiveEventHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
