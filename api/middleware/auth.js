
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const  config = require('config');

module.exports = {
    generateToken : () => {
        var randomVal = crypto.randomBytes(64).toString();
        payload = {
            randomValue : randomVal
        }
        var jwtToken = jwt.sign(payload,config.get("jwtSecret") , {expiresIn : 36000});

        return jwtToken
    },
    validateToken : (req)=> {
        try {

            //var token = req.header("x-auth-token");
            var token = req.headers.authorization.split(" ")[1];

            console.log("check 1")
            
            console.log("check 1.1",token);
            var decoded = jwt.verify(token, config.get("jwtSecret"));
            console.log("check 2", decoded);
            return decoded;
        } catch (error) {
            console.log("check 3",error);
            return false;
        }

        
    }
}