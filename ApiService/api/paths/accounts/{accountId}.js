const database = require('../../mongodb');
const kafka = require('../../streams/accountskafka.js');

module.exports = function(){
    const topic = process.env.ACCOUNTS_TOPIC;
    const producer = kafka.producer('account-producer');

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
        console.log('~~~~~~~PATCH ACCOUNT HIT~~~~~~~');
        try {
            var idToUpdate = req.params.accountId
            var newPassword = req.body.password
            var jsonObj = {id: idToUpdate, password: newPassword}

            await producer.connect();
            producer.send({
                topic: topic,
                messages: [
                    {key: "account-patch", value: JSON.stringify(jsonObj)},
                ]
            })

            return res.status(200).json(jsonObj);
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
        console.log('~~~~~~~DELETE ACCOUNT HIT~~~~~~~');
        try {
            await producer.connect();
            producer.send({
                topic: topic,
                messages: [
                    {key: "account-delete", value: req.params.accountId},
                ]
            })
            return res.status(200).json(req.params.accountId); 
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