module.exports = function(){
    var operations = {
        GET,
        // PATCH,
        // DELETE,
    }

    async function GET(req,res,next){
        return res.status(200).json({
            "email": "poop@poop.com",
        })
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