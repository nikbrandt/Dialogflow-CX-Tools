const authClient = require('../helpers/AuthClient');
const { linkClient } = require('../helpers/LinkClient');

module.exports = () => {
    return new Promise(resolve => {
        const url = linkClient.agentURL + '/intents';
        
        authClient.request({
            url
        }).then(res => {
            console.log('hyah');
            console.log(res.data);
            resolve();
        }).catch(err => {
            console.log('error here :(');
            console.error(err);
            resolve();
        });
    });
}