const database = require('../../mongodb');
const kafka = require('../../streams/accountskafka.js');

module.exports = function(){
    const topic = process.env.ACCOUNTS_TOPIC;
    const producer = kafka.producer('account-producer');

    var operations = {
        GET,
        POST,
    }

    async function GET(req,res,next){
        console.log('~~~~~~~GET ALL ACCOUNT HIT~~~~~~~');
        const db = await database.getDB;
        var collection = db.collection('accounts');
        var accounts = await collection.find({}).toArray() 
        return res.status(200).json({accounts})
    }

    GET.apiDoc = {
        summary: "return/get all accounts",
        description: "return/get all accounts from the account collection",
        operationId: "get-accounts",
        responses: {
            200: {
                description: "OK",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: '#/components/schemas/account'
                            }
                        }
                    }
                }
            }
        }
    }

    async function POST(req, res, next){
        try {
            var email = req.body.email;
            var password = req.body.password;
            var posts = [];
            var newAccount = {email: email, password: password, posts: posts}; 

            await producer.connect()
            producer.send({
                topic: topic,
                messages: [
                    {key: "account-post", value: JSON.stringify(newAccount)},
                ]
            })
            return res.status(200).json(newAccount); 
        }catch(err) {
            console.error(err);
            return res.status(500).json(err);
        }        
    }

    POST.apiDoc = {
        summary: "create an account",
        description: "creates an account by send the data down the kafka stream and adds it to the account collection",
        operationId: "post-accounts",
        responses: {
            200: {
                description: "OK",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            items: {
                                $ref: '#/components/schemas/account'
                            }
                        }
                    }
                }
            }
        }
    }

    return operations;
}