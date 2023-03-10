const { json } = require('express');
const database = require('../../mongodb');
const kafka = require('../../streams/postskafka.js');

module.exports = function(){
    const topic = process.env.POSTS_TOPIC;
    const producer = kafka.producer('posts-producer');
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
        console.log("~~~~~~~PATCH POST BY ID HIT~~~~~~~~~")
        await producer.connect();
        try {
            var postId = req.params.postId;
            var message = req.body.message;
            var jsonObj = {id: postId, message: message}
            producer.send({
                topic: topic,
                messages: [
                    {key: "post-patch", value: JSON.stringify(jsonObj)},
                ]
            })

            return res.status(200).json(jsonObj);
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
        console.log("~~~~~~~DELETE POST BY ID HIT~~~~~~~~~")
        await producer.connect();
        try {
            producer.send({
                topic: topic,
                messages: [
                    {key: "post-delete", value: JSON.stringify(req.params.postId)},
                ]
            })
            return res.status(200).json(req.params.postId); 
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