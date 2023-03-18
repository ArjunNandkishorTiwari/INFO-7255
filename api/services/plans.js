
const redis = require("redis");
const hash = require("object-hash")
const etag = require("etag");
const db = {}
const client = redis.createClient();


db.connectionDB =  async() => {
    try {
        client.connect();
        client.on("connect", ()=> {
        console.log("Database Connection Successful");

});
       
    } catch (error) {
        console.log("Error",error);
        console.log("Database Connection Failed")

    }
    
}

db.saveNewPlan = async (req) => {
    console.log("check 9")
    //const eTag = etag(JSON.stringify(req.body));
    const eTag = hash(req.body);
    console.log("check 10")
    await client.hSet(req.body.objectId, "plan", JSON.stringify(req.body));
    console.log("check 10.1")
    await client.hSet(req.body.objectId, "eTag", eTag);
    console.log("check 10.2")
    await client.hSet(req.body.objectId, "planId", req.body.objectId);
    console.log("check 11")
    const payload = await db.getPlanById(req.body.objectId);
    console.log("check 12")
    return payload 

}

db.getPlanById = async (id) => {
    console.log("check 3")
    const payload = await client.hGetAll(id);
    if (id == payload.planId){
        console.log("check 4")
        return payload;
    } else{
        console.log("check 5")
        return  ;
    }
        
    
}

db.deletePlanById = async (id) => {
    res = await client.del(id);

    if(res == 1) {
        console.log("Res after delete",res);
        return true
    } else {
        console.log("Res after delete",res);
        return false
    }

    

    
}



module.exports = db;