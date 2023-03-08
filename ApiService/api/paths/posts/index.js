const database = require('../../mongodb');

module.exports = function(){
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
        var message = req.body.message;
        var accountId = req.body.accountId;

        //Gets Id for a new post by getting a count of all the entries in in the posts collection
        const db = await database.getDB;
        var collection = db.collection('posts');
        var posts = await collection.find({}).toArray();

        var account = db.collection('accounts').findOne({id: accountId});
        console.log("~~~~~~~~~~~~~~~~~~~~~~~ACCOUNT~~~~~~~~~~~~~~~~~~~~~~~~~")
        console.log(account)

        var id = posts.length + 1
        var newpost = {id: id.toString(), message: message, accountId: accountId};

        try {
            const db = await database.getDB;
            var collection = db.collection('posts');
            var inserted = await collection.insertOne(newpost)
            return res.status(200).json(inserted); 
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