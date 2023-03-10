const { json } = require("stream/consumers");
const accountskafka = require('./streams/accountskafka.js');
const postskafka = require('./streams/postskafka.js');
const database = require('./mongodb');


// async..await is not allowed in global scope, must use a wrapper
async function main() {
  const accountsConsumer = accountskafka.consumer({ groupId: 'acconts-consumer' })
  await accountsConsumer.connect()
  await accountsConsumer.subscribe({ topics: [process.env.ACCOUNTS_TOPIC] })
  
  const postsConsumer = postskafka.consumer({ groupId: 'posts-consumer' })
  await postsConsumer.connect()
  await postsConsumer.subscribe({topics: [process.env.POSTS_TOPIC]})

  await accountsConsumer.run({
      eachMessage: ({ topic, partition, message, heartbeat, pause }) => {
        const jsonObject = JSON.parse(message.value.toString());
        console.log("~~~~~~~~~~~~~~~~~~~~~JSONOBJ for accounts~~~~~~~~~~~~~~~~~~~~~~~~~")
        console.log(jsonObject)

        if(message.key == 'account-post'){
          CreateAccount(jsonObject)
        }
        if(message.key == 'account-patch'){
          PatchAccount(jsonObject)
        }
        if(message.key == 'account-delete'){
          DeleteAccount(message.value.toString())
        }
    },
  })

  await postsConsumer.run({
    eachMessage: ({ topic, partition, message, heartbeat, pause }) => {
      const jsonObject = JSON.parse(message.value.toString());
      console.log("~~~~~~~~~~~~~~~~~~~~~JSONOBJ for posts~~~~~~~~~~~~~~~~~~~~~~~~~")
      console.log(jsonObject)

      if(message.key == 'post-post'){
        CreatePost(jsonObject)
      }
      if(message.key == 'post-patch'){
        PatchPost(jsonObject)
      }
      if(message.key == 'post-delete'){
        DeletePost(message.value.toString())
      }
    }
  })
}

async function CreateAccount(jsonObject) {
  console.log("~~~~~~~~CreateAccountHit~~~~~~~~");
  //Gets Id for a new account by getting a count of all the entries in in the account collection
  const db = await database.getDB;
  var collection = db.collection('accounts');
  var accounts = await collection.find({}).toArray();

  var id = accounts.length + 1
  var newAccount = {id: id.toString(), email: jsonObject.email, password: jsonObject.password, posts: jsonObject.posts};

  try {
    const db = await database.getDB;
    var collection = db.collection('accounts');
    var inserted = await collection.insertOne(newAccount);
    console.log(inserted);
  }catch(err) {
    console.error(err);
  }
}

async function PatchAccount(jsonObject) {
  console.log("~~~~~~~~PatchAccountHit~~~~~~~~");
  const db = await database.getDB;
  var collection = db.collection('accounts');

  try{
    await collection.updateOne({id: jsonObject.id}, {$set:{password: jsonObject.password}})
  } catch(err) {
    console.error(err);
  }
}

async function DeleteAccount(id) {
  console.log("~~~~~~~~DeleteAccountHit~~~~~~~~");
  console.log(id)
  try {
    const db = await database.getDB;
    var collection = db.collection('accounts');
    await collection.deleteMany({id: id});
  } catch (err) {
    console.error(err);
  }
}

async function CreatePost(jsonObject) {
  console.log("~~~~~~~~CreatePostHit~~~~~~~~");
  //Gets Id for a new post by getting a count of all the entries in in the posts collection
  const db = await database.getDB;
  var collection = db.collection('posts');
  var posts = await collection.find({}).toArray();

  var account = await db.collection('accounts').findOne({id: jsonObject.accountId});
  
  var id = posts.length + 1
  account.posts.push("localhost:420/posts/" + id);

  await db.collection('accounts').updateOne({id: jsonObject.accountId}, {$set:{posts: account.posts}});
  var newpost = {id: id.toString(), message: jsonObject.message, accountId: jsonObject.accountId};

  try {
    const db = await database.getDB;
    var collection = db.collection('posts');
    var inserted = await collection.insertOne(newpost);
    console.log(inserted);
  }catch(err) {
    console.error(err);
  }
}

async function PatchPost(jsonObject) {
  console.log("~~~~~~~~PatchPostHit~~~~~~~~");
  const db = await database.getDB;
  var collection = db.collection('posts');
  try{
    await collection.updateOne({id: jsonObject.id}, {$set:{message: jsonObject.message}})
  } catch(err) {
    console.error(err);
  }
}

async function DeletePost(id) {
  console.log("~~~~~~~~DeletePostHit~~~~~~~~");
  console.log(id, "<--- thats the id")
  try {
    const db = await database.getDB;
    var collection = db.collection('posts');
    await collection.deleteMany({id: id});
  } catch (err) {   
    console.error(err);
  }
}

main().catch(console.error);