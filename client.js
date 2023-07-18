const axios = require('axios');
const readline = require('readline');
const fs = require('fs');

const POST_EVENTS_ENDPOINT = 'http://localhost:8000/liveEvent';
const EVENTS_FILE_NAME = 'events.jsonl';

const headers = {
        'Authorization': 'secret',
    }
    

    

const lineReader = readline.createInterface({
    input: fs.createReadStream(EVENTS_FILE_NAME),
    crlfDelay: Infinity
    });

// Read file line by line
lineReader.on('line', async (line) => {
    let event = JSON.parse(line);
    postEvent(event);
});
// Close the connection when the file is read
lineReader.on('close', () => {
    console.log('File reading completed');
});

function postEvent(event) {
    axios.post(POST_EVENTS_ENDPOINT, event, {headers})
  .then(res => {
    console.log('Status Code:', res.status);
    const result = res.data;
    console.log('Result:', result);
  })
  .catch(err => {
    console.debug('Error: ', err.message);
  });
}
