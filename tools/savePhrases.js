const fs = require('fs');
const readline = require('readline');

const authClient = require('../helpers/AuthClient');
const { linkClient } = require('../helpers/LinkClient');

const uuidRegex = /^[\da-zA-Z]{8}-[\da-zA-Z]{4}-[\da-zA-Z]{4}-[\da-zA-Z]{4}-[\da-zA-Z]{12}$/;

const RESET = "\x1b[0m"
const UNDERSCORE = "\x1b[4m"

module.exports = rl => {
    return new Promise(res => {
        rl.question(`Save training phrases from all intents or a specific intent? (${UNDERSCORE}a${RESET}ll/${UNDERSCORE}s${RESET}pecific): `, answer => {
            answer = answer.toLowerCase();
            
            if ('all'.startsWith(answer))
                saveAll(rl, res);
            else if ('specific'.startsWith(answer))
                saveSpecific(rl, res);
            else {
                console.log('Invalid choice.');
                res();
            }
        });
    });
}

function saveAll(rl, res) {
    const url = linkClient.agentURL + '/intents?intentView=INTENT_VIEW_FULL&pageSize=1000';

    console.log('Requesting intents...');

    authClient.request({ url }).then(({ data }) => {
        const { intents } = data;

        const phrases = intents.map(intent => getPhrasesAsStrings(intent));

        writeFile(rl, res, phrases.join('\n\n\n'));
    }).catch(err => {
        console.error('Error retrieving all intents for savePhrases');
        console.error(err);
        res();
    });
}

function saveSpecific(rl, res) {
    rl.question('Please give the 36-character ID of the intent: ', answer => {
        if (!uuidRegex.test(answer)) {
            console.log('Invalid UUID.');
            return res();
        }

        const url = linkClient.agentURL + '/intents/' + answer;

        console.log('Requesting intent...');

        authClient.request({ url }).then(({ data }) => {
            const phrases = getPhrasesAsStrings(data);

            writeFile(rl, res, phrases);
        }).catch(err => {
            console.error(`Error retrieving intent ${answer} for savePhrases`);
            console.error(err);
            res();
        });
    });
}

function getPhrasesAsStrings(intent) {
    let out = `${intent.displayName} (${intent.name.slice(-36)})\n\n"`;

    if (!intent.trainingPhrases)
        return out.slice(0,-1);
    
    const phrases = intent.trainingPhrases.map(phrase => {
        phrase = phrase.parts.map(part => part.text).join('');
        return phrase.replace(/"/g, '\'');
    });

    out += phrases.join('"\n"');
    out += '"\n';

    return out;
}

function writeFile(rl, res, text) {
    rl.question('Write to what filename? (Be sure to include .txt) ', answer => {
        fs.writeFile(answer, text, () => {
            console.log('Written. Note that all double quotes (") were replaced with single quotes (\') for compatibility with Dialogflow console upload.');
            res();
        });
    });
} 