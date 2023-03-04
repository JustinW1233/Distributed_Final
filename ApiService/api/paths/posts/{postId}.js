const database = require('../../mongodb');

module.exports = function(){
    var operations = {
        GET,
        // PATCH,
        // DELETE,
    }

    async function GET(req,res,next){
        console.log("~~~~~~~GET POST BY ID HIT~~~~~~~~~")
        console.log(req.params.postId);
        try {
            const db = await database.getDB;
            var collection = db.collection('posts');
            var posts = await collection.find({id: req.params.postId}).toArray()
            return res.status(200).json(posts); 
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
    return operations;
}