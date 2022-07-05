# Dialogflow (CX) Tools

A collection of useful tools that Google Dialogflow (CX) does not implement itself; accessed via the Dialogflow API.

## Setup

1. `git clone` the repository to a local directory
2. Create a `config.json` and place inside it an object with the following properties:
   - `name` — The name of this configuration (optional, e.g. agent name)
   - `projectID` — Google Cloud project ID
   - `locationID` — Chatbot location ID (supported location IDs are the keys of the `endpoints` object in `apiSettings.json`)
   - `agentID` — Specific agent ID
3. If desired, create multiple of the above object types and place them in an array within `config.json` to have multiple configs to choose between
   - If necessary, edit `apiSettings.json` to change the endpoint, version, or login scopes. This generally shouldn't be required.
4. Create a service account key on [Google Cloud](https://console.cloud.google.com/apis/credentials/serviceaccountkey) and download the key JSON file. Rename it to `key.json` and place it in this directory.
5. `npm i` to install dependencies
6. `node .` to run the tools application. It will guide you through choosing config, tools, etc.

## API Limits

According to the [quotas and limits](https://cloud.google.com/dialogflow/quotas#cx-agent) page, Dialogflow CX edition limits API usage to 60 requests per minute for "Design-time requests" and 100 requests per minute for "Other session requests." These have no hard limits beyond these per-minute caps. Since this program should only be calling endpoints that fall under these two categories, API quotas should never be a problem when using these tools.

## Current Tools

This section may become out of date as development continues. Run the program (or look in the `tools` folder) to see all available tools.

### listIntents

Lists all intents without training phrases for the logged-in agent.

### savePhrases

Saves all phrases (from all or one specific intent) to a file of your choice. Useful for importing back into Dialogflow on another agent, for example (note: if exporting all intents, you must manually separate intents out into other files. Support for create a file per intent may be added in the future).