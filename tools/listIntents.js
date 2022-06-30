const authClient = require('../helpers/AuthClient');
const { linkClient } = require('../helpers/LinkClient');

module.exports = () => {
    return new Promise(resolve => {
        // TODO: support for pageToken (multiple pages of intents.. if you have 1k+)
        const url = linkClient.agentURL + '/intents?intentView=INTENT_VIEW_PARTIAL&pageSize=1000';

        console.log('Requesting intents...');
        
        authClient.request({ url }).then(({ data }) => {
            const { intents } = data;
            // array of these bad boys: https://cloud.google.com/dialogflow/cx/docs/reference/rest/v3/projects.locations.agents.intents#Intent

            console.log('Intents are as follows:');
            intents.forEach(({ name, displayName, parameters, description }) => {
                console.log(`${displayName} (${name.slice(-36)})`);
                if (description)
                    console.log(description);
                if (parameters)
                    console.log(` - has ${parameters.length} parameter${parameters.length > 1 ? 's' : ''}.`);
            });

            resolve();
        }).catch(err => {
            console.log('Error listing intents.');
            console.error(err);

            resolve();
        });
    });
}