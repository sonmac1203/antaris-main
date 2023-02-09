const Alexa = require('ask-sdk-core');

const StudyItemEventHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
            && handlerInput.requestEnvelope.request.source.id === 'fadeHelloTextButton';
    },
    handle(handlerInput){
        console.log(handlerInput.requestEnvelope.request);
        const speakOutput = "Thank you for clicking the button! I imagine you already noticed that the text faded away. Tell me to start over to bring it back!";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Tell me to start over if you want me to bring the text back into view. Or, you can just say hello again.")
            .getResponse();
    }
}