const teamName = '2 3 0 6 2';

const plural = (count) => (count > 1 ? 's' : '');
const pluralToBe = (count) => (count > 1 ? 'are' : 'is');

const welcomeStatements = {
    verbalMain: `Welcome to Antaris by team ${teamName}.`,
    verbalSub: 'Say, do authentication to continue.',
    visualMain: 'Welcome to Antaris.',
    visualSub: 'Say "Do authentication" to continue.',
};

const authenticationStatements = {
    verbalMain: (participantName, numberOfSurveys, surveyList) =>
        `Hi ${participantName}. You have ${numberOfSurveys} survey${plural(
            numberOfSurveys
        )} assigned which ${pluralToBe(numberOfSurveys)} ${surveyList}.`,
    verbalSub: 'Say, do survey selection to continue.',
    verbalMainFail: 'Sorry, no participant is found with this i d.',
    verbalSubFail: 'What is your secondary i d again?',
    verbalMainEmpty: (participantName) =>
        `Hi ${participantName}. You don't have any surveys assigned.`,
    verbalSubEmpty: 'Say, exit to stop',
    visualMainFail: 'No articipant is found with this id.',
    visualSubFail: 'Try telling me your participant id again.',
    visualMainEmpty: 'You have no surveys assigned.',
    visualSubEmpty: 'Say "exit" to stop.',
};

const chooseSurveyStatements = {
    verbalMain: (surveyName) => `You chose ${surveyName}.`,
    verbalSub: 'Say, begin survey to start.',
    visualMain: (surveyName) => `You chose ${surveyName}.`,
    visualSub: 'Say "Begin survey" to start.',
    verbalMainFail: 'That does not match with any of your assigned surveys.',
    verbalSubFail: 'What is the survey name again?',
    visualMainFail: "I can't find any survey with that name.",
    visualSubFail: 'What is the survey name again?',
};

const beginSurveyStatements = {
    verbalMain: (surveyName, numberOfQuestions) =>
        `Welcome to ${surveyName}. You have ${numberOfQuestions} questions in this survey.`,
    verbalSub: 'Please now say, read all questions to start.',
    verbalMainStarted: (surveyName, numberOfQuestions) =>
        `Welcome to ${surveyName}. You have ${numberOfQuestions} unanswered questions for this survey.`,
    visualMain: (surveyName, numberOfQuestions) =>
        `Welcome to ${surveyName}. There are ${numberOfQuestions} questions in this survey.`,
    visualMainStarted: (surveyName, numberOfQuestions) =>
        `Welcome to ${surveyName}. You have ${numberOfQuestions} unanswered questions.`,
    visualSub: 'Say "Read all questions" to start.',
};

const answerStatements = {
    verbalMain: 'You have answered all questions.',
    verbalSub: 'Say, exit to stop the survey.',
    visualMain: 'You have answered all questions.',
    visualSub: 'Say "Exit" to stop the survey.',
};

module.exports = {
    welcomeStatements,
    authenticationStatements,
    chooseSurveyStatements,
    beginSurveyStatements,
    answerStatements,
};
