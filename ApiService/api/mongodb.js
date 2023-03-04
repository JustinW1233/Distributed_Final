const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const uri = 'mongodb://distributedmongodbfinal:27017/'; 
//const uri = 'mongodb://localhost:2717/';
const client = new MongoClient(uri);


async function getDB() {
    await client.connect();
    let databasesList = await client.db().admin().listDatabases();

    //These try catches are to create the collection in the database
    try{
        await client.db("Final").createCollection("accounts");
    } catch(err){
        console.log("collection `accounts` already exists");
    }
    try{
        await client.db("Final").createCollection("posts");
    } catch(err){
        console.log("collection `posts` already exists");
    }

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(db.name));
    return client.db('Final');
}

module.exports.getDB = getDB();