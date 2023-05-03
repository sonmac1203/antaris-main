module.exports = {
    askQuestion(attributesManager) {
        const attributes = attributesManager.getSessionAttributes();
        const questionIndex = attributes.questionCounter;
        const { content } = attributes.chosenSurvey;
        const currentQuestion = content.questions[questionIndex];
        attributes.questionCounter += 1;
        attributesManager.setSessionAttributes(attributes);
        return {
            question: currentQuestion.text,
            index: questionIndex,
            identifier: currentQuestion.identifier,
        };
    },
    getVerbalSurveyList(surveys) {
        const surveyNames = surveys.reduce((acc, survey, index) => {
            if (index === 0) {
                return survey.name;
            } else if (index === surveys.length - 1) {
                return `${acc}, and ${survey.name}`;
            } else {
                return `${acc}, ${survey.name}`;
            }
        }, '');
        return surveyNames;
    },
};
