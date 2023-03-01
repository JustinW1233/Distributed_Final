const apiDoc = {
    openapi: "3.0.1",
    info:{
        title: "Distributed Systems Final",
        description: "This Api give you data on accounts and their posts",
        version: "1.0.0"
    },
    paths:{},
    components:{
        parameters: {
            accountIdentity:{
                name: "accountId",
                in: "path",
                required: true,
                schema: {
                    $ref: "#/components/schemas/accountId"
                }
            },
            postIdentity:{
                name: "postId",
                in: "path",
                required: true,
                schema: {
                    $ref: "#/components/schemas/postId"
                }
            }
        },
        schemas: {  
            accountId:{
                type: "integer"
            },
            account: {
                type: "object",
                properties: {
                    Email: {
                        type: "string"
                    }, 
                    Password: {
                        type: "string"
                    },
                    id: {
                        $ref: "#/components/schemas/accountId"
                    },
                    Collection: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/postId"
                        }
                    }
                }
            },
            postId: {
                type: "integer"
            },
            post: {
                type: "object",
                properties:{
                    id:{
                        $ref: "#/components/schemas/postId"
                    },
                    message:{
                        type: "string"
                    }
                }
            },
            }
        }
    }

module.exports = apiDoc;