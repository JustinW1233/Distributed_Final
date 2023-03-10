const database = require('../../mongodb');
const kafka = require('../../streams/postskafka.js');

module.exports = function(){
    const topic = process.env.POSTS_TOPIC;
    const producer = kafka.producer('posts-producer');
    var operations = {
        GET,
        POST,
    }

    async function GET(req,res,next){
        console.log('~~~~~~~GET ALL POSTS HIT~~~~~~~');
        const db = await database.getDB;
        var collection = db.collection('posts');
        var posts = await collection.find({}).toArray() 
        return res.status(200).json({posts})
    }

    GET.apiDoc = {
        summary: "return/get all posts",
        description: "return/get all posts from the post collection",
        operationId: "get-posts",
        responses: {
            200: {
                description: "OK",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: '#/components/schemas/post'
                            }
                        }
                    }
                }
            }
        }
    }

    async function POST(req, res, next){
        console.log('~~~~~~~CREATE POSTS HIT~~~~~~~');
        try {
            var message = req.body.message;
            var accountId = req.body.accountId;
            var newPost = {message: message, accountId: accountId}
            
            await producer.connect()
            producer.send({
                topic: topic,
                messages: [
                    {key: "post-post", value: JSON.stringify(newPost)},
                ]
            })
            return res.status(200).json(newPost); 
        }catch(err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }

    POST.apiDoc = {
        summary: "create an post",
        description: "creates an post and adds it to the post collection",
        operationId: "post-posts",
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