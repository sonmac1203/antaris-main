/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const logic = require('./logic');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
    );
  },
  handle(handlerInput) {
    const speakOutput =
      'Welcome, you can say Hello or Help. Which would you like to try?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const UserVerificationIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'UserVerificationIntent'
    );
  },

  async handle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request;
    const { name: participantIDSlotName, value: participantIDSlotValue } =
      intent.slots.participantID;

    const response = await logic.fetchParticipantInfo(participantIDSlotValue);
    const { name: participantName, studies } = response.data;

    const sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.studies = studies;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    if (response.success) {
      const greeting = `Hi ${participantName}. Authorization has been completed`;
      const studyList = logic.getVerbalStudyList(
        studies.map((s) => s.antaris_id)
      );

      const speakOutput = `${greeting}. I see that you have ${studies.length} ${
        studies.length > 1 ? 'studies' : 'study'
      } assigned, which are ${studyList}. Say do the study selection to continue.`;
      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    } else {
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
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChooseStudyIntent'
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
      return handlerInput.responseBuilder
        .speak(
          `You chose study ${studyIDSlotValue}. Say activate fantastic health survey to start.`
        )
        .getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(
          `That does not match with any of your assigned studies. What is the study ID again?`
        )
        .addElicitSlotDirective(studyIDSlotName)
        .getResponse();
    }
  },
};

const BeginSurveyIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'BeginSurveyIntent'
    );
  },

  async handle(handlerInput) {
    const sessionAttributes =
      handlerInput.attributesManager.getSessionAttributes();
    const studyID = sessionAttributes.choosenStudyID;

    const response = await logic.fetchStudyInfo(studyID);
    // const questions = logic.populateQuestions(response.data.study_data);
    // sessionAttributes.questions = questions;
    // handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    const speakOutput =
      `Welcome to the Antaris health survey built by 23062 team. You chose ${studyID} We are Khaled, Darianne, Son, Wesley and Julianne! The first question is ${response.data.study_data['ODM']['$']['xmlns']} Say read the questions to continue.`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt('You can ask me to start reading the questions.')
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
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
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
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
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
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
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
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
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
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

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    UserVerificationIntentHandler,
    ChooseStudyIntentHandler,
    BeginSurveyIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/hello-world/v1.2')
  .lambda();
