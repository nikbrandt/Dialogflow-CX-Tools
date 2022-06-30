const { version, endpoints } = require('../apiSettings.json');

let project;
let location;
let agent;
let base;

const linkClient = {
    get locationURL() {
        return base + '/' + version + '/projects/' + project + '/locations/' + location;
    },
    get agentURL() {
        return this.locationURL + '/agents/' + agent;
    }
}

module.exports = {
    linkClient,
    updateProject: proj => {
        project = proj;
    },
    updateLocation: loc => {
        location = loc;
        base = endpoints[location];
    },
    updateAgent: age => {
        agent = age;
    }
}