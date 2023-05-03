const HOST = 'https://b8b5-68-230-48-163.ngrok-free.app';

const getParticipantInfoRoute = (secondaryId) =>
    `${HOST}/api/dev/skill/participants/${secondaryId}`;

const getResponseUploadRoute = () => `${HOST}/api/dev/skill/responses/save`;

module.exports = {
    getParticipantInfoRoute,
    getResponseUploadRoute,
};
