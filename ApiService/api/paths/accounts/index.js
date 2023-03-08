const database = require('../../mongodb');

module.exports = function(){
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
        var email = req.body.email;
        var password = req.body.password;
        var posts = [];
        
        //Gets Id for a new account by getting a count of all the entries in in the account collection
        const db = await database.getDB;
        var collection = db.collection('accounts');

        var accounts = await collection.find({}).toArray();

        var id = accounts.length + 1
        var newAccount = {id: id.toString(), email: email, password: password, posts: posts};

        try {
            const db = await database.getDB;
            var collection = db.collection('accounts');
            var inserted = await collection.insertOne(newAccount)
            return res.status(200).json(inserted); 
        }catch(err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }

    POST.apiDoc = {
        summary: "create an account",
        description: "creates an account and adds it to the account collection",
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