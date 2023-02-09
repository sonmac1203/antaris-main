module.exports = {
    launchRequest: {
        DOCUMENT_ID:"Greeting",
        datasource: {
            "headlineTemplateData": {
                "type": "object",
                "objectId": "headlineSample",
                "properties": {
                    "backgroundImage": {
                        "contentDescription": null,
                        "smallSourceUrl": null,
                        "largeSourceUrl": null,
                        "sources": [
                            {
                                "url": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/headline/HeadlineBackground_Dark.png",
                                "size": "large"
                            }
                        ]
                    },
                    "textContent": {
                        "primaryText": {
                            "type": "PlainText",
                            "text": "Welcome to Antaris Health survey"
                        }
                    },
                    "logoUrl": "",
                    "hintText": "Try, \"Alexa, start my fantastic health survey\""
                }
            }
        },
    },
    authenticationIntent: {
        DOCUMENT_ID: "Authentication",
        datasource: {
            "headlineTemplateData": {
                "type": "object",
                "objectId": "headlineSample",
                "properties": {
                    "backgroundImage": {
                        "contentDescription": null,
                        "smallSourceUrl": null,
                        "largeSourceUrl": null,
                        "sources": [
                            {
                                "url": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/headline/HeadlineBackground_Dark.png",
                                "size": "large"
                            }
                        ]
                    },
                    "textContent": {
                        "primaryText": {
                            "type": "PlainText",
                            "text": "What is your participant id?"
                        }
                    },
                    "logoUrl": "",
                    "hintText": "Provide your participant id to continue"
                }
            }
        },
    },
    testIntent: {
        DOCUMENT_ID: "TestStudyList",
        datasource: {
            "textListData": {
                "type": "object",
                "objectId": "textListSample",
                "id": "textListSample"
                "backgroundImage": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/textlist/AlexaTextListBackground_Dark.png",
                            "size": "large"
                        }
                    ]
                },
                "title": "Hi Wesley",
                "primaryAction": {
                  "type": "SendEvent",
                  "arguments": [
                    "ListItemSelected",
                    "${ordinal}"
                  ]
                },
                "listItems": [
                    {
                        "primaryText": "First item primary text",
                        "secondaryText": "This is the secondary text",
                        "secondaryTextPosition": "bottom",
                        "touchForward": true,
                        "id": "studyItem",
                    },
                    {
                        "primaryText": "Ivy Lane Nursery and Tree Farm",
                        "secondaryText": "This is the secondary text",
                        "secondaryTextPosition": "bottom",
                        "touchForward": true,
                        "id": "studyItem",
                    }
                ],
                "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/templates_v3/logo/logo-modern-botanical-white.png",
            }
        },
    }
}