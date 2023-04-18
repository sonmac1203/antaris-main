const ProactiveEventHandler = {
    canHandle(handlerInput) {
        console.log(handlerInput);

        return (
            handlerInput.requestEnvelope.request.type ===
            'AlexaSkillEvent.ProactiveSubscriptionChanged'
        );
    },

    handle(handlerInput) {
        console.log(
            'AWS User ' +
                handlerInput.requestEnvelope.context.System.user.userId
        );

        console.log(
            'API Endpoint ' +
                handlerInput.requestEnvelope.context.System.apiEndpoint
        );

        console.log(
            'Permissions' +
                JSON.stringify(
                    handlerInput.requestEnvelope.request.body.subscriptions
                )
        );
    },
};

module.exports = {
    ProactiveEventHandler,
};
