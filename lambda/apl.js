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
                "id": "sonmac",
                "headerTitle": "Alexa text list header title",
                "headerSubtitle": "Header subtitle",
                "headerAttributionImage": "https://s3.amazonaws.com/ask-skills-assets/apl-layout-assets/attribution_dark_hub_prime.png",
                "backgroundImageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/BT6_Background.png",
                "listItemsToShow": [
                    {
                        "primaryText": "First item primary text",
                        "secondaryText": "This is the secondary text",
                        "secondaryTextPosition": "bottom",
                        "tertiaryText": "This is the tertiary text",
                        "tertiaryTextPosition": "bottom",
                        "ratingNumber": 2,
                        "imageThumbnailSource": "https://d2o906d8ln7ui1.cloudfront.net/images/md_brie.png",
                        "hideOrdinal": true,
                        "touchForward": true
                    },
                    {
                        "primaryText": "Second item in the list.",
                        "secondaryText": "Secondary text for the second item",
                        "imageThumbnailSource": "https://d2o906d8ln7ui1.cloudfront.net/images/md_gruyere.png",
                        "tertiaryText": "Tertiary text",
                        "tertiaryTextPosition": "bottom",
                        "ratingNumber": 0
                    },
                    {
                        "primaryText": "Third item in the list.",
                        "imageThumbnailSource": "https://d2o906d8ln7ui1.cloudfront.net/images/sm_blue.png"
                    },
                    {
                        "primaryText": "Fourth item in the list"
                    },
                    {
                        "primaryText": "Fifth item in the list"
                    },
                    {
                        "primaryText": "This list might have many more items"
                    }
                ]
            }
        },
    }
}