
const db = require("../services/plans");
const etag = require("etag");
const {payloadValidation} = require("../helper/schemaValidator");
const {generateToken,validateToken} = require("../middleware/auth");


module.exports = {

    getPlanById : async(req,res) => {
        try {
            var token = req.header("x-auth-token");
            if(!token){
                return res.status(401).json({msg : 'No token, authorization denied'});
           }
            result = validateToken(token);
            console.log("check 4");
            if (!result) {
                console.log("check 6");
                return res.status(400).json({"msg":"token invalidate"});
            } 
            if(req.params.id == null){
                return res.status(400).json({
                    "msg":"bad request"
                })
            }
            const payload = await db.getPlanById(req.params.id)
            if (payload){
                if (req.headers['if-none-match'] && payload.eTag == req.headers['if-none-match']){
                    console.log("in if none match");
                    res.setHeader("ETag",payload.eTag);
                return res.status(304).json({
                    "msg" : "Plan not updated",
                    "plan" : payload.plan
                    
                });
                }
                console.log("get patient by id payload", payload)
                res.setHeader("ETag",payload.eTag);
                return res.status(200).json(JSON.parse(payload.plan));
            } else {
                return res.status(404).json({
                    "msg":"plan data not found"
                })
            }
            
            
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                "msg":"bad request"
            })
        }

    },
    savePlan : async(req,res) => {
        try {
            var token = req.header("x-auth-token");
            if(!token){
                return res.status(401).json({msg : 'No token, authorization denied'});
           }
            result = validateToken(token);
            console.log("check 4");
            if (!result) {
                console.log("check 6");
                return res.status(400).json({"msg":"token invalidate"});
            } 
            if (payloadValidation(req)) {
                
                console.log(req.body);
                console.log("check 0",req.body.objectId);
                const payload = await db.getPlanById(req.body.objectId)
                console.log("check 4",payload)
                if (payload){
                    console.log("check 5")
                    return res.status(403).json({
                        "msg":"plan already exists"
                    })
                }
                console.log("check 6")
                const response = (await db.saveNewPlan(req));
                
                res.setHeader("ETag",response.eTag);
                return res.status(201).json(JSON.parse(response.plan));
            } else{
                return res.status(400).json({
                    "msg" : "Bad Request"
                })
                
            }
           
        } catch (error) {
            console.log(error)
        }

    },
    deletePlanById : async (req,res) => {
        try {
            var token = req.header("x-auth-token");
            if(!token){
                return res.status(401).json({msg : 'No token, authorization denied'});
           }
            result = validateToken(token);
            console.log("check 4");
            if (!result) {
                console.log("check 6");
                return res.status(400).json({"msg":"token invalidate"});
            } 
            const payload = await db.getPlanById(req.params.id)

            if (payload){
                const del = await db.deletePlanById(req.params.id)
                if(del == true){
                    res.setHeader("ETag",payload.eTag);
                    return res.status(204).json({"msg":"Plan Deleted"});
                } else{
                    return res.status(500).json({"msg":"Plan Could not be deleted"});
                }
                
                
            } else {
                return res.status(404).json({
                    "msg":"plan data not found"
                })
            }
        } catch (error) {
            
        }
    }
}