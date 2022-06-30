const readline = require('readline');
const fs = require('fs');

// check key

if (!fs.existsSync('./key.json')) {
    console.log('No JWT authentication key.json file found. For a guide to get this file, go to https://developers.google.com/identity/protocols/oauth2/service-account#creatinganaccount');
    process.exit();
}

// check config

let config;

{
    const EXPECTED_KEYS = [ 'projectID', 'locationID', 'agentID' ];

    if (!fs.existsSync('./config.json')) {
        console.log('No config.json file found.');
        process.exit();
    }

    config = require('./config.json');

    if (Array.isArray(config)) {
        config.forEach((innerConfig, index) => {
            const missingKeys = checkKeys(innerConfig);

            if (missingKeys.length > 0) {
                console.log(`Config ${index} config.json missing keys ${missingKeys.join(', ')}.`);
                process.exit();
            }
        });
    } else {
        const missingKeys = checkKeys(config);

        if (missingKeys.length > 0) {
            console.log(`File config.json missing keys ${missingKeys.join(', ')}.`);
            process.exit();
        }
    }

    function checkKeys(conf) {
        const missingKeys = [];

        EXPECTED_KEYS.forEach(key => {
            if (!(key in conf))
                missingKeys.push(key);
        });

        return missingKeys;
    }
}

// load tools

const toolsDir = fs.readdirSync('tools');
const tools = {};
let toolList = [];

tools.exit = () => {
    console.log('\nSee ya.');
    process.exit();
}

toolList.push('exit');

toolsDir.forEach(filename => {
    if (!filename.endsWith('.js'))
        return;

    const tool = filename.slice(0, -3);
    toolList.push(tool);
    
    tools[tool.toLowerCase()] = require(`./tools/${filename}`);
});

toolList = toolList.join(', ');

// prompt for config number

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (Array.isArray(config) && config.length === 1)
    config = config[0];

if (Array.isArray(config)) {
    console.log('\nWhich config would you like?\n');

    config.forEach((conf, i) => {
        console.log(`${i}. ${conf.name}`);
    });

    rl.question(`[0-${config.length - 1}]: `, answer => {
        if (!answer) {
            console.log('Invalid input');
            process.exit();
        }

        let num = parseInt(answer);
        if (num < 0 || num >= config.length) {
            console.log('Out of config number bounds');
            process.exit();
        }

        config = config[num];
        setVars();
        prompt();
    });
} else {
    setVars();
    prompt();
}

// set LinkClient vars

function setVars() {
    console.log(config);

    const funcs = require('./helpers/LinkClient');

    funcs.updateAgent(config.agentID);
    funcs.updateLocation(config.locationID);
    funcs.updateProject(config.projectID);

    console.log('success');
}

// prompt for tools

function prompt() {
    rl.question(`\nWhich tool would you like?\nAvailable: ${toolList}\n     Tool: `, async answer => {
        answer = answer.toLowerCase();

        if (answer in tools) {
            console.log();
            await tools[answer]();
            console.log('\n');
            prompt();
        } else {
            console.log('Invalid tool.');
            prompt();
        }
    });
}