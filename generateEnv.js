// generateEnv.js
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const envVariables = [
    'REACT_APP_API_URL',
    'REACT_APP_WORKFLOW_HEADER'
];

const envFileContent = envVariables.map(key => {
    const value = process.env[key];
    if (value) {
        return `${key}=${value}`;
    } 
}).filter(Boolean).join('\n');

fs.writeFileSync('.env', envFileContent);

