const { client } = require("./db");

// init function to connect to database
const init = async() => {
    await client.connect();
    console.log('connected to database');
};

init();