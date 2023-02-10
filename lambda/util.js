const AWS = require('aws-sdk');

const s3SigV4Client = new AWS.S3({
  signatureVersion: 'v4',
  region: process.env.S3_PERSISTENCE_REGION,
});

module.exports = {
  getS3PreSignedUrl: function getS3PreSignedUrl(s3ObjectKey) {
    const bucketName = process.env.S3_PERSISTENCE_BUCKET;
    const s3PreSignedUrl = s3SigV4Client.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: s3ObjectKey,
      Expires: 60 * 1, // the Expires is capped for 1 minute
    });
    console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
    return s3PreSignedUrl;
  },

  getRawText(text) {
    const rawText = text.replace(/\r|\n/g, '');
    return rawText;
  },
    createDirectivePayload(aplDocumentId, dataSources = {}, tokenId = "documentToken") {
        return {
            type: "Alexa.Presentation.APL.RenderDocument",
            token: tokenId,
            document: {
                type: "Link",
                src: "doc://alexa/apl/documents/" + aplDocumentId
            },
            datasources: dataSources
        }
    },
    
    getBasicAnnouncementAplDirective(text, hintText) {
        const DOCUMENT_ID = "BasicAnnouncement";
        const dataSources = {
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
                            "text": text
                        }
                    },
                    "logoUrl": "",
                    "hintText": hintText
                }
            }
        };
        
        return {
            type: "Alexa.Presentation.APL.RenderDocument",
            token: 'documentToken',
            document: {
                type: "Link",
                src: "doc://alexa/apl/documents/" + DOCUMENT_ID
            },
            datasources: dataSources
        }

    }
};
