const AWS = require('aws-sdk');

const s3SigV4Client = new AWS.S3({
    signatureVersion: 'v4',
    region: process.env.S3_PERSISTENCE_REGION,
});

const LOGO_URL = "https://drive.google.com/uc?id=1pHAgpzA_vlhZa291LLjlvO9R--0nhbQI";
const BACKGROUND_PHOTO_URL = 'https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/headline/HeadlineBackground_Dark.png';
const SECONDARY_BACKGROUND_PHOTO_URL = 'https://drive.google.com/uc?id=1iO9wfcV_NfJvosJtUEEVQ30HLqQi2WrA';
const THIRD_BACKGROUND_PHOTO_URL = 'https://drive.google.com/uc?id=1Lxpj5z1TxXJcQO_JprXBBfxasp0Kzf8_';
const HEADER_TITLE = "ENGR 498 CAPSTONE PROJECT - TEAM 23062";
const QUESTION_HINT_TEXT = 'Always start with "My answer is ..."';

module.exports = {
    getS3PreSignedUrl: function getS3PreSignedUrl(s3ObjectKey) {
        const bucketName = process.env.S3_PERSISTENCE_BUCKET;
        const s3PreSignedUrl = s3SigV4Client.getSignedUrl('getObject', {
            Bucket: bucketName,
            Key: s3ObjectKey,
            Expires: 60 * 1, // the Expires is capped for 1 minute
        });
        console.log(
            `Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`
        );
        return s3PreSignedUrl;
    },

    getRawText(text) {
        const rawText = text.replace(/\r|\n/g, '');
        return rawText;
    },
    
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
                objectId: "headline",
                properties: {
                    backgroundImage: {
                        contentDescription: null,
                        smallSourceUrl: null,
                        largeSourceUrl: null,
                        sources: [
                            {
                                url: BACKGROUND_PHOTO_URL,
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
                            type: "PlainText",
                            text: HEADER_TITLE,
                        },
                    },
                    logoUrl: LOGO_URL,
                    hintText: hintText,
                },
            },
        };
        const payload = this.createDirectivePayload(DOCUMENT_ID, dataSources, 'documentToken');
        return payload;
    },

    getBasicQuestionAplDirective(question, surveyName) {
        const { questionNumber, questionText } = question;
        const DOCUMENT_ID = 'QuestionDisplay';
        const dataSources = {
            questionData: {
                type: "object",
                objectId: "questionDisplay",
                properties: {
                    backgroundImage: {
                        "contentDescription": null,
                        "smallSourceUrl": null,
                        "largeSourceUrl": null,
                        "sources": [
                            {
                                url: SECONDARY_BACKGROUND_PHOTO_URL,
                                "size": "large"
                            }
                        ]
                    },
                    headerContent: {
                        questionNumber,
                        surveyName,
                    },
                    textContent: {
                        primaryText: {
                            type: "PlainText",
                            text: questionText,
                        }
                    },
                    logoUrl: LOGO_URL,
                    hintText: QUESTION_HINT_TEXT,
                },
            }
        };
        
        const payload = this.createDirectivePayload(DOCUMENT_ID, dataSources, "documentToken");
        return payload;
    },
    
    getSurveyListAplDirective(surveys, participantName) {
        // const listItems = surveys.map(s => ({
        //     primaryText: s.name,
        //     primaryAction: {
        //             type: "SendEvent",
        //             "arguments": [
        //                 "SurveySelected",
        //                 "${ordinal}"
        //             ]
        //         }
        // }))
        // const surveyNumber = surveys.length;
        // const plural = surveyNumber > 1 ? 's' : '';
        const DOCUMENT_ID = 'SurveySelection';
        
        const dataSources = {
            "surveyListData": {
                "type": "object",
                "objectId": "SurveySelectionList",
                "backgroundImage": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://drive.google.com/uc?id=1Lxpj5z1TxXJcQO_JprXBBfxasp0Kzf8_",
                            "size": "large"
                        }
                    ]
                },
                "headerContent": {
                    "participantName": "Wesley",
                    "surveyNumber": "3 surveys"
                },
                "listItems": [
                    {
                        "primaryText": "Peonies & Petals Nursery",
                        "primaryAction": {
                            "type": "SendEvent",
                            "arguments": [
                                "SurveySelected",
                                "${ordinal}"
                            ]
                        }
                    },
                    {
                        "primaryText": "Peonies & Petals Nursery",
                        "primaryAction": {
                            "type": "SendEvent",
                            "arguments": [
                                "SurveySelected",
                                "${ordinal}"
                            ]
                        }
                    }
                ],
                "logoUrl": "https://drive.google.com/uc?id=1pHAgpzA_vlhZa291LLjlvO9R--0nhbQI"
            }
        };
        
        const aplDirective = {
            type: "Alexa.Presentation.APL.RenderDocument",
            token: 'documentToken',
            document: {
                type: "Link",
                src: "doc://alexa/apl/documents/" + "SurveySelection"
            },
            datasources: dataSources,
        };
        
        // const payload = this.createDirectivePayload(DOCUMENT_ID, dataSources, "documentToken");
        return aplDirective;
    }
    
    
};
