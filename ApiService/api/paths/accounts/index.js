module.exports = function(){
    var operations = {
        GET,
        // PATCH,
        // DELETE,
    }

    async function GET(req,res,next){
        return res.status(200).json({
            email: "poop@poop.com",
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
}