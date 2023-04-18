const { getVerbalFormat } = require('./util');

const teamName = getVerbalFormat('23062');

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
    visualMainFail: 'No articipant is found with this id.',
    visualSubFail: 'Try telling me your participant id again.',
};

const chooseSurveyStatements = {
    verbalMain: (surveyName) => `You chose ${surveyName}`,
    verbalSub: 'Say, begin survey to start.',
    visualMain: (surveyName) => `You chose ${surveyName}`,
    visualSub: 'Say "Begin survey" to start.',
    verbalMainFail: 'That does not match with any of your assigned surveys.',
    verbalSubFail: 'What is the survey name again?',
    visualMainFail: "I can't find any survey with that name.",
    visualSubFail: 'What is the survey name again?',
};

module.exports = {
    welcomeStatements,
    authenticationStatements,
    chooseSurveyStatements,
};
