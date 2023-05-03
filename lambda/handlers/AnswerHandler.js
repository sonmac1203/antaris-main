const {
    getRequestType,
    getIntentName,
    getSupportedInterfaces,
} = require('ask-sdk-core');
const aplUtils = require('../utils/apl.utils');
const skillUtils = require('../utils/skill.utils');
const logic = require('../logic');
const { answerStatements } = require('../statements');

const AnswerHandler = {
    canHandle(handlerInput) {
        return (
            getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent'
        );
    },

    async handle(handlerInput) {
        const { requestEnvelope, responseBuilder, attributesManager } =
            handlerInput;

        const sessionAttributes = attributesManager.getSessionAttributes();

        const { intent } = requestEnvelope.request;
        const { value: slotValue } = intent.slots.answer;

        const {
            questionCounter: currentIndex,
            numberOfQuestions,
            chosenSurvey,
            projectId,
            participantId,
        } = sessionAttributes;

        const {
            name: surveyName,
            content: surveyContent,
            surveyID: surveyId,
        } = chosenSurvey;

        surveyContent.questions[currentIndex - 1]['answer'] = slotValue;
        attributesManager.setSessionAttributes(sessionAttributes);

        const question = surveyContent.questions[currentIndex - 1];

        await logic.uploadResponse(
            question,
            surveyId,
            participantId,
            projectId
        );

        const { verbalMain, verbalSub, visualMain, visualSub } =
            answerStatements;

        if (currentIndex === numberOfQuestions) {
            if (
                getSupportedInterfaces(requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const aplDirective = aplUtils.getBasicAnnouncementAplDirective(
                    visualMain,
                    visualSub
                );
                responseBuilder.addDirective(aplDirective);
            }

            const verbalOutput = `${verbalMain} ${verbalSub}`;
            return responseBuilder.speak(verbalOutput).getResponse();
        } else {
            const { question: questionText, index } =
                skillUtils.askQuestion(attributesManager);
            if (
                getSupportedInterfaces(requestEnvelope)[
                    'Alexa.Presentation.APL'
                ]
            ) {
                const questionObj = {
                    questionNumber: index + 1,
                    questionText,
                };
                const aplDirective = aplUtils.getBasicQuestionAplDirective(
                    questionObj,
                    surveyName
                );
                responseBuilder.addDirective(aplDirective);
            }
            const verbalOutput = `Question ${index + 1}, ${questionText}`;
            return responseBuilder
                .speak(verbalOutput)
                .reprompt(questionText)
                .getResponse();
        }
    },
};

module.exports = {
    AnswerHandler,
};
