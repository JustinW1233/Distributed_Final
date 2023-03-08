const database = require('../../mongodb');

module.exports = function(){
    var operations = {
        GET,
        PATCH,
        DELETE,
    }

    async function GET(req,res,next){
        console.log("~~~~~~~GET ACCOUNT BY ID HIT~~~~~~~~~")
        console.log(req.params.accountId);
        try {
            const db = await database.getDB;
            var collection = db.collection('accounts');
            var accounts = await collection.find({id: req.params.accountId}).toArray()
            return res.status(200).json(accounts); 
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }

    GET.apiDoc = {
        summary: "return/get a existing account via accountId",
        description: "return/get a account from the account collection",
        operationId: "get-account",
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
            },
            // 404: {
            //     description: "resource not found",
            //     content: {
            //         "application/json": {
            //             schema: {
            //                 type: "object",
            //                 items: {
            //                     $ref: '#/components/schemas/account'
            //                 }
            //             }
            //         }
            //     }
            // }
        }
    }

    async function PATCH(req, res, next) {
        //await producer.connect();
        try {
            const db = await database.getDB;
            var collection = db.collection('accounts');
            await collection.updateOne({id: req.params.accountId}, {$set:{password: req.body.password}})

            var updatedAccount = await collection.find({id: req.params.accountId}).toArray();

            // producer.send({
            //     topic: topic,
            //     messages: [
            //         {key: "password-change", value: JSON.stringify(updatedUserEmail)},
            //     ]
            // })

            return res.status(200).json(updatedAccount);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }

    PATCH.apiDoc = {
        summary: "update a existing account via accountId",
        description: "update a account from the account collection",
        operationId: "patch-account",
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

    async function DELETE(req,res,next){
        try {
            const db = await database.getDB;
            var collection = db.collection('accounts');
            var deleted = await collection.deleteMany({id: req.params.accountId});
            return res.status(200).json(deleted); 
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }

    DELETE.apiDoc = {
        summary: "delete one account via accountId",
        description: "delete an account from the account collection",
        operationId: "delete-account",
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