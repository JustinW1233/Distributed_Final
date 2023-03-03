const database = require('../../mongodb');

module.exports = function(){
    var operations = {
        GET,
        POST,
    }

    async function GET(req,res,next){

        console.log('GET')

        const db = await database.getDB;
        console.log('DB Collection')
        console.log(db.listCollections());
        var collection = db.collection('accounts');
        var accounts = await collection.find({}).toArray() 

        return res.status(200).json({
            email: "shitter@poop.com",
        })
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