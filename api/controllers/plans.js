
const db = require("../services/plans");
const etag = require("etag");
const {payloadValidation} = require("../helper/schemaValidator");


module.exports = {

    getPlanById : async(req,res) => {
        try {
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
            const payload = await db.getPlanById(req.params.id)
            if (payload){
                const del = await db.deletePlanById(req.params.id)
                if(del == true){
                    res.setHeader("ETag",payload.eTag);
                    return res.status(201).json({"msg":"Plan Deleted"});
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