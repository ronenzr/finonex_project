var express = require("express");
const fs = require('fs');
const Pool = require('pg').Pool;

const pgClient = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'finonex_exam_db',
    user: 'postgres',
    password: 'postgres123',
  });

const app = express();
app.use(express.json())  

const EVENTS_FILE_NAME = 'posted_user_events.jsonl';
const RETRIEVE_USER_REVENUE_QUERY = 'SELECT * FROM users_revenue WHERE user_id = $1'


app.post("/liveEvent", (request, response) => {
    if (!validateAuth(request, response)) return;
    if (!validateEvent(request, response)) return;
    let event = request.body;
    setTimeout(() => {
        saveEventToFile(event);
    }, 50);

    response.status(200).send('request successful');
})

app.get("/userEvents/:userId", async (request, response) => {
    if (!validateAuth(request, response)) return;
    if (!validateUser(request, response)) return;
    
    fetchUserRevenue(request.params.userId, response);

    response.status(200).send(rows);
})

app.listen(8000, () => {
 console.log("Server running on port 8000");
});

function validateAuth(req, res) {
    if (isAuthenticated(req.headers))  return true;   

    res.status(401).send('unauthorized');
    return false;
}

function isAuthenticated(headers) {
    return headers.authorization && headers.authorization === 'secret';
}

function validateEvent(req, res) {
    let event = req.body;
    if (!event || !event.userId || !event.name || !event.value) 
    {
        res.status(400).send('event object is not valid');
        return false;
    }
    
    return true;
}

function validateUser(req, res) {
    if (req.params.userId) return true;

    res.status(400).send('user id is missing');
    return false;
}

function saveEventToFile(event) {
    console.log('event');
    let eventStr = JSON.stringify(event);

    fs.appendFile(EVENTS_FILE_NAME, `${eventStr}\n`, (error) => {
        if (error) {
          console.error('Error appending lines to file:', error);
        } else {
          console.log('Lines appended to file successfully');
        }
      });
}

async function fetchUserRevenue(userId, res) {
    console.debug(`Retrieving user revenue for user '${request.params.userId}'`);
    try {
        const { rows } = await pgClient.query(RETRIEVE_USER_REVENUE_QUERY, [request.params.userId]);
        console.log(`Query executed for user '${request.params.userId}'. Result:`, rows);
    } catch (error) {
        res.status(500).send('Failed to retrieve user revenue:' + error.message);
        console.log(`Failed to retrieve user revenue. Result:`, error);
    }
    return rows;
}

