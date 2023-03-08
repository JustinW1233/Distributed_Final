const database = require('../../mongodb');

module.exports = function(){
    var operations = {
        GET,
        PATCH,
        DELETE,
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
        summary: "return/get a existing post via postId",
        description: "return/get a post from the posts collection",
        operationId: "get-post",
        responses: {
            200: {
                description: "OK",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            items: {
                                $ref: '#/components/schemas/post'
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
            //                     $ref: '#/components/schemas/post'
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
            var collection = db.collection('posts');
            await collection.updateOne({id: req.params.postId}, {$set:{message: req.body.message}})

            var updatedPost = await collection.find({id: req.params.postId}).toArray();

            // producer.send({
            //     topic: topic,
            //     messages: [
            //         {key: "password-change", value: JSON.stringify(updatedUserEmail)},
            //     ]
            // })

            return res.status(200).json(updatedPost);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }

    PATCH.apiDoc = {
        summary: "update a existing post via postId",
        description: "update a post from the posts collection",
        operationId: "patch-post",
        responses: {
            200: {
                description: "OK",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            items: {
                                $ref: '#/components/schemas/post'
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
            var collection = db.collection('posts');
            var deleted = await collection.deleteMany({id: req.params.postId});
            return res.status(200).json(deleted); 
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }

    DELETE.apiDoc = {
        summary: "delete one post via postId",
        description: "delete an post from the posts collection",
        operationId: "delete-post",
        responses: {
            200: {
                description: "OK",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            items: {
                                $ref: '#/components/schemas/post'
                            }
                        }
                    }
                }
            }
        }
    }
    return operations;
}