
const db = require("../services/plans");
const etag = require("etag");
const {payloadValidation} = require("../helper/schemaValidator");
const {generateToken,validateToken} = require("../middleware/auth");
const hash = require("object-hash")



module.exports = {

    getPlanById : async(req,res) => {
        try {
            if (
                req.params.id == null &&
                req.params.id == "" &&
                req.params == {}
              ) {
                res.status(400).json({ message: "invalid plan ID" });
                console.log("invalid plan ID");
                return;
              }
        //     var token = req.header("x-auth-token");
        //     if(!token){
        //         return res.status(401).json({msg : 'No token, authorization denied'});
        //    }
            result = validateToken(req);
            if (!result) {
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
            
        //     if(!token){
        //         return res.status(401).json({msg : 'No token, authorization denied'});
        //    }
            result = validateToken(req);
            if (!result) {
                return res.status(400).json({"msg":"token invalid"});
            } 
            if (payloadValidation(req)) {
                
                console.log(req.body);
                const payload = await db.getPlanById(req.body.objectId)
                if (payload){
                    return res.status(409).json({
                        "msg":"plan already exists"
                    })
                }
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
            if (
                req.params.id == null &&
                req.params.id == "" &&
                req.params == {}
              ) {
                res.status(400).json({ message: "invalid plan ID" });
                console.log("invalid plan ID");
                return;
              }
        //     // var token = req.header("x-auth-token");
        //     // if(!token){
        //     //     return res.status(401).json({msg : 'No token, authorization denied'});
        //    }
            result = validateToken(req);
            if (!result) {
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
            return res.status(500).json({
                "msg":"Error"
            })
        }
    },
    updatePlan : async (req,res) => {
        try {
            if (
                req.params.id == null &&
                req.params.id == "" &&
                req.params == {}
              ) {
                res.status(400).json({ message: "invalid plan ID" });
                console.log("invalid plan ID");
                return;
              }
            console.log("line 123")
        //     var token = req.header("x-auth-token");
        //     if(!token){
        //         return res.status(401).json({msg : 'No token, authorization denied'});
        //    }
        //     console.log("line 128")
            result = validateToken(req);
            console.log("check 1",result);
            if (!result) {
                console.log("check 2");
                return res.status(400).json({"msg":"token invalidate"});
            } 

           
                const payload = await db.getPlanById(req.params.id)
                console.log("check 6",payload)
                if (payload){
                    console.log("check 7")
                    const eTag = payload.eTag;
                    if((!req.headers['if-match'] || eTag != req.headers['if-match']) || eTag == etag(JSON.stringify(req.body))){ //hash(req.body)
                        console.log("check 7")
                        return res.setHeader("ETag", eTag).status(412).json(JSON.parse(payload.plan));
                    } else {
                        console.log("check 8")
                        const response = (await db.saveNewPlan(req));
                    console.log("check 13")
                    res.setHeader("ETag",response.eTag);
                    return res.status(201).json(JSON.parse(response.plan));

                    }
                } else{
                    console.log("check 14")
                return res.status(404).json({
                    "msg" : "Plan not found"
                })
                    
                }

           
                
           
            
        } catch (error) {
            console.log("check 15",error)
            return res.status(500).json({
                "msg":"Error"
            })
        }

    }
}