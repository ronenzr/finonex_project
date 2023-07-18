const yargs = require('yargs');
const readline = require('readline');
const fs = require('fs');
const Pool = require('pg').Pool;

// Init Postgres client
const pgClient = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'finonex_exam_db',
    user: 'postgres',
    password: 'postgres123',
  });


// Define command line arguments
const argv = yargs
  .option('script', {
    alias: 's',
    description: 'file name',
    type: 'string',
    //demandOption: true, // Make the argument required
  })
  .help()
  .alias('help', 'h')
  .argv;

const filePath = argv._[0];

if (!filePath) {
    throw new Error('File name is missing');
}

// Upsert query to the database
const upsertQuery = `
  INSERT INTO users_revenue (user_id, revenue)
  VALUES ($1, $2)
  ON CONFLICT (user_id)
  DO UPDATE SET revenue = EXCLUDED.revenue
`;

// Read file line by line
const lineReader = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity
    });

lineReader.on('line', async (line) => {
    let event = JSON.parse(line);
    let change = event.name == 'add_revenue' ? event.value : event.value * -1;

    try {
        // Execute query
        const { rows } = await pgClient.query(upsertQuery, [event.userId, change]);
        console.log(`Query executed for line '${line}'. Result:`, rows);
        } catch (error) {
        console.error(`Error executing query for line '${line}':`, error);
        }
    });

// Close the connection when the file is read
lineReader.on('close', () => {
    console.log('File reading completed');
    pgClient.end();
});




