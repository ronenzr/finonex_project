README.md

# FINONEX HOME ASSIGNMENT

## Client
The client component is responsible for sending events to the server based on an internal events file. To start the client, run the following command:

npm run client


## Server
The server component receives events from the client and saves them to an internal file. To start the server, use the following command:

npm run start


## Data Processor
The data processor component takes the events from the internal file and saves them to a database. To run the data processor, execute the following command:

npm run processor {file_name}
Replace {file_name} with the name of the file containing the events to be processed.

Note: Ensure that you have the necessary dependencies installed and properly configured before running these commands.
