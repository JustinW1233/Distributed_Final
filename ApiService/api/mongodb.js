const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const uri = 'mongodb://distributedmongodbfinal:27017/'; 
//const uri = 'mongodb://localhost:2717/';
const client = new MongoClient(uri);


async function getDB() {
    await client.connect();
    let databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(db.name));
    await client.db().createCollection("distributedmongodfinal")
    const collection = await client.db().collection('distributedmongod');
    console.log("Collections:")
    console.log(collection.name);
    return client.db('distributedmongodfinal');
}

module.exports.getDB = getDB();