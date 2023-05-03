# Antaris-main documentation

Antaris is a project from ENGR 498 Capstone class at the University of Arizona designed and developed by team 23062.

---
_Table of contents:_

- [Software concept and explanation](#software-concept-and-explanation)
  - [Interation models](#interation-models)
  - [Multimodal Responses](#multimodal-responses)
- [Intent handlers](#intent-handlers)


## Software concept and explanation

### Interation models

Interaction models are the entry points through which the Alexa device recognizes the functionalities of the skill and provides a corresponding response. More details about Interaction Model can be viewed here through Amazon documentation [here](https://developer.amazon.com/en-US/docs/alexa/custom-skills/create-the-interaction-model-for-your-skill.html)

The interation models in this Antaris skill include the following custom intents:
- UserAuthenticationIntent: handles the authentication of participants
- ChooseStudyIntent: provides the participant with a list of available surveys after successful authentication 
- BeginSurveyIntent: activates the survey after the participant has provided the choice or survey
- QuestionIntent: handles the participant's command to start reading the questions
- AnswerIntent: recogizes the answer from the participant to each survey

The intents in the Interation Model can be updated and developed further using either the built-in interface inside the Amazon Developer Console (recommended) or the Alexa Skills Toolkit extension that can be installed in VS Code.

### Multimodal Responses

Multimodal Responses are visual elements built in Alexa Presentation Language (APL) included in the Alexa's response to a command from the user (the participant) should their Alexa supports a display screen. Similarly to Interaction modes,  Multimodal Response can be developed using either the built-in interface inside the Amazon Developer Console (recommended) or the Alexa Skills Toolkit extension that can be installed in VS Code.

The Multimodal responses in this Antaris skill include the following visual models:
- BasicAnnoucement: a screen with a main text in the middle and a subtext at the bottom left. 
![BasicAnnouncement example](https://drive.google.com/uc?id=1tFPq9XDQoVYY7NcyXWKyGjtg3CcTi76N)

- QuestionDisplay: a screen with the question text in the middle, question number and survey name at the top left, and a subtext at the bottom left.
![QuestionDisplay example](https://drive.google.com/uc?id=1zyF6FmFqxlRtD66OAHNfHgM9jooHF8jX)

- SurveySelection: a screen with a list of available surveys in the middle and 2 lines of text at the top left corner that greets the authenticated user and let them know the number of surveys available.
![SurveySelection example](https://drive.google.com/uc?id=1lefbs68hevf2uvyDOaHxVBS9NvnyjASi)


## Intent handlers

Each intent described in [Interation models](#interation-models) above requires a handler which is a function declared inside `@/lambda/handlers`. The code in each intent handler will decide logics and actions that the Alexa skill will perform when that intent is triggered by the participant. 

For instance, at `@/lambda/handlers/UserAuthenticationHandler.js` we have the handler function for the UserAuthenticationIntent. 

All handler functions have to be imported into the index file at `@/lambda/index.js`, which serves as the entry point of all handlers, to be added to the `SkillBuilders` module from the `ask-sdk-core` package.

## External communications

This skill communicates with Antaris-web server in order to fetch participant data as well as to upload the response to MongoDB Atlas connected to Antaris-web server. At the moment, the functions to make the HTTP requests to Antaris-web's RESTful APIs are located at `@/lambda/services` and the configurations are located at `@/lambda/config/api.config.js`.

## Version control

During development, this skill is setup with Git and is configured to fetch from the Amazon Developer Console and to push to both the Amazon Developer Console and a Github repository (antaris-main). Please check out [this video](https://youtu.be/88AsF_xJsj0) to learn more about this setup.
