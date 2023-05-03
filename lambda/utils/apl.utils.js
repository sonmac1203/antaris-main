const {
    BG_URL,
    SECONDARY_BG_URL,
    HEADER_TITLE,
    LOGO_URL,
    QUESTION_HINT_TEXT,
} = require('../config/apl.config');

module.exports = {
    createDirectivePayload(
        aplDocumentId,
        dataSources = {},
        tokenId = 'documentToken'
    ) {
        return {
            type: 'Alexa.Presentation.APL.RenderDocument',
            token: tokenId,
            document: {
                type: 'Link',
                src: 'doc://alexa/apl/documents/' + aplDocumentId,
            },
            datasources: dataSources,
        };
    },
    getBasicAnnouncementAplDirective(text, hintText) {
        const DOCUMENT_ID = 'BasicAnnouncement';
        const dataSources = {
            templateData: {
                type: 'object',
                objectId: 'headline',
                properties: {
                    backgroundImage: {
                        contentDescription: null,
                        smallSourceUrl: null,
                        largeSourceUrl: null,
                        sources: [
                            {
                                url: BG_URL,
                                size: 'large',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'PlainText',
                            text: text,
                        },
                        headerTitle: {
                            type: 'PlainText',
                            text: HEADER_TITLE,
                        },
                    },
                    logoUrl: LOGO_URL,
                    hintText: hintText,
                },
            },
        };
        const payload = this.createDirectivePayload(
            DOCUMENT_ID,
            dataSources,
            'documentToken'
        );
        return payload;
    },

    getBasicQuestionAplDirective(question, surveyName) {
        const { questionNumber, questionText } = question;
        const DOCUMENT_ID = 'QuestionDisplay';
        const dataSources = {
            questionData: {
                type: 'object',
                objectId: 'questionDisplay',
                properties: {
                    backgroundImage: {
                        contentDescription: null,
                        smallSourceUrl: null,
                        largeSourceUrl: null,
                        sources: [
                            {
                                url: SECONDARY_BG_URL,
                                size: 'large',
                            },
                        ],
                    },
                    headerContent: {
                        questionNumber,
                        surveyName,
                    },
                    textContent: {
                        primaryText: {
                            type: 'PlainText',
                            text: questionText,
                        },
                    },
                    logoUrl: LOGO_URL,
                    hintText: QUESTION_HINT_TEXT,
                },
            },
        };

        const payload = this.createDirectivePayload(
            DOCUMENT_ID,
            dataSources,
            'documentToken'
        );
        return payload;
    },
    getSurveyListAplDirective(surveys, participantName) {
        const surveyNumber = surveys.length;
        const plural = surveyNumber > 1 ? 's' : '';
        const surveyNumberInText = `${surveyNumber} survey${plural}`;

        const listItems = surveys.map((s) => ({
            primaryText: s.name,
        }));

        const DOCUMENT_ID = 'SurveySelection';

        const dataSources = {
            surveyListData: {
                type: 'object',
                objectId: 'SurveySelectionList',
                backgroundImage: {
                    contentDescription: null,
                    smallSourceUrl: null,
                    largeSourceUrl: null,
                    sources: [
                        {
                            url: 'https://drive.google.com/uc?id=1Lxpj5z1TxXJcQO_JprXBBfxasp0Kzf8_',
                            size: 'large',
                        },
                    ],
                },
                headerContent: {
                    participantName: participantName,
                    surveyNumber: surveyNumberInText,
                },
                listItems: listItems,
                logoUrl: LOGO_URL,
            },
        };

        const payload = this.createDirectivePayload(
            DOCUMENT_ID,
            dataSources,
            'documentToken'
        );
        return payload;
    },
};
